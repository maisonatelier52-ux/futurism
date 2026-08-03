"use client";

import { useEffect, useState, useCallback } from "react";
import AdminShell from "@/components/layout/AdminShell";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { apiFetch, API_BASE } from "@/lib/apiConfig";
import { Mail, Search, Download, Trash2, MailX } from "lucide-react";

const STATUS_FILTERS = [
  { value: "", label: "All" },
  { value: "active", label: "Subscribed" },
  { value: "inactive", label: "Unsubscribed" },
];

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const { showToast } = useToast();

  const load = useCallback(async (p = 1, statusFilter = "", searchTerm = "") => {
    setSubscribers(null);
    const qs = new URLSearchParams({
      page: String(p),
      limit: "25",
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(searchTerm ? { search: searchTerm } : {}),
    });
    const res = await apiFetch(`/api/admin/subscribers?${qs}`);
    if (!res.ok) {
      showToast("Failed to load subscribers", { type: "error" });
      setSubscribers([]);
      return;
    }
    const data = await res.json();
    setSubscribers(data.subscribers || []);
    setPages(data.pages || 1);
    setTotal(data.total || 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { load(page, status, search); }, [page, status, search, load]);

  // Debounce the search box so it doesn't fire a request on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  async function handleDelete(sub) {
    if (!confirm(`Remove ${sub.email} from your subscriber list? This can't be undone.`)) return;
    setDeletingId(sub._id);
    try {
      const res = await apiFetch(`/api/admin/subscribers/${sub._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showToast("Subscriber removed");
      load(page, status, search);
    } catch {
      showToast("Failed to remove subscriber", { type: "error" });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <AdminShell title="Subscribers">
      <div className="p-5 lg:p-8 max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl font-bold text-ink-900">Subscribers</h2>
            <p className="text-sm text-ink-500 mt-1">
              Everyone who signed up through a newsletter box on your site{total ? ` — ${total} total` : ""}.
            </p>
          </div>
          <a
            href={`${API_BASE}/api/admin/subscribers/export`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-white text-[12.5px] font-semibold hover:bg-primary-600 shadow-soft"
          >
            <Download size={14} /> Export CSV
          </a>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by email…"
              className="w-full rounded-lg border border-border bg-white pl-9 pr-3 py-2 text-[13.5px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
            />
          </div>
          <div className="flex gap-2">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => { setStatus(f.value); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-[12.5px] font-medium border transition-colors ${
                  status === f.value
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-ink-600 border-border hover:border-primary/40"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-card border border-border bg-white shadow-soft overflow-hidden">
          {subscribers === null ? (
            <div className="p-5 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : subscribers.length === 0 ? (
            <EmptyState
              icon={Mail}
              title={search || status ? "No matching subscribers" : "No subscribers yet"}
              description={
                search || status
                  ? "Try a different search term or filter."
                  : "When someone signs up through a newsletter box on your site, they'll show up here."
              }
            />
          ) : (
            <div className="divide-y divide-border">
              {subscribers.map((sub) => (
                <div key={sub._id} className="px-5 py-3.5 flex items-center gap-3">
                  <div className={`h-8 w-8 shrink-0 rounded-lg flex items-center justify-center ${
                    sub.isActive ? "bg-primary-50 text-primary" : "bg-gray-100 text-ink-400"
                  }`}>
                    {sub.isActive ? <Mail size={14} /> : <MailX size={14} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-ink-900 truncate">{sub.email}</p>
                    <p className="text-[12px] text-ink-400 mt-0.5">
                      {sub.isActive ? "Subscribed" : "Unsubscribed"} {formatDate(sub.createdAt)}
                      {sub.source ? ` · via ${sub.source}` : ""}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(sub)}
                    disabled={deletingId === sub._id}
                    className="p-2 rounded-lg text-ink-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-50 shrink-0"
                    title="Remove subscriber"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
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
