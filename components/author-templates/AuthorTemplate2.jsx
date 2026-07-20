// components/author-templates/AuthorTemplate2.jsx
// Variation 2: full-width black hero (photo, name/role/bio, Education +
// Notable Works list), light Quote/About/Background/Beyond Writing 4-col
// row, dark "Latest From" horizontal strip, More From grid + pagination.
"use client";

import { AuthorArticleCard, AuthorPagination } from "./AuthorShared";
import { DEFAULT_AUTHOR_QUOTE, DEFAULT_AUTHOR_EXTRAS } from "@/lib/authorTemplateDefaults";

export default function AuthorTemplate2({ author, articles, pagination }) {
  const quote = author.quote || DEFAULT_AUTHOR_QUOTE;
  const extras = author.extras?.background ? author.extras : DEFAULT_AUTHOR_EXTRAS;
  const latest = (author.latestWorks?.length ? author.latestWorks : author.notableWorks || []).slice(0, 3);

  return (
    <main className="min-h-screen bg-white">
      {/* Full black hero */}
      <div className="bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 sm:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10">
            <div className="lg:col-span-3 flex justify-center lg:justify-start">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40">
                <div className="absolute -inset-2 rounded-full bg-red-500/40 -z-10" />
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-gray-700">
                  <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 text-center lg:text-left">
              {author.role && (
                <p className="font-[family-name:var(--font-scale)] text-[11px] font-bold uppercase tracking-widest text-red-500 mb-2">
                  {author.role}
                </p>
              )}
              <h1 className="font-[family-name:var(--font-owners-xnarrow)] text-3xl sm:text-4xl md:text-5xl font-black uppercase leading-[0.95] mb-4">
                {author.name}
              </h1>
              {author.bio && (
                <p className="font-[family-name:var(--font-owners-text)] text-sm text-gray-300 leading-relaxed mb-4">{author.bio}</p>
              )}
              <div className="flex flex-col sm:flex-row items-center lg:items-start gap-2 sm:gap-6 text-xs font-[family-name:var(--font-owners-text)] text-gray-400 justify-center lg:justify-start">
                {author.email && <span>✉ {author.email}</span>}
                {author.location && <span>📍 {author.location}</span>}
              </div>
            </div>
            <div className="lg:col-span-3 border-t lg:border-t-0 lg:border-l border-gray-800 pt-6 lg:pt-0 lg:pl-8">
              {author.education && (
                <div className="mb-6">
                  <h3 className="font-[family-name:var(--font-scale)] text-[11px] font-bold uppercase tracking-widest text-white mb-1">Education</h3>
                  <p className="font-[family-name:var(--font-owners-text)] text-sm text-gray-400">{author.education}</p>
                </div>
              )}
              {author.notableWorks?.length > 0 && (
                <div>
                  <h3 className="font-[family-name:var(--font-scale)] text-[11px] font-bold uppercase tracking-widest text-white mb-2">Notable Works</h3>
                  <ul className="flex flex-col gap-2.5">
                    {author.notableWorks.slice(0, 3).map((w, i) => (
                      <li key={i} className="flex gap-2 items-start">
                        <span className="text-red-500 mt-1 text-[8px]">●</span>
                        <a href={w.href || "#"} className="font-[family-name:var(--font-owners-text)] text-xs text-gray-300 hover:text-white hover:underline leading-snug">{w.title}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quote / About / Background / Beyond Writing row */}
      <div className="bg-gray-50 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="bg-white rounded-lg p-5">
              <span className="text-red-600 text-2xl font-serif leading-none">&ldquo;</span>
              <p className="font-[family-name:var(--font-bitter)] italic text-sm text-gray-800 leading-snug mt-1 mb-3">{quote}</p>
              <div className="h-0.5 w-8 bg-red-600 mb-2" />
              <p className="font-[family-name:var(--font-scale)] text-[10px] font-bold uppercase tracking-widest text-gray-500">{author.name}</p>
            </div>
            <div className="bg-white rounded-lg p-5">
              <span className="text-xl mb-2 block">✏️</span>
              <h3 className="font-[family-name:var(--font-scale)] text-[11px] font-bold uppercase tracking-widest text-gray-900 mb-2">About</h3>
              <p className="font-[family-name:var(--font-owners-text)] text-[13px] text-gray-600 leading-relaxed">{author.about?.[0] || ""}</p>
            </div>
            <div className="bg-white rounded-lg p-5">
              <span className="text-xl mb-2 block">🌍</span>
              <h3 className="font-[family-name:var(--font-scale)] text-[11px] font-bold uppercase tracking-widest text-gray-900 mb-2">Background</h3>
              <p className="font-[family-name:var(--font-owners-text)] text-[13px] text-gray-600 leading-relaxed">{extras.background}</p>
            </div>
            <div className="bg-white rounded-lg p-5">
              <span className="text-xl mb-2 block">☕</span>
              <h3 className="font-[family-name:var(--font-scale)] text-[11px] font-bold uppercase tracking-widest text-gray-900 mb-2">Beyond Writing</h3>
              <p className="font-[family-name:var(--font-owners-text)] text-[13px] text-gray-600 leading-relaxed">{extras.beyondWriting}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Latest From strip (dark) */}
      {latest.length > 0 && (
        <div className="bg-gray-950 py-8 sm:py-10">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <h2 className="font-[family-name:var(--font-owners-xnarrow)] text-base sm:text-lg font-black uppercase text-white">
                Latest From <span className="text-red-500">{author.name?.split(" ")[0] || ""}</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {latest.map((work, i) => (
                <a key={i} href={work.href || "#"} className="group flex gap-3 bg-gray-900 rounded-lg overflow-hidden">
                  <div className="w-24 sm:w-28 shrink-0 aspect-square overflow-hidden bg-gray-800">
                    {work.image && <img src={work.image} alt={work.title} className="w-full h-full object-cover" />}
                  </div>
                  <div className="py-3 pr-3 min-w-0">
                    {work.publication && (
                      <span className="font-[family-name:var(--font-scale)] text-[9px] font-bold uppercase tracking-widest text-red-500">{work.publication}</span>
                    )}
                    <p className="font-[family-name:var(--font-owners-text)] text-[13px] text-white leading-snug group-hover:underline mt-1">{work.title}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* More From grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 sm:py-10">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h2 className="font-[family-name:var(--font-owners-xnarrow)] text-sm font-black uppercase tracking-widest text-red-600">
            More From {author.name}
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-10">
          {articles.map((a) => <AuthorArticleCard key={a.id} article={a} />)}
        </div>
        <AuthorPagination current={pagination.currentPage} total={pagination.totalPages} />
      </div>
    </main>
  );
}
