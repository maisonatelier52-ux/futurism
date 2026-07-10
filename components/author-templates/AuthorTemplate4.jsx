// components/author-templates/AuthorTemplate4.jsx
// Variation 4 (Default): centered avatar, name/role, stacked About /
// Education / Notable Works, "More From" grid + pagination. This is your
// original app/authors/[slug]/page.jsx layout, now content-driven via the
// `author` and `articles` props.
"use client";

import { AuthorArticleCard, AuthorPagination } from "./AuthorShared";

export default function AuthorTemplate4({ author, articles, pagination }) {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-10 sm:py-12">
        {/* Author Profile */}
        <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-6 mb-8 sm:mb-10">
          <div className="flex-shrink-0 w-24 h-24 sm:w-36 sm:h-36 rounded-full overflow-hidden border border-gray-200 bg-gray-100 mx-auto sm:mx-0">
            <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col gap-2 pt-1 items-center sm:items-start text-center sm:text-left w-full">
            <h1 className="font-[family-name:var(--font-owners-xnarrow)] text-3xl sm:text-4xl md:text-5xl font-black uppercase leading-none text-gray-900">
              {author.name}
            </h1>
            <p className="font-[family-name:var(--font-scale)] text-xs font-semibold uppercase tracking-widest text-gray-500">
              {author.role}
            </p>
            {author.bluesky && (
              <a href="#" className="text-blue-500 hover:text-blue-700 mt-1 text-xl" title="Bluesky">🦋</a>
            )}
          </div>
        </div>

        {/* About */}
        {author.about?.length > 0 && (
          <div className="mb-8">
            <h2 className="font-[family-name:var(--font-owners-xnarrow)] text-xl font-black uppercase text-gray-900 mb-4">About</h2>
            <div className="flex flex-col gap-4">
              {author.about.map((para, i) => (
                <p key={i} className="font-[family-name:var(--font-owners-text)] text-sm text-gray-700 leading-relaxed">{para}</p>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {author.education && (
          <div className="mb-8">
            <h2 className="font-[family-name:var(--font-owners-xnarrow)] text-xl font-black uppercase text-gray-900 mb-3">Education</h2>
            <p className="font-[family-name:var(--font-owners-text)] text-sm text-gray-700">{author.education}</p>
          </div>
        )}

        {/* Notable Works */}
        {author.notableWorks?.length > 0 && (
          <div className="mb-10 sm:mb-12">
            <h2 className="font-[family-name:var(--font-owners-xnarrow)] text-xl font-black uppercase text-gray-900 mb-4">Notable Works</h2>
            <ul className="flex flex-col gap-4">
              {author.notableWorks.map((work, i) => (
                <li key={i} className="flex flex-col gap-0.5 pl-4 border-l-2 border-gray-200">
                  <a href={work.href || "#"} className="font-[family-name:var(--font-owners-text)] text-sm text-blue-600 hover:underline leading-snug">{work.title}</a>
                  <span className="font-[family-name:var(--font-scale)] text-[9px] font-bold uppercase tracking-widest text-gray-400">{work.publication}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* More From Author */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="border-b border-gray-300 pb-3 mb-6 sm:mb-8">
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
