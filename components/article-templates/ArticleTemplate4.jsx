// components/article-templates/ArticleTemplate4.jsx
// Variation 4 (Default): widened hero image, 8/4 grid, Most Popular + sticky
// ad sidebar, Around the Web + More in Category grids. This is your
// original app/articles/[slug]/page.jsx layout, now content-driven via the
// `article` and `related` props so it works for any real saved article.
"use client";

import ArticleBody from "./ArticleBody";
import { AuthorByline, CategoryTag } from "../shared/ArticleLinks";

function ArticleCard({ article }) {
  return (
    <div className="group flex flex-col gap-2">
      <a href={article.href || "#"} className="flex flex-col gap-2">
        <div className="w-full aspect-[4/3] overflow-hidden bg-gray-200">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
        </div>
        <span className="font-[family-name:var(--font-scale)] text-[10px] font-semibold uppercase tracking-widest text-red-600 mt-1">{article.category}</span>
        <h3 className="font-[family-name:var(--font-owners-xnarrow)] text-base font-black uppercase leading-tight text-gray-900 group-hover:underline">{article.title}</h3>
      </a>
      <p className="font-[family-name:var(--font-owners-text)] text-xs text-gray-500">
        <AuthorByline author={article.author} authorHref={article.authorHref} nameClassName="font-semibold text-gray-700" />
      </p>
    </div>
  );
}

function AdPlaceholder() {
  return (
    <div className="w-full overflow-hidden bg-gray-100 border border-gray-200">
      <img src="/images/advert.jpg" alt="Advertisement" className="w-full h-auto object-cover" />
    </div>
  );
}

export default function ArticleTemplate4({ article, related }) {
  const { mostPopular, aroundTheWeb, moreInCategory } = related;

  return (
    <main className="min-h-screen bg-white">
      {/* Top: Article + Sidebar grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT: Article Content */}
          <article className="lg:col-span-8">
            <p className="font-[family-name:var(--font-scale)] text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-2">
              <CategoryTag category={article.category} categoryHref={article.categoryHref} />
            </p>
            {article.tag && (
              <p className="font-[family-name:var(--font-scale)] text-[11px] font-bold uppercase tracking-widest text-red-600 mb-3">
                {article.tag}
              </p>
            )}
            <h1 className="font-[family-name:var(--font-owners-xnarrow)] text-4xl md:text-5xl font-black uppercase leading-none text-gray-900 mb-4">
              {article.title}
            </h1>
            <p className="font-[family-name:var(--font-bitter)] italic text-xl text-gray-600 mb-4">
              {article.excerpt}
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs font-[family-name:var(--font-owners-text)] text-gray-500 mb-6 pb-4 border-b border-gray-200">
              <span>By</span>
              <a href={article.author.href || "#"} className="font-semibold text-gray-800 underline">{article.author.name}</a>
              <span>/</span>
              <span>Published {article.publishedAt}</span>
            </div>

            <div className="w-full mb-2 overflow-hidden bg-gray-100">
              <img src={article.heroImage} alt={article.title} className="w-full h-auto object-cover" />
            </div>
            {article.heroCaption && (
              <p className="font-[family-name:var(--font-owners-text)] text-[10px] text-gray-400 mb-6">
                {article.heroCaption}
              </p>
            )}

            <div className="border border-gray-200 bg-gray-50 px-6 py-5 mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <p className="font-[family-name:var(--font-bitter)] italic text-lg text-gray-900 leading-snug">
                  Sign up to see the future, today
                </p>
                <p className="font-[family-name:var(--font-owners-text)] text-xs text-gray-500 mt-1">
                  Can't-miss innovations from the bleeding edge of science and tech
                </p>
              </div>
              <div className="flex gap-2 flex-1 sm:max-w-sm">
                <input type="email" placeholder="Enter your email"
                  className="flex-1 h-10 px-3 border border-gray-300 text-sm font-[family-name:var(--font-owners-text)] focus:outline-none bg-white" />
                <button className="h-10 px-5 bg-red-600 hover:bg-red-700 text-white font-[family-name:var(--font-scale)] font-bold uppercase tracking-widest text-xs rounded-full transition-colors whitespace-nowrap">
                  Sign Up
                </button>
              </div>
            </div>

            <ArticleBody blocks={article.body} />

            {/* Author Bio Card */}
            <div className="mt-12 pt-6 border-t border-gray-200 flex items-start gap-4">
              <a href={article.author.href || "#"} className="flex-shrink-0">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200">
                  <img src={article.author.avatar} alt={article.author.name} className="w-full h-full object-cover" />
                </div>
              </a>
              <div>
                <a href={article.author.href || "#"} className="font-[family-name:var(--font-owners-xnarrow)] text-lg font-black uppercase text-gray-900 hover:underline block">
                  {article.author.name}
                </a>
                {article.author.role && (
                  <p className="font-[family-name:var(--font-scale)] text-[10px] font-semibold uppercase tracking-widest text-red-600 mb-1">
                    {article.author.role}
                  </p>
                )}
                {article.author.bio && (
                  <p className="font-[family-name:var(--font-owners-text)] text-xs text-gray-600 leading-relaxed mb-2">
                    {article.author.bio}
                  </p>
                )}
              </div>
            </div>
          </article>

          {/* RIGHT: Sidebar */}
          <aside className="lg:col-span-4">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-900">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" />
                <h2 className="font-[family-name:var(--font-scale)] text-xs font-bold uppercase tracking-widest text-gray-900">
                  Most Popular
                </h2>
              </div>
              <ul className="divide-y divide-gray-200">
                {mostPopular.map((item) => (
                  <li key={item.id} className="py-3">
                    <a href={item.href || "#"} className="group block">
                      <span className="font-[family-name:var(--font-scale)] text-[9px] font-bold uppercase tracking-widest text-red-600 block mb-1">
                        {item.category}
                      </span>
                      <h3 className="font-[family-name:var(--font-owners-xnarrow)] text-base font-black uppercase leading-tight text-gray-900 group-hover:underline mb-1">
                        {item.title}
                      </h3>
                    </a>
                    <p className="font-[family-name:var(--font-owners-text)] text-xs text-gray-500">
                      <AuthorByline author={item.author} authorHref={item.authorHref} nameClassName="font-semibold text-gray-700" />
                    </p>
                  </li>
                ))}
              </ul>
              <div className="flex justify-center mt-4">
                <button className="font-[family-name:var(--font-scale)] text-xs font-semibold uppercase tracking-widest px-8 py-2.5 rounded-full border border-gray-400 text-gray-800 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-200 w-full">
                  Read More
                </button>
              </div>
            </div>
            <div className="sticky top-4">
              <AdPlaceholder />
            </div>
          </aside>
        </div>
      </div>

      {/* Around the Web */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 border-t border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-[family-name:var(--font-owners-xnarrow)] text-2xl font-black uppercase text-gray-900">
            Around the Web
          </h2>
          <span className="font-[family-name:var(--font-scale)] text-[10px] text-gray-400 uppercase tracking-widest">
            Powered by Revcontent
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8">
          {aroundTheWeb.map((item) => (
            <a key={item.id} href={item.href || "#"} className="group flex flex-col gap-2">
              <div className="w-full aspect-[4/3] overflow-hidden bg-gray-100">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
              </div>
              <h3 className="font-[family-name:var(--font-owners-xnarrow)] text-sm font-black uppercase leading-tight text-gray-900 group-hover:underline">
                {item.title}
              </h3>
            </a>
          ))}
        </div>
      </div>

      {/* More in Category */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-10">
        <div className="mb-6">
          {article.categoryHref ? (
            <a href={article.categoryHref} className="inline-block bg-gray-900 text-white font-[family-name:var(--font-owners-xnarrow)] text-sm font-black uppercase tracking-wide px-5 py-2 hover:bg-gray-700 transition-colors">
              More in {(article.category || "").charAt(0) + (article.category || "").slice(1).toLowerCase()}
            </a>
          ) : (
            <span className="inline-block bg-gray-900 text-white font-[family-name:var(--font-owners-xnarrow)] text-sm font-black uppercase tracking-wide px-5 py-2">
              More in {(article.category || "").charAt(0) + (article.category || "").slice(1).toLowerCase()}
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 mb-8">
          {moreInCategory.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      </div>
    </main>
  );
}
