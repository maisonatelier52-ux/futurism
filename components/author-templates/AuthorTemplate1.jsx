// components/author-templates/AuthorTemplate1.jsx
// Variation 1: light bio hero (photo + name/bio/email/location), gray About
// band with 2-col text + pull-quote, Education/Years/Focus Areas stat row,
// black Notable Works numbered strip, More From with category filter
// sidebar + article grid + pagination.
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AuthorArticleCard, AuthorPagination } from "./AuthorShared";
import { DEFAULT_AUTHOR_STATS, DEFAULT_AUTHOR_QUOTE, DEFAULT_AUTHOR_CATEGORY_FILTERS } from "@/lib/authorTemplateDefaults";

export default function AuthorTemplate1({ author, articles, pagination }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stats = author.stats?.education ? author.stats : DEFAULT_AUTHOR_STATS;
  const quote = author.quote || DEFAULT_AUTHOR_QUOTE;
  const filters = author.categoryFilters?.length ? author.categoryFilters : DEFAULT_AUTHOR_CATEGORY_FILTERS;
  const activeFilter = searchParams.get("category") || filters[0];

  function selectFilter(cat) {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === filters[0]) {
      params.delete("category");
    } else {
      params.set("category", cat);
    }
    params.delete("page"); // reset pagination when changing filter
    router.push(`?${params.toString()}`);
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Bio hero */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10 sm:pt-14 pb-8 sm:pb-10">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 sm:gap-10">
          <div className="relative flex-shrink-0 w-40 h-40 sm:w-48 sm:h-48">
            <div className="absolute -inset-3 sm:-inset-4 rounded-full bg-gray-100 -z-10" />
            <div className="absolute top-2 right-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-500/70 -z-10" />
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-sm">
              <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="font-[family-name:var(--font-owners-xnarrow)] text-4xl sm:text-5xl font-black uppercase leading-[0.9] text-gray-900 mb-3 break-words">
              {author.name}
            </h1>
            <div className="h-1 w-14 bg-red-600 mb-4 mx-auto sm:mx-0" />
            {author.bio && (
              <p className="font-[family-name:var(--font-owners-text)] text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto sm:mx-0 mb-4">
                {author.bio}
              </p>
            )}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-6 text-xs font-[family-name:var(--font-owners-text)] text-gray-500">
              {author.email && <span>✉ {author.email}</span>}
              {author.location && <span>📍 {author.location}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Gray About band */}
      <div className="bg-gray-50 py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="font-[family-name:var(--font-scale)] text-xs font-bold uppercase tracking-widest text-gray-900 mb-3">
                About {author.name?.split(" ")[0] || ""}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {(author.about?.length ? author.about : ["", ""]).slice(0, 2).map((para, i) => (
                  <p key={i} className="font-[family-name:var(--font-owners-text)] text-[13px] text-gray-600 leading-relaxed">{para}</p>
                ))}
              </div>
            </div>
            <div className="lg:border-l border-gray-300 lg:pl-8 flex flex-col justify-center">
              <span className="text-red-600 text-3xl font-serif leading-none mb-2">&ldquo;</span>
              <p className="font-[family-name:var(--font-bitter)] italic text-base text-gray-800 leading-snug mb-3">{quote}</p>
              <p className="font-[family-name:var(--font-scale)] text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                — {author.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stat row */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎓</span>
            <div>
              <p className="font-[family-name:var(--font-scale)] text-[11px] font-bold uppercase tracking-widest text-gray-900">Education</p>
              <p className="font-[family-name:var(--font-owners-text)] text-sm text-gray-600">{stats.education}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">📅</span>
            <div>
              <p className="font-[family-name:var(--font-scale)] text-[11px] font-bold uppercase tracking-widest text-gray-900">Years at Futurism</p>
              <p className="font-[family-name:var(--font-owners-text)] text-sm text-gray-600">Since {stats.yearsSince}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎯</span>
            <div>
              <p className="font-[family-name:var(--font-scale)] text-[11px] font-bold uppercase tracking-widest text-gray-900">Focus Areas</p>
              <p className="font-[family-name:var(--font-owners-text)] text-sm text-gray-600">{stats.focusAreas}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notable Works strip */}
      {author.notableWorks?.length > 0 && (
        <div className="bg-gray-950 py-8 sm:py-10">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <h2 className="font-[family-name:var(--font-owners-xnarrow)] text-lg font-black uppercase tracking-wide text-white break-words">Notable Works</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              {author.notableWorks.slice(0, 3).map((work, i) => (
                <a key={i} href={work.href || "#"} className="group flex flex-col gap-2 border-t-2 border-red-600 pt-3">
                  <span className="font-[family-name:var(--font-scale)] text-xs font-black text-red-500">{String(i + 1).padStart(2, "0")}</span>
                  <p className="font-[family-name:var(--font-owners-text)] text-sm text-white leading-snug group-hover:underline">{work.title}</p>
                  <span className="font-[family-name:var(--font-scale)] text-[9px] font-bold uppercase tracking-widest text-gray-500">{work.publication}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* More From + category filter sidebar */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-4 border border-gray-200 rounded-lg overflow-hidden">
              {filters.map((cat) => (
                <button key={cat} onClick={() => selectFilter(cat)}
                  className={`w-full text-left px-4 py-2.5 text-sm border-b border-gray-100 last:border-b-0 transition-colors ${
                    activeFilter === cat ? "bg-gray-900 text-white font-semibold" : "text-gray-600 hover:bg-gray-50"
                  }`}>
                  {cat}
                </button>
              ))}
            </div>
          </aside>
          <div className="lg:col-span-9">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-10">
              {articles.map((a) => <AuthorArticleCard key={a.id} article={a} />)}
            </div>
            <AuthorPagination current={pagination.currentPage} total={pagination.totalPages} />
          </div>
        </div>
      </div>
    </main>
  );
}
