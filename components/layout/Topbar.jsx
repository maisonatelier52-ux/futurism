"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, Bell, ChevronDown, Plus, Menu, LogOut, User, Settings as SettingsIcon, Mail, Newspaper, UserCircle, FolderTree, History } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiConfig";

import { canAccess } from "@/lib/permissions";

const LAST_SEEN_KEY = "futurism-admin-notifs-last-seen";

const ENTITY_ICONS = {
  subscriber: Mail,
  article: Newspaper,
  author: UserCircle,
  category: FolderTree,
};

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function describe(entry) {
  if (entry.message) return entry.message;
  const label = entry.entityLabel ? ` "${entry.entityLabel}"` : "";
  return `${entry.actor || "System"} ${entry.action} ${entry.entityType}${label}`;
}

export default function Topbar({ onMenuClick, title, session }) {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null); // null = not searched yet
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const [notifications, setNotifications] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const profileRef = useRef(null);
  const notifRef   = useRef(null);
  const canCreateArticles = canAccess(session?.permissions, "articles");
  const canSeeSettings = canAccess(session?.permissions, "settings");
  // Notifications reuse the Activity Log, so an account without that
  // permission (Editor/Stylist by default) sees no bell content either --
  // same access boundary as the Activity Log page itself, not a separate
  // permission to manage.
  const canSeeNotifications = canAccess(session?.permissions, "activity-log");
  const roleLabel = session?.role === "editor" ? "Editor" : session?.role === "stylist" ? "Stylist" : "Admin";

  const loadNotifications = useCallback(async () => {
    const res = await apiFetch("/api/admin/activity-log/recent?limit=8");
    if (!res.ok) return;
    const data = await res.json();
    const entries = data.entries || [];
    setNotifications(entries);

    let lastSeen = 0;
    try {
      lastSeen = Number(window.localStorage.getItem(LAST_SEEN_KEY)) || 0;
    } catch {
      // localStorage can throw in private-browsing/blocked-storage contexts
      // -- just treat everything as unread in that case rather than crash.
    }
    setUnreadCount(entries.filter((e) => new Date(e.createdAt).getTime() > lastSeen).length);
  }, []);

  useEffect(() => {
    if (!canSeeNotifications) return;
    loadNotifications();
    // Poll every 60s so a subscribe (or other admin action) shows up as a
    // notification without needing a full page refresh.
    const interval = setInterval(loadNotifications, 60000);
    return () => clearInterval(interval);
  }, [canSeeNotifications, loadNotifications]);

  function handleOpenNotifications() {
    setNotifOpen((v) => !v);
    // Mark everything currently loaded as seen -- opening the panel is the
    // "I've checked" signal, matching how most notification bells behave.
    if (!notifOpen) {
      try {
        window.localStorage.setItem(LAST_SEEN_KEY, String(Date.now()));
      } catch {
        // ignore -- badge just won't persist across reloads in this case
      }
      setUnreadCount(0);
    }
  }

  useEffect(() => {
    function handleClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current   && !notifRef.current.contains(e.target))   setNotifOpen(false);
      if (searchRef.current  && !searchRef.current.contains(e.target))  setSearchOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Debounced live search as the person types -- fires the combined
  // Articles/Authors/Categories search endpoint, not on every keystroke.
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setSearchResults(null);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await apiFetch(`/api/admin/search?q=${encodeURIComponent(trimmed)}`);
        const data = res.ok ? await res.json() : { articles: [], authors: [], categories: [] };
        setSearchResults(data);
      } catch {
        setSearchResults({ articles: [], authors: [], categories: [] });
      } finally {
        setSearchLoading(false);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const hasSearchResults =
    searchResults &&
    (searchResults.articles.length || searchResults.authors.length || searchResults.categories.length);

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

      <div className="relative flex-1 max-w-md" ref={searchRef}>
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
          onFocus={() => setSearchOpen(true)}
          placeholder="Search articles, categories…"
          className="w-full rounded-lg border border-border bg-surface-soft pl-9 pr-3 py-2 text-[13.5px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition"
        />
        {searchOpen && searchQuery.trim() && (
          <div className="absolute left-0 right-0 mt-2 rounded-card border border-border bg-white shadow-lift overflow-hidden z-30 max-h-96 overflow-y-auto">
            {searchLoading ? (
              <p className="px-4 py-4 text-[12.5px] text-ink-400">Searching…</p>
            ) : !hasSearchResults ? (
              <p className="px-4 py-4 text-[12.5px] text-ink-400">No results for "{searchQuery.trim()}"</p>
            ) : (
              <>
                {searchResults.articles.length > 0 && (
                  <div>
                    <p className="px-4 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-ink-400">Articles</p>
                    {searchResults.articles.map((a) => (
                      <Link key={a.id} href={a.editHref} onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-surface-soft">
                        <Newspaper size={13} className="text-ink-400 shrink-0" />
                        <span className="text-[13px] text-ink-900 truncate">{a.title}</span>
                        {!a.isPublished && <span className="text-[10px] text-ink-400 shrink-0">Draft</span>}
                      </Link>
                    ))}
                  </div>
                )}
                {searchResults.authors.length > 0 && (
                  <div>
                    <p className="px-4 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-ink-400">Authors</p>
                    {searchResults.authors.map((a) => (
                      <Link key={a.id} href={a.editHref} onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-surface-soft">
                        <User size={13} className="text-ink-400 shrink-0" />
                        <span className="text-[13px] text-ink-900 truncate">{a.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
                {searchResults.categories.length > 0 && (
                  <div>
                    <p className="px-4 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-ink-400">Categories</p>
                    {searchResults.categories.map((c) => (
                      <Link key={c.id} href={c.editHref} onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-surface-soft pb-2.5">
                        <FolderTree size={13} className="text-ink-400 shrink-0" />
                        <span className="text-[13px] text-ink-900 truncate">{c.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex-1" />

      {canCreateArticles && (
        <Link
          href="/admin/articles"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-primary-600 shadow-soft transition-colors"
        >
          <Plus size={15} /> Create
        </Link>
      )}

      {/* Notifications */}
      {canSeeNotifications && (
        <div className="relative" ref={notifRef}>
          <button
            onClick={handleOpenNotifications}
            className="relative h-9 w-9 flex items-center justify-center rounded-lg text-ink-500 hover:bg-surface-soft hover:text-ink-900 transition-colors"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-card border border-border bg-white shadow-lift overflow-hidden">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <p className="text-[13px] font-semibold text-ink-900">Notifications</p>
                <Link href="/admin/activity-log" className="text-[11.5px] font-medium text-primary hover:underline">
                  View all
                </Link>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications === null ? (
                  <p className="px-4 py-4 text-[12.5px] text-ink-400">Loading…</p>
                ) : notifications.length === 0 ? (
                  <p className="px-4 py-4 text-[12.5px] text-ink-400">No activity yet.</p>
                ) : (
                  notifications.map((n) => {
                    const Icon = ENTITY_ICONS[n.entityType] || History;
                    return (
                      <div key={n._id} className="px-4 py-2.5 hover:bg-surface-soft border-b border-border last:border-b-0 flex items-start gap-2.5">
                        <div className="h-6 w-6 rounded-md bg-primary-50 text-primary flex items-center justify-center shrink-0 mt-0.5">
                          <Icon size={12} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[12.5px] text-ink-900 leading-snug">{describe(n)}</p>
                          <p className="text-[11px] text-ink-400 mt-0.5">{timeAgo(n.createdAt)}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Profile */}
      <div className="relative" ref={profileRef}>
        <button
          onClick={() => setProfileOpen((v) => !v)}
          className="flex items-center gap-2 rounded-lg pl-1 pr-2 py-1 hover:bg-surface-soft transition-colors"
        >
          <div className="h-8 w-8 rounded-full bg-red-100 text-primary flex items-center justify-center text-[12.5px] font-bold">
            {(session?.username || "A").charAt(0).toUpperCase()}
          </div>
          <span className="hidden md:block text-[13px] font-medium text-ink-700">{session?.username || roleLabel}</span>
          <ChevronDown size={14} className="text-ink-400" />
        </button>
        {profileOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-card border border-border bg-white shadow-lift overflow-hidden py-1">
            <div className="px-3.5 py-2 text-[11.5px] text-ink-400 uppercase tracking-wide border-b border-border">{roleLabel}</div>
            {canSeeSettings && (
              <Link href="/admin/settings" className="w-full flex items-center gap-2 px-3.5 py-2 text-[13px] text-ink-700 hover:bg-surface-soft">
                <SettingsIcon size={15} /> Settings
              </Link>
            )}
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
