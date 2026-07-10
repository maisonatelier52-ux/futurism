"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { apiFetch } from "@/lib/apiConfig";

// Client-side auth guard: since the backend now lives on a separate origin,
// its admin_token cookie is never sent back to Next.js's own server for a
// middleware-level check (proxy.js used to do this, but a cross-origin
// cookie set by the backend is invisible to Next's server). Instead, every
// admin page (via this shared shell) asks the backend "am I logged in?"
// on mount and redirects to /admin/login if not.
export default function AdminShell({ title, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let active = true;
    apiFetch("/api/admin/auth/me")
      .then((res) => {
        if (!active) return;
        if (res.ok) {
          setAuthorized(true);
        } else {
          router.replace(`/admin/login?next=${encodeURIComponent(pathname || "/admin/dashboard")}`);
        }
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
  }, []);

  if (checking || !authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-soft">
        <p className="text-sm text-ink-400">Checking session…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-surface-soft">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setSidebarOpen(true)} title={title} />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
