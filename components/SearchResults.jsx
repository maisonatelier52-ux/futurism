"use client";
// components/SearchResults.jsx
// Rendered by app/search/page.jsx. Starts from the server-fetched initial
// results (for the query already in the URL, if any) and re-searches
// client-side as the person types, without a full page reload. Updates
// the URL via history.replaceState (not a Next.js navigation) so the
// current search stays bookmarkable/shareable without adding a new
// history entry per keystroke.
import { useState, useEffect, useRef } from "react";
import { Search, Loader2 } from "lucide-react";
import { API_BASE } from "@/lib/apiConfig";

function ArticleCard({ article }) {
  return (
    <a href={article.href || "#"} className="group flex flex-col gap-2">
      <div className="w-full aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-[#1c1c24]">
        {article.image && (
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        )}
      </div>
      {article.category && (
        <span className="font-[family-name:var(--font-scale)] text-[9px] font-semibold uppercase tracking-widest text-red-600">
          {article.category}
        </span>
      )}
      <h3 className="font-[family-name:var(--font-owners-xnarrow)] text-sm font-black uppercase leading-tight text-gray-900 dark:text-gray-100 group-hover:underline break-words">
        {article.title}
      </h3>
      {article.excerpt && (
        <p className="font-[family-name:var(--font-owners-text)] text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
          {article.excerpt}
        </p>
      )}
    </a>
  );
}

export default function SearchResults({ initialQuery, initialArticles, initialTotal }) {
  const [query, setQuery] = useState(initialQuery);
  const [articles, setArticles] = useState(initialArticles);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(!!initialQuery);
  // Tracks whether the query currently in state has already been searched,
  // so the debounce effect below doesn't immediately re-fetch the exact
  // results the server already sent on first load.
  const skipNextFetch = useRef(!!initialQuery);

  useEffect(() => {
    if (skipNextFetch.current) {
      skipNextFetch.current = false;
      return;
    }
    const trimmed = query.trim();
    if (!trimmed) {
      setArticles([]);
      setTotal(0);
      setSearched(false);
      window.history.replaceState(null, "", "/search");
      return;
    }

    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ search: trimmed, limit: "20" });
        const res = await fetch(`${API_BASE}/api/articles?${params.toString()}`, { cache: "no-store" });
        const d = res.ok ? await res.json() : { articles: [], total: 0 };
        setArticles(d.articles || []);
        setTotal(d.total || 0);
      } catch {
        setArticles([]);
        setTotal(0);
      } finally {
        setSearched(true);
        setLoading(false);
        window.history.replaceState(null, "", `/search?q=${encodeURIComponent(trimmed)}`);
      }
    }, 400);

    return () => clearTimeout(t);
  }, [query]);

  return (
    <main className="min-h-screen bg-white dark:bg-[#15151c]">
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-10">
        <h1 className="font-[family-name:var(--font-owners-xnarrow)] text-3xl font-black uppercase text-gray-900 dark:text-gray-100 mb-6">
          Search
        </h1>

        <div className="relative mb-8 max-w-xl">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles…"
            autoFocus
            className="w-full h-12 pl-12 pr-4 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1c1c24] text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/50 text-[15px]"
          />
          {loading && (
            <Loader2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />
          )}
        </div>

        {searched && !loading && (
          <p className="font-[family-name:var(--font-owners-text)] text-sm text-gray-500 dark:text-gray-400 mb-6">
            {total > 0
              ? `${total} result${total === 1 ? "" : "s"} for "${query.trim()}"`
              : `No results for "${query.trim()}"`}
          </p>
        )}

        {!searched && !loading && (
          <p className="font-[family-name:var(--font-owners-text)] text-sm text-gray-400 dark:text-gray-500">
            Start typing to search articles by title or summary.
          </p>
        )}

        {articles.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {articles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
