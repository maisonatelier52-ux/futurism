// components/author-templates/AuthorTemplate3.jsx
// Variation 3: minimal light hero (small avatar, inline name/role/bio),
// 2-col Recent Articles list + pull-quote side by side, More From grid +
// pagination. No category sidebar.
"use client";

import { AuthorArticleCard, AuthorPagination } from "./AuthorShared";
import { DEFAULT_AUTHOR_QUOTE, DEFAULT_AUTHOR_ARTICLES } from "@/lib/authorTemplateDefaults";

export default function AuthorTemplate3({ author, articles, pagination }) {
  const quote = author.quote || DEFAULT_AUTHOR_QUOTE;
  const recent = (articles.length ? articles : DEFAULT_AUTHOR_ARTICLES).slice(0, 3);

  return (
    <main className="min-h-screen bg-white">
      {/* Minimal hero */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 sm:py-10">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-gray-100 shrink-0">
            <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="font-[family-name:var(--font-owners-xnarrow)] text-2xl sm:text-3xl font-black uppercase text-gray-900 leading-none">
              {author.name}
            </h1>
            {author.role && (
              <p className="font-[family-name:var(--font-scale)] text-[11px] font-semibold uppercase tracking-widest text-gray-500 mt-1.5">
                {author.role}
              </p>
            )}
          </div>
          <div className="flex-1 sm:pl-4">
            {author.about?.[0] && (
              <p className="font-[family-name:var(--font-owners-text)] text-sm text-gray-700 leading-relaxed mb-2">{author.about[0]}</p>
            )}
            {author.about?.[1] && (
              <p className="font-[family-name:var(--font-owners-text)] text-sm text-gray-700 leading-relaxed">{author.about[1]}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-6 text-xs font-[family-name:var(--font-owners-text)] text-gray-500 mt-5 justify-center sm:justify-start border-t border-gray-100 pt-5">
          {author.email && <span>✉ {author.email}</span>}
          {author.location && <span>📍 {author.location}</span>}
        </div>
      </div>

      {/* Recent Articles + Quote */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-8 sm:pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-5 sm:p-6">
            <h2 className="font-[family-name:var(--font-scale)] text-xs font-bold uppercase tracking-widest text-red-600 border-b-2 border-red-600 pb-2 mb-4 inline-block">
              Recent Articles
            </h2>
            <ul className="flex flex-col gap-4">
              {recent.map((a) => (
                <li key={a.id} className="flex gap-3 items-start">
                  {a.image && (
                    <div className="w-14 h-14 shrink-0 overflow-hidden bg-gray-100 rounded">
                      <img src={a.image} alt={a.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <a href={a.href || "#"} className="group">
                    <p className="font-[family-name:var(--font-owners-text)] text-sm text-gray-900 leading-snug group-hover:underline">{a.title}</p>
                  </a>
                </li>
              ))}
            </ul>
            <a href="#more-from-author" className="mt-4 inline-block bg-gray-900 text-white font-[family-name:var(--font-scale)] text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded hover:bg-gray-800 transition-colors">
              View All Articles
            </a>
          </div>

          <div className="bg-gray-50 rounded-lg p-5 sm:p-6 flex flex-col justify-center">
            <span className="text-red-600 text-3xl font-serif leading-none mb-2">&ldquo;</span>
            <p className="font-[family-name:var(--font-bitter)] italic text-lg text-gray-800 leading-snug mb-4">{quote}</p>
            <div className="h-0.5 w-10 bg-red-600 mb-2" />
            <p className="font-[family-name:var(--font-scale)] text-xs font-bold uppercase tracking-widest text-gray-900">{author.name}</p>
            {author.role && (
              <p className="font-[family-name:var(--font-owners-text)] text-xs text-gray-500">{author.role}, Futurism</p>
            )}
          </div>
        </div>
      </div>

      {/* More From grid */}
      <div id="more-from-author" className="max-w-7xl mx-auto px-6 md:px-12 pb-8 sm:pb-10 scroll-mt-24">
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
