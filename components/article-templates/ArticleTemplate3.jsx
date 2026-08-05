// components/article-templates/ArticleTemplate3.jsx
// Variation 3: Full-bleed dark hero with title/byline overlaid directly on
// the image, left auto-generated Table of Contents (from subheading
// blocks) + newsletter signup, right Most Popular + newsletter promo,
// Around the Web + More in Category grids with a Load More button.
"use client";

import { useState } from "react";
import ArticleBody, { extractHeadings } from "./ArticleBody";
import { AuthorByline } from "../shared/ArticleLinks";
import { useNewsletterSubscribe } from "@/lib/useNewsletterSubscribe";
import NewsletterStatus from "@/components/shared/NewsletterStatus";

export default function ArticleTemplate3({ article, related }) {
  const { mostPopular, aroundTheWeb, moreInCategory, relatedByTag } = related;
  const headings = extractHeadings(article.body);
  const [showMore, setShowMore] = useState(false);
  const sidebarForm = useNewsletterSubscribe("article-page-sidebar");
  const promoForm = useNewsletterSubscribe("article-page-promo");
  const combinedGrid = [...aroundTheWeb, ...moreInCategory];
  const visibleGrid = showMore ? combinedGrid : combinedGrid.slice(0, 5);

  return (
    <main className="min-h-screen bg-white dark:bg-[#15151c]">
      {/* Full-bleed dark hero with overlaid text -- always dark by design in both site themes */}
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
            <h1 className="font-[family-name:var(--font-owners-xnarrow)] text-3xl md:text-5xl font-black uppercase leading-[0.95] text-white max-w-3xl mb-3 break-words">
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
                          <span className="font-[family-name:var(--font-scale)] text-[10px] font-black text-gray-400 dark:text-gray-500 shrink-0 mt-0.5">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="font-[family-name:var(--font-owners-text)] text-[12.5px] text-gray-700 dark:text-gray-300 leading-snug group-hover:text-red-600 group-hover:underline">
                            {h.text}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              <div className="bg-gray-50 dark:bg-[#0a0a0f] border border-gray-200 dark:border-gray-800 p-5">
                <p className="font-[family-name:var(--font-scale)] text-[11px] font-bold uppercase tracking-widest text-gray-900 dark:text-gray-100 mb-2">
                  Sign up for our daily newsletter
                </p>
                <p className="font-[family-name:var(--font-owners-text)] text-[11px] text-gray-500 dark:text-gray-400 mb-3">
                  Get our best stories delivered straight to your inbox.
                </p>
                <form onSubmit={sidebarForm.submit}>
                  <input type="email" placeholder="Enter your email" value={sidebarForm.email} onChange={(e) => sidebarForm.setEmail(e.target.value)}
                    className="w-full h-9 px-3 border border-gray-300 dark:border-gray-700 text-xs mb-2 focus:outline-none bg-white dark:bg-[#15151c]" />
                  <button type="submit" disabled={sidebarForm.status === "loading"}
                    className="w-full h-9 bg-red-600 hover:bg-red-700 text-white font-[family-name:var(--font-scale)] font-bold uppercase tracking-widest text-xs rounded disabled:opacity-60">
                    {sidebarForm.status === "loading" ? "Signing up…" : "Sign Up"}
                  </button>
                </form>
                <NewsletterStatus status={sidebarForm.status} message={sidebarForm.message} />
              </div>
            </div>
          </aside>

          {/* CENTER: body */}
          <article className="lg:col-span-6 order-1 lg:order-2">
            <ArticleBody blocks={article.body} quoteColor="text-red-600" />

            <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800 flex items-start gap-4">
              <a href={article.author.href || "#"} className="flex-shrink-0">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200 dark:bg-[#242430]">
                  <img src={article.author.avatar} alt={article.author.name} className="w-full h-full object-cover" />
                </div>
              </a>
              <div>
                <a href={article.author.href || "#"} className="font-[family-name:var(--font-owners-xnarrow)] text-lg font-black uppercase text-gray-900 dark:text-gray-100 hover:underline block break-words">
                  {article.author.name}
                </a>
                {article.author.role && (
                  <p className="font-[family-name:var(--font-scale)] text-[10px] font-semibold uppercase tracking-widest text-red-600 mb-1">
                    {article.author.role}
                  </p>
                )}
                {article.author.bio && (
                  <p className="font-[family-name:var(--font-owners-text)] text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
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
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-900 dark:border-gray-100">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" />
                  <h2 className="font-[family-name:var(--font-scale)] text-xs font-bold uppercase tracking-widest text-gray-900 dark:text-gray-100">
                    Most Popular
                  </h2>
                </div>
                <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                  {mostPopular.map((item) => (
                    <li key={item.id} className="py-3">
                      <a href={item.href || "#"} className="group block">
                        <span className="font-[family-name:var(--font-scale)] text-[9px] font-bold uppercase tracking-widest text-red-600 block mb-1">{item.category}</span>
                        <h3 className="font-[family-name:var(--font-owners-xnarrow)] text-sm font-black uppercase leading-tight text-gray-900 dark:text-gray-100 group-hover:underline mb-1 break-words">{item.title}</h3>
                      </a>
                      <p className="font-[family-name:var(--font-owners-text)] text-[11px] text-gray-500 dark:text-gray-400">
                        <AuthorByline author={item.author} authorHref={item.authorHref} />
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-red-600 text-white p-5">
                <p className="font-[family-name:var(--font-owners-xnarrow)] text-sm font-black uppercase tracking-wide mb-1 break-words">Futurism</p>
                <h3 className="font-[family-name:var(--font-owners-xnarrow)] text-2xl font-black uppercase leading-[0.9] mb-3 break-words">The Future Is</h3>
                <p className="font-[family-name:var(--font-owners-text)] text-xs mb-4">Sign up for our daily newsletter</p>
                <form onSubmit={promoForm.submit} className="space-y-2">
                  <input type="email" placeholder="Enter your email" value={promoForm.email} onChange={(e) => promoForm.setEmail(e.target.value)}
                    className="w-full h-10 px-3 bg-white text-black text-sm border border-white focus:outline-none rounded" />
                  <button type="submit" disabled={promoForm.status === "loading"}
                    className="w-full bg-white text-red-600 font-[family-name:var(--font-scale)] font-bold uppercase tracking-widest text-xs px-4 py-3 rounded disabled:opacity-60">
                    {promoForm.status === "loading" ? "Signing up…" : "Sign Up"}
                  </button>
                </form>
                <NewsletterStatus status={promoForm.status} message={promoForm.message} light />
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Around the Web + More in Category combined grid, with Load More */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-[family-name:var(--font-owners-xnarrow)] text-xl font-black uppercase text-gray-900 dark:text-gray-100 break-words">Around the Web</h2>
          <span className="font-[family-name:var(--font-scale)] text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest">Powered by Revcontent</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-8 mb-8">
          {visibleGrid.map((item, i) => (
            <a key={`${item.id}-${i}`} href={item.href || "#"} className="group flex flex-col gap-2">
              <div className="w-full aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-[#1c1c24]">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
              </div>
              {item.category && (
                <span className="font-[family-name:var(--font-scale)] text-[9px] font-semibold uppercase tracking-widest text-red-600">{item.category}</span>
              )}
              <h3 className="font-[family-name:var(--font-owners-text)] text-xs leading-snug text-gray-900 dark:text-gray-100 group-hover:underline">{item.title}</h3>
            </a>
          ))}
        </div>
        {!showMore && combinedGrid.length > visibleGrid.length && (
          <div className="flex justify-center">
            <button onClick={() => setShowMore(true)}
              className="font-[family-name:var(--font-scale)] text-xs font-semibold uppercase tracking-widest px-16 py-3 rounded-full border border-gray-400 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-900 dark:hover:bg-gray-100 hover:text-white dark:hover:text-gray-900 hover:border-gray-900 dark:hover:border-gray-100 transition-all duration-200">
              Load More
            </button>
          </div>
        )}
      </div>

      {/* Related by Topic -- only shown when the article has tags AND at
          least one other published article shares one. Kept separate from
          the combined Around the Web / More in Category grid above so
          "here's why we're showing you this" stays clear. */}
      {relatedByTag?.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 md:px-12 pb-10 border-t border-gray-200 dark:border-gray-800 pt-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-1 h-5 bg-red-600 shrink-0" />
            <h2 className="font-[family-name:var(--font-owners-xnarrow)] text-xl font-black uppercase text-gray-900 dark:text-gray-100 break-words">
              Related by Topic
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-8">
            {relatedByTag.map((item) => (
              <a key={item.id} href={item.href || "#"} className="group flex flex-col gap-2">
                <div className="w-full aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-[#1c1c24]">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                </div>
                {item.category && (
                  <span className="font-[family-name:var(--font-scale)] text-[9px] font-semibold uppercase tracking-widest text-red-600">{item.category}</span>
                )}
                <h3 className="font-[family-name:var(--font-owners-text)] text-xs leading-snug text-gray-900 dark:text-gray-100 group-hover:underline">{item.title}</h3>
              </a>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
