"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/layout/AdminShell";
import { useToast } from "@/components/ui/Toast";
import { apiFetch } from "@/lib/apiConfig";
import {
  Newspaper, Eye, Users2, TrendingUp, PanelTop, PanelBottom, LayoutTemplate,
  ArrowRight, UserCircle, FolderTree, Settings as SettingsIcon,
  ShieldCheck, History, Mail,
} from "lucide-react";
import Link from "next/link";

const BUILDERS = [
  { href: "/admin/header-builder",   title: "Header Builder",   desc: "Edit navigation, logo, breaking news",    icon: PanelTop },
  { href: "/admin/footer-builder",   title: "Footer Builder",   desc: "Manage footer columns & links",           icon: PanelBottom },
  { href: "/admin/homepage-builder", title: "Homepage Builder", desc: "Drag & drop your homepage layout",        icon: LayoutTemplate },
];

const QUICK_LINKS = [
  { href: "/admin/articles",   label: "New Article",  icon: Newspaper },
  { href: "/admin/authors",    label: "Authors",      icon: UserCircle },
  { href: "/admin/categories", label: "Categories",   icon: LayoutTemplate },
  { href: "/admin/settings",   label: "Settings",     icon: PanelTop },
];

const ENTITY_ICONS = {
  article: Newspaper,
  author: UserCircle,
  category: FolderTree,
  settings: SettingsIcon,
  admin: ShieldCheck,
  subscriber: Mail,
};

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function describeActivity(entry) {
  if (entry.message) return entry.message;
  const label = entry.entityLabel ? ` "${entry.entityLabel}"` : "";
  return `${entry.action} ${entry.entityType}${label}`;
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    let active = true;

    apiFetch("/api/admin/dashboard/stats")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => { if (active) setStats(d.stats); })
      .catch(() => { if (active) showToast("Failed to load dashboard stats", { type: "error" }); });

    apiFetch("/api/admin/activity-log/recent?limit=6")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => { if (active) setActivity(d.entries || []); })
      .catch(() => { if (active) setActivity([]); });

    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const STATS = [
    {
      label: "Published Articles",
      value: stats ? stats.publishedArticles : "—",
      delta: stats ? `${stats.totalArticles} total (incl. drafts)` : "from MongoDB",
      icon: Newspaper,
    },
    {
      label: "Total Views",
      value: stats ? stats.totalViews.toLocaleString() : "—",
      delta: stats ? "all-time, tracked live" : "from MongoDB",
      icon: Eye,
    },
    {
      label: "Active Authors",
      value: stats ? stats.activeAuthors : "—",
      delta: stats ? `${stats.totalAuthors} total authors` : "from MongoDB",
      icon: Users2,
    },
    {
      label: "Avg. Read Time",
      value: stats && stats.avgReadTimeMinutes != null ? `${stats.avgReadTimeMinutes} min` : "—",
      delta: stats && stats.avgReadTimeMinutes == null ? "no read times set yet" : "across published articles",
      icon: TrendingUp,
    },
  ];

  return (
    <AdminShell title="Dashboard">
      <div className="p-5 lg:p-8 max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-ink-900">Welcome back</h2>
          <p className="text-sm text-ink-500 mt-1">Manage your Futurism content from here.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="rounded-card border border-border bg-white p-5 shadow-soft">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[12.5px] font-medium text-ink-500">{s.label}</span>
                  <div className="h-8 w-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary">
                    <Icon size={15} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-ink-900">{s.value}</p>
                <p className="text-[12px] text-ink-400 mt-1">{s.delta}</p>
              </div>
            );
          })}
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-2 mb-8">
          {QUICK_LINKS.map((q) => {
            const Icon = q.icon;
            return (
              <Link key={q.href} href={q.href}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-white hover:border-primary/40 hover:bg-primary-50 text-[13px] font-medium text-ink-700 hover:text-primary shadow-soft transition-all">
                <Icon size={14} />{q.label}
              </Link>
            );
          })}
        </div>

        {/* Builder shortcuts */}
        <h3 className="text-[13px] font-semibold text-ink-500 uppercase tracking-wide mb-3">Visual Builders</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {BUILDERS.map((b) => {
            const Icon = b.icon;
            return (
              <Link key={b.href} href={b.href}
                className="group rounded-card border border-border bg-white p-5 shadow-soft hover:shadow-lift hover:border-primary/30 transition-all">
                <div className="h-9 w-9 rounded-lg bg-primary-50 flex items-center justify-center text-primary mb-3">
                  <Icon size={17} />
                </div>
                <p className="text-[14px] font-semibold text-ink-900">{b.title}</p>
                <p className="text-[12.5px] text-ink-500 mt-1">{b.desc}</p>
                <span className="inline-flex items-center gap-1 text-[12.5px] font-medium text-primary mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  Open builder <ArrowRight size={13} />
                </span>
              </Link>
            );
          })}
        </div>

        {/* Recent activity */}
        <div className="rounded-card border border-border bg-white shadow-soft overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-ink-900">Recent Activity</h3>
            <Link href="/admin/activity-log" className="text-[12.5px] font-medium text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {activity === null ? (
              <div className="px-5 py-6 text-[13px] text-ink-400">Loading…</div>
            ) : activity.length === 0 ? (
              <div className="px-5 py-6 text-[13px] text-ink-400 flex items-center gap-2">
                <History size={14} /> No activity recorded yet.
              </div>
            ) : (
              activity.map((entry) => {
                const Icon = ENTITY_ICONS[entry.entityType] || History;
                return (
                  <div key={entry._id} className="px-5 py-3.5 flex items-center gap-3">
                    <div className="h-7 w-7 shrink-0 rounded-lg bg-primary-50 flex items-center justify-center text-primary">
                      <Icon size={13} />
                    </div>
                    <p className="text-[13px] text-ink-700 flex-1 min-w-0">
                      <span className="font-semibold text-ink-900">{entry.actor || "System"}</span>{" "}
                      {describeActivity(entry)}
                    </p>
                    <span className="text-[12px] text-ink-400 whitespace-nowrap shrink-0">{timeAgo(entry.createdAt)}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
