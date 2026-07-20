// components/article-templates/ArticleTemplate3.jsx
// Variation 3: Full-bleed dark hero with title/byline overlaid directly on
// the image, left auto-generated Table of Contents (from subheading
// blocks) + newsletter signup, right Most Popular + newsletter promo,
// Around the Web + More in Category grids with a Load More button.
"use client";

import { useState } from "react";
import ArticleBody, { extractHeadings } from "./ArticleBody";
import { AuthorByline } from "../shared/ArticleLinks";

export default function ArticleTemplate3({ article, related }) {
  const { mostPopular, aroundTheWeb, moreInCategory } = related;
  const headings = extractHeadings(article.body);
  const [showMore, setShowMore] = useState(false);
  const combinedGrid = [...aroundTheWeb, ...moreInCategory];
  const visibleGrid = showMore ? combinedGrid : combinedGrid.slice(0, 5);

  return (
    <main className="min-h-screen bg-white">
      {/* Full-bleed dark hero with overlaid text */}
      <div className="relative w-full h-[420px] md:h-[520px] overflow-hidden bg-gray-900">
        <img src={article.heroImage} alt={article.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-6 md:px-12 pb-10 w-full">
            {article.tag && (
              <p className="font-[family-name:var(--font-scale)] text-[11px] font-bold uppercase tracking-widest text-red-500 mb-3">
                {article.tag}
              </p>
            )}
            <h1 className="font-[family-name:var(--font-owners-xnarrow)] text-3xl md:text-5xl font-black uppercase leading-[0.95] text-white max-w-3xl mb-3">
              {article.title}
            </h1>
            {article.excerpt && (
              <p className="font-[family-name:var(--font-bitter)] italic text-lg text-gray-200 max-w-2xl mb-4">{article.excerpt}</p>
            )}
            <div className="flex items-center gap-2 text-xs font-[family-name:var(--font-owners-text)] text-gray-300">
              <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-700 shrink-0">
                <img src={article.author.avatar} alt={article.author.name} className="w-full h-full object-cover" />
              </div>
              <span>By <a href={article.author.href || "#"} className="font-semibold text-white hover:underline">{article.author.name}</a></span>
              <span className="text-gray-500">·</span>
              <span>{article.publishedAt}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT: Table of Contents + newsletter */}
          <aside className="lg:col-span-3 order-2 lg:order-1">
            <div className="lg:sticky lg:top-4 flex flex-col gap-6">
              {headings.length > 0 && (
                <div>
                  <p className="font-[family-name:var(--font-scale)] text-[11px] font-bold uppercase tracking-widest text-red-600 mb-3">
                    Table of Contents
                  </p>
                  <ol className="flex flex-col gap-2.5">
                    {headings.map((h, i) => (
                      <li key={h.id}>
                        <a href={`#${h.id}`} className="group flex gap-2.5 items-start">
                          <span className="font-[family-name:var(--font-scale)] text-[10px] font-black text-gray-400 shrink-0 mt-0.5">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="font-[family-name:var(--font-owners-text)] text-[12.5px] text-gray-700 leading-snug group-hover:text-red-600 group-hover:underline">
                            {h.text}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              <div className="bg-gray-50 border border-gray-200 p-5">
                <p className="font-[family-name:var(--font-scale)] text-[11px] font-bold uppercase tracking-widest text-gray-900 mb-2">
                  Sign up for our daily newsletter
                </p>
                <p className="font-[family-name:var(--font-owners-text)] text-[11px] text-gray-500 mb-3">
                  Get our best stories delivered straight to your inbox.
                </p>
                <input type="email" placeholder="Enter your email"
                  className="w-full h-9 px-3 border border-gray-300 text-xs mb-2 focus:outline-none bg-white" />
                <button className="w-full h-9 bg-red-600 hover:bg-red-700 text-white font-[family-name:var(--font-scale)] font-bold uppercase tracking-widest text-xs rounded">
                  Sign Up
                </button>
              </div>
            </div>
          </aside>

          {/* CENTER: body */}
          <article className="lg:col-span-6 order-1 lg:order-2">
            <ArticleBody blocks={article.body} quoteColor="text-red-600" />

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
                  <p className="font-[family-name:var(--font-owners-text)] text-xs text-gray-600 leading-relaxed">
                    {article.author.bio}
                  </p>
                )}
              </div>
            </div>
          </article>

          {/* RIGHT: Most Popular + newsletter promo */}
          <aside className="lg:col-span-3 order-3">
            <div className="lg:sticky lg:top-4 flex flex-col gap-6">
              <div>
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
                        <span className="font-[family-name:var(--font-scale)] text-[9px] font-bold uppercase tracking-widest text-red-600 block mb-1">{item.category}</span>
                        <h3 className="font-[family-name:var(--font-owners-xnarrow)] text-sm font-black uppercase leading-tight text-gray-900 group-hover:underline mb-1">{item.title}</h3>
                      </a>
                      <p className="font-[family-name:var(--font-owners-text)] text-[11px] text-gray-500">
                        <AuthorByline author={item.author} authorHref={item.authorHref} />
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-red-600 text-white p-5">
                <p className="font-[family-name:var(--font-owners-xnarrow)] text-sm font-black uppercase tracking-wide mb-1">Futurism</p>
                <h3 className="font-[family-name:var(--font-owners-xnarrow)] text-2xl font-black uppercase leading-[0.9] mb-3">The Future Is</h3>
                <p className="font-[family-name:var(--font-owners-text)] text-xs mb-4">Sign up for our daily newsletter</p>
                <button className="w-full bg-white text-red-600 font-[family-name:var(--font-scale)] font-bold uppercase tracking-widest text-xs px-4 py-3 rounded">
                  Sign Up
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Around the Web + More in Category combined grid, with Load More */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 border-t border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-[family-name:var(--font-owners-xnarrow)] text-xl font-black uppercase text-gray-900">Around the Web</h2>
          <span className="font-[family-name:var(--font-scale)] text-[10px] text-gray-400 uppercase tracking-widest">Powered by Revcontent</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-8 mb-8">
          {visibleGrid.map((item, i) => (
            <a key={`${item.id}-${i}`} href={item.href || "#"} className="group flex flex-col gap-2">
              <div className="w-full aspect-[4/3] overflow-hidden bg-gray-100">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
              </div>
              {item.category && (
                <span className="font-[family-name:var(--font-scale)] text-[9px] font-semibold uppercase tracking-widest text-red-600">{item.category}</span>
              )}
              <h3 className="font-[family-name:var(--font-owners-text)] text-xs leading-snug text-gray-900 group-hover:underline">{item.title}</h3>
            </a>
          ))}
        </div>
        {!showMore && combinedGrid.length > visibleGrid.length && (
          <div className="flex justify-center">
            <button onClick={() => setShowMore(true)}
              className="font-[family-name:var(--font-scale)] text-xs font-semibold uppercase tracking-widest px-16 py-3 rounded-full border border-gray-400 text-gray-800 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-200">
              Load More
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
