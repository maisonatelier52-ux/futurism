"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Newspaper, FolderTree, LayoutTemplate,
  PanelTop, PanelBottom, ImageIcon, Users2, Settings as SettingsIcon,
  UserCircle, X, LogOut,
} from "lucide-react";
import { useState } from "react";
import { apiFetch } from "@/lib/apiConfig";

const NAV_ITEMS = [
  { href: "/admin/dashboard",        label: "Dashboard",        icon: LayoutDashboard },
  { href: "/admin/articles",         label: "Articles",         icon: Newspaper },
  { href: "/admin/categories",       label: "Categories",       icon: FolderTree },
  { href: "/admin/category-page-builder", label: "Category Page Builder", icon: LayoutTemplate },
  { href: "/admin/authors",          label: "Authors",          icon: UserCircle },
  { href: "/admin/homepage-builder", label: "Homepage Builder", icon: LayoutTemplate },
  { href: "/admin/header-builder",   label: "Header Builder",   icon: PanelTop },
  { href: "/admin/footer-builder",   label: "Footer Builder",   icon: PanelBottom },
  { href: "/admin/media-library",    label: "Media Library",    icon: ImageIcon },
  { href: "/admin/users",            label: "Users",            icon: Users2 },
  { href: "/admin/settings",         label: "Settings",         icon: SettingsIcon },
];

export default function Sidebar({ open, onClose }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await apiFetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <>
      {/* Mobile scrim */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 shrink-0 bg-[#1a1a2e] flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 lg:z-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-white/10">
          <div>
<div className="h-16 flex items-center">
  <Image
    src="/images/logo-admin-panel.webp"
    alt="Futurism"
    width={155}
    height={55}
    priority
    className="w-auto h-12 object-contain"
  />
</div>
            <span className="block text-[10px] -mt-3 text-red-400 uppercase tracking-widest">
              Admin Panel
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-white/40 hover:text-white p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/admin/dashboard"
                ? pathname === "/admin/dashboard"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
                  active
                    ? "bg-red-600 text-white"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon
                  size={16}
                  strokeWidth={2.1}
                  className={active ? "text-white" : "text-white/40"}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] text-white/50 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut size={16} />
            {loggingOut ? "Signing out…" : "Sign Out"}
          </button>
        </div>
      </aside>
    </>
  );
}
