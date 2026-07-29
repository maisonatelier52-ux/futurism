"use client";

import { useEffect, useState, useCallback } from "react";
import AdminShell from "@/components/layout/AdminShell";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { apiFetch } from "@/lib/apiConfig";
import {
  History, Newspaper, UserCircle, FolderTree, Settings as SettingsIcon,
  ShieldCheck, Trash2, RefreshCw,
} from "lucide-react";

const ENTITY_ICONS = {
  article: Newspaper,
  author: UserCircle,
  category: FolderTree,
  settings: SettingsIcon,
  admin: ShieldCheck,
};

const ENTITY_FILTERS = [
  { value: "", label: "All" },
  { value: "article", label: "Articles" },
  { value: "author", label: "Authors" },
  { value: "category", label: "Categories" },
  { value: "admin", label: "Account" },
  { value: "settings", label: "Settings" },
];

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

function describe(entry) {
  if (entry.message) return entry.message;
  const label = entry.entityLabel ? ` "${entry.entityLabel}"` : "";
  return `${entry.action} ${entry.entityType}${label}`;
}

export default function ActivityLogPage() {
  const [entries, setEntries] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [filter, setFilter] = useState("");
  const [clearing, setClearing] = useState(false);
  const { showToast } = useToast();

  const load = useCallback(async (p = 1, entityType = "") => {
    setEntries(null);
    const qs = new URLSearchParams({ page: String(p), limit: "20", ...(entityType ? { entityType } : {}) });
    const res = await apiFetch(`/api/admin/activity-log?${qs}`);
    if (!res.ok) { showToast("Failed to load activity log", { type: "error" }); setEntries([]); return; }
    const data = await res.json();
    setEntries(data.entries || []);
    setPages(data.pages || 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { load(page, filter); }, [page, filter, load]);

  async function handleClear() {
    if (!confirm("Clear the entire activity log? This cannot be undone.")) return;
    setClearing(true);
    try {
      const res = await apiFetch("/api/admin/activity-log", { method: "DELETE" });
      if (!res.ok) throw new Error();
      showToast("Activity log cleared");
      setPage(1);
      load(1, filter);
    } catch {
      showToast("Failed to clear activity log", { type: "error" });
    } finally {
      setClearing(false);
    }
  }

  return (
    <AdminShell title="Activity Log">
      <div className="p-5 lg:p-8 max-w-4xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl font-bold text-ink-900">Activity Log</h2>
            <p className="text-sm text-ink-500 mt-1">A record of actions taken across the admin panel.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => load(page, filter)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-white hover:bg-surface-soft text-[12.5px] font-medium text-ink-700"
            >
              <RefreshCw size={13} /> Refresh
            </button>
            <button
              onClick={handleClear}
              disabled={clearing}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-200 bg-white hover:bg-red-50 text-[12.5px] font-medium text-red-600 disabled:opacity-60"
            >
              <Trash2 size={13} /> {clearing ? "Clearing…" : "Clear log"}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-5">
          {ENTITY_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => { setFilter(f.value); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-[12.5px] font-medium border transition-colors ${
                filter === f.value
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-ink-600 border-border hover:border-primary/40"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="rounded-card border border-border bg-white shadow-soft overflow-hidden">
          {entries === null ? (
            <div className="p-5 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : entries.length === 0 ? (
            <EmptyState
              icon={History}
              title="No activity yet"
              description="Actions like publishing articles, editing authors, or updating settings will show up here."
            />
          ) : (
            <div className="divide-y divide-border">
              {entries.map((entry) => {
                const Icon = ENTITY_ICONS[entry.entityType] || History;
                return (
                  <div key={entry._id} className="px-5 py-3.5 flex items-center gap-3">
                    <div className="h-8 w-8 shrink-0 rounded-lg bg-primary-50 flex items-center justify-center text-primary">
                      <Icon size={14} />
                    </div>
                    <p className="text-[13px] text-ink-700 flex-1 min-w-0">
                      <span className="font-semibold text-ink-900">{entry.actor || "System"}</span>{" "}
                      {describe(entry)}
                    </p>
                    <span className="text-[12px] text-ink-400 whitespace-nowrap shrink-0">{timeAgo(entry.createdAt)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded-lg border border-border bg-white text-[12.5px] font-medium text-ink-600 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-[12.5px] text-ink-500">Page {page} of {pages}</span>
            <button
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page >= pages}
              className="px-3 py-1.5 rounded-lg border border-border bg-white text-[12.5px] font-medium text-ink-600 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
