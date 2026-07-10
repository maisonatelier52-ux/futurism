"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Bell, ChevronDown, Plus, Menu, LogOut, User, Settings as SettingsIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiConfig";

export default function Topbar({ onMenuClick, title }) {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen,   setNotifOpen]   = useState(false);
  const profileRef = useRef(null);
  const notifRef   = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current   && !notifRef.current.contains(e.target))   setNotifOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    await apiFetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-white/95 backdrop-blur px-4 lg:px-6">
      <button onClick={onMenuClick} className="lg:hidden text-ink-500 hover:text-ink-900">
        <Menu size={20} />
      </button>

      {title && (
        <h1 className="hidden md:block text-[15px] font-semibold text-ink-900 mr-2">{title}</h1>
      )}

      <div className="relative flex-1 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
        <input
          type="text"
          placeholder="Search articles, categories…"
          className="w-full rounded-lg border border-border bg-surface-soft pl-9 pr-3 py-2 text-[13.5px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition"
        />
      </div>

      <div className="flex-1" />

      <Link
        href="/admin/articles"
        className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-primary-600 shadow-soft transition-colors"
      >
        <Plus size={15} /> Create
      </Link>

      {/* Notifications */}
      <div className="relative" ref={notifRef}>
        <button
          onClick={() => setNotifOpen((v) => !v)}
          className="relative h-9 w-9 flex items-center justify-center rounded-lg text-ink-500 hover:bg-surface-soft hover:text-ink-900 transition-colors"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>
        {notifOpen && (
          <div className="absolute right-0 mt-2 w-72 rounded-card border border-border bg-white shadow-lift overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <p className="text-[13px] font-semibold text-ink-900">Notifications</p>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {[
                { title: "Homepage layout saved", time: "2m ago" },
                { title: "New article submitted", time: "1h ago" },
                { title: "Footer links updated", time: "3h ago" },
              ].map((n, i) => (
                <div key={i} className="px-4 py-2.5 hover:bg-surface-soft border-b border-border last:border-b-0">
                  <p className="text-[13px] text-ink-900">{n.title}</p>
                  <p className="text-[11.5px] text-ink-400 mt-0.5">{n.time}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Profile */}
      <div className="relative" ref={profileRef}>
        <button
          onClick={() => setProfileOpen((v) => !v)}
          className="flex items-center gap-2 rounded-lg pl-1 pr-2 py-1 hover:bg-surface-soft transition-colors"
        >
          <div className="h-8 w-8 rounded-full bg-red-100 text-primary flex items-center justify-center text-[12.5px] font-bold">
            F
          </div>
          <span className="hidden md:block text-[13px] font-medium text-ink-700">Admin</span>
          <ChevronDown size={14} className="text-ink-400" />
        </button>
        {profileOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-card border border-border bg-white shadow-lift overflow-hidden py-1">
            <Link href="/admin/settings" className="w-full flex items-center gap-2 px-3.5 py-2 text-[13px] text-ink-700 hover:bg-surface-soft">
              <SettingsIcon size={15} /> Settings
            </Link>
            <div className="h-px bg-border my-1" />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3.5 py-2 text-[13px] text-red-600 hover:bg-red-50"
            >
              <LogOut size={15} /> Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
