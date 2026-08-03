"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { apiFetch } from "@/lib/apiConfig";
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
export default function AdminShell({ title, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checking, setChecking] = useState(true);
  const [session, setSession] = useState(null); // { username, role, permissions } once authorized
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let active = true;
    apiFetch("/api/admin/auth/me")
      .then(async (res) => {
        if (!active) return;
        if (!res.ok) {
          router.replace(`/admin/login?next=${encodeURIComponent(pathname || "/admin/dashboard")}`);
          return;
        }
        const data = await res.json();
        const admin = data.admin || {};
        const permissions = admin.permissions ?? null;

        // Find the sidebar item (if any) whose href this page falls under,
        // then check the session is allowed to see it. Pages with no
        // matching PERMISSION_ITEMS entry (e.g. /admin/login itself is
        // never wrapped in AdminShell, but a future standalone page might
        // be) are left ungated rather than blocked by default.
        const matchedItem = PERMISSION_ITEMS.find((item) =>
          item.href === "/admin/dashboard" ? pathname === item.href : pathname?.startsWith(item.href)
        );
        if (matchedItem && !canAccess(permissions, matchedItem.key)) {
          router.replace(firstAccessibleHref(permissions));
          return;
        }

        setSession({ username: admin.username, role: admin.role, permissions });
      })
      .catch(() => {
        if (active) router.replace("/admin/login");
      })
      .finally(() => {
        if (active) setChecking(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (checking || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-soft">
        <p className="text-sm text-ink-400">Checking session…</p>
      </div>
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
