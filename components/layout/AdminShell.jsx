"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { apiFetch } from "@/lib/apiConfig";
import { getCachedSession, setCachedSession, clearCachedSession } from "@/lib/adminSession";
import { PERMISSION_ITEMS, canAccess, firstAccessibleHref } from "@/lib/permissions";

// Client-side auth guard: since the backend now lives on a separate origin,
// its admin_token cookie is never sent back to Next.js's own server for a
// middleware-level check (proxy.js used to do this, but a cross-origin
// cookie set by the backend is invisible to Next's server). Instead, every
// admin page (via this shared shell) asks the backend "am I logged in?"
// on mount and redirects to /admin/login if not.
//
// This also doubles as the permission gate: Editor/Stylist sessions carry
// a `permissions` array (Admin's is null, meaning "sees everything" -- see
// lib/permissions.js). If the current page isn't in that list, the user is
// redirected to the first page they DO have access to, rather than shown a
// page whose sidebar link they'd never have been able to click anyway.
//
// WHY THE RETRY / TIMEOUT LOGIC
// The backend runs on Render's free tier, which sleeps after ~15 min idle
// and takes 30-60s to wake. The old check had no timeout, so the screen sat
// on "Checking session..." for that whole time (or forever if the backend
// was down). Now each attempt is capped, a "server is waking up" hint shows
// up after a few seconds, a few retries cover a normal cold start, and if
// the backend is truly unreachable the person gets a Retry button instead
// of a dead spinner. Only a real 401/403 sends them to the login page --
// a slow or failing backend does NOT log anyone out.
const ATTEMPT_TIMEOUT_MS = 20000;
const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1500;
const SLOW_HINT_AFTER_MS = 4000;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Result kinds: "ok" (with data), "unauthorized", "unreachable"
async function fetchSession(isActive) {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await apiFetch("/api/admin/auth/me", { timeoutMs: ATTEMPT_TIMEOUT_MS, cache: "no-store" });
      if (!isActive()) return { kind: "cancelled" };
      if (res.status === 401 || res.status === 403) return { kind: "unauthorized" };
      if (res.ok) {
        const data = await res.json();
        return { kind: "ok", admin: data.admin || {} };
      }
      // 5xx / 502 from Render while it's still booting -> retry
    } catch {
      if (!isActive()) return { kind: "cancelled" };
      // timeout, network error or CORS failure (Render's boot-up 502 has no
      // CORS headers, so the browser reports it as a network error) -> retry
    }
    if (attempt < MAX_ATTEMPTS) await sleep(RETRY_DELAY_MS);
  }
  return { kind: "unreachable" };
}

function Centered({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-soft px-4">
      <div className="text-center max-w-sm">{children}</div>
    </div>
  );
}

export default function AdminShell({ title, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [session, setSession] = useState(() => getCachedSession()); // { username, role, permissions } once authorized
  const [slow, setSlow] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attemptId, setAttemptId] = useState(0); // bump to re-run the check (Retry button)
  const router = useRouter();
  const pathname = usePathname();

  const runCheck = useCallback(
    async (isActive) => {
      const hadCached = !!getCachedSession();
      setFailed(false);
      setSlow(false);
      const slowTimer = hadCached ? null : setTimeout(() => isActive() && setSlow(true), SLOW_HINT_AFTER_MS);

      const result = await fetchSession(isActive);
      if (slowTimer) clearTimeout(slowTimer);
      if (!isActive() || result.kind === "cancelled") return;

      if (result.kind === "unauthorized") {
        clearCachedSession();
        router.replace(`/admin/login?next=${encodeURIComponent(pathname || "/admin/dashboard")}`);
        return;
      }

      if (result.kind === "unreachable") {
        // Backend can't be reached. If we already had a verified session in
        // memory, keep showing the page rather than blanking it out.
        if (!hadCached) setFailed(true);
        return;
      }

      const admin = result.admin;
      const permissions = admin.permissions ?? null;

      // Find the sidebar item (if any) whose href this page falls under,
      // then check the session is allowed to see it. Pages with no
      // matching PERMISSION_ITEMS entry are left ungated rather than
      // blocked by default.
      const matchedItem = PERMISSION_ITEMS.find((item) =>
        item.href === "/admin/dashboard" ? pathname === item.href : pathname?.startsWith(item.href)
      );
      if (matchedItem && !canAccess(permissions, matchedItem.key)) {
        router.replace(firstAccessibleHref(permissions));
        return;
      }

      const next = { username: admin.username, role: admin.role, permissions };
      setCachedSession(next);
      setSession(next);
    },
    [router, pathname]
  );

  useEffect(() => {
    let active = true;
    runCheck(() => active);
    return () => {
      active = false;
    };
  }, [runCheck, attemptId]);

  if (!session) {
    if (failed) {
      return (
        <Centered>
          <p className="text-base font-semibold text-ink-900">Can&apos;t reach the server</p>
          <p className="mt-2 text-sm text-ink-400">
            The backend didn&apos;t respond. It may be starting up or temporarily offline.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              onClick={() => setAttemptId((n) => n + 1)}
              className="h-9 px-4 rounded-md bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
            >
              Try again
            </button>
            <button
              onClick={() => router.replace("/admin/login")}
              className="h-9 px-4 rounded-md border border-gray-300 text-sm font-medium text-ink-700 hover:bg-white"
            >
              Go to login
            </button>
          </div>
        </Centered>
      );
    }
    return (
      <Centered>
        <p className="text-sm text-ink-400">Checking session…</p>
        {slow && (
          <p className="mt-2 text-xs text-ink-400">
            The server is waking up — this can take up to a minute on the first visit.
          </p>
        )}
      </Centered>
    );
  }

  return (
    <div className="flex min-h-screen bg-surface-soft">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} session={session} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setSidebarOpen(true)} title={title} session={session} />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
