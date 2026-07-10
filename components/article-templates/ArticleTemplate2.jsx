// components/article-templates/ArticleTemplate2.jsx
// Variation 2: Home > Category breadcrumb, light hero, left share icons +
// Read Next mini-list, center article body, right Most Popular + newsletter
// box, Around the Web + More in Category grids below.
"use client";

import ArticleBody from "./ArticleBody";

function ShareIconsVertical() {
  const icons = ["f", "𝕏", "in", "reddit", "✉"];
  return (
    <div className="flex flex-col items-center gap-3">
      {icons.map((ic, i) => (
        <a key={i} href="#" className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-[10px] text-gray-600 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors">
          {ic}
        </a>
      ))}
    </div>
  );
}

export default function ArticleTemplate2({ article, related }) {
  const { mostPopular, aroundTheWeb, moreInCategory } = related;
  const readNext = (related.moreInCategory || []).slice(0, 2);

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        {/* Breadcrumb */}
        <p className="font-[family-name:var(--font-scale)] text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
          <a href="/" className="hover:text-gray-700">Home</a>
          <span className="mx-1.5">›</span>
          <span className="text-red-600">{article.category}</span>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <h1 className="font-[family-name:var(--font-owners-xnarrow)] text-4xl md:text-5xl font-black uppercase leading-[0.95] text-gray-900 mb-4">
              {article.title}
            </h1>
            {article.excerpt && (
              <p className="font-[family-name:var(--font-bitter)] italic text-lg text-gray-600 mb-4">{article.excerpt}</p>
            )}
            <div className="flex items-center gap-2 text-xs font-[family-name:var(--font-owners-text)] text-gray-500">
              <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-200 shrink-0">
                <img src={article.author.avatar} alt={article.author.name} className="w-full h-full object-cover" />
              </div>
              <span>By <a href={article.author.href || "#"} className="font-semibold text-red-600 hover:underline">{article.author.name}</a></span>
              <span>·</span>
              <span>{article.publishedAt}</span>
            </div>
          </div>
          <div className="w-full aspect-[16/10] overflow-hidden bg-gray-100">
            <img src={article.heroImage} alt={article.title} className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT: share + read next */}
          <aside className="lg:col-span-2 order-2 lg:order-1">
            <div className="lg:sticky lg:top-4 flex flex-col gap-8 items-center lg:items-stretch">
              <div>
                <p className="font-[family-name:var(--font-scale)] text-[10px] font-bold uppercase tracking-widest text-gray-900 mb-3 text-center lg:text-left">
                  Share
                </p>
                <ShareIconsVertical />
              </div>
              {readNext.length > 0 && (
                <div>
                  <p className="font-[family-name:var(--font-scale)] text-[10px] font-bold uppercase tracking-widest text-gray-900 mb-3">
                    Read Next
                  </p>
                  <div className="flex flex-col gap-4">
                    {readNext.map((item) => (
                      <a key={item.id} href={item.href || "#"} className="group flex flex-col gap-1.5">
                        <div className="w-16 h-16 overflow-hidden bg-gray-100 mx-auto lg:mx-0">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <h4 className="font-[family-name:var(--font-owners-text)] text-[11px] leading-snug text-gray-900 group-hover:underline text-center lg:text-left">
                          {item.title}
                        </h4>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* CENTER: body */}
          <article className="lg:col-span-7 order-1 lg:order-2">
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

          {/* RIGHT: most popular + newsletter */}
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
                        <p className="font-[family-name:var(--font-owners-text)] text-[11px] text-gray-500">By {item.author}</p>
                      </a>
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

      {/* Around the Web */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 border-t border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-[family-name:var(--font-owners-xnarrow)] text-xl font-black uppercase text-gray-900">Around the Web</h2>
          <a href="#" className="font-[family-name:var(--font-scale)] text-[11px] font-semibold text-gray-400 hover:text-red-600">View All →</a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-8">
          {aroundTheWeb.map((item) => (
            <a key={item.id} href={item.href || "#"} className="group flex flex-col gap-2">
              <div className="w-full aspect-[4/3] overflow-hidden bg-gray-100">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
              </div>
              <h3 className="font-[family-name:var(--font-owners-text)] text-xs leading-snug text-gray-900 group-hover:underline">{item.title}</h3>
            </a>
          ))}
        </div>
      </div>

      {/* More in Category */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-[family-name:var(--font-owners-xnarrow)] text-xl font-black uppercase text-gray-900">
            More in {(article.category || "").charAt(0) + (article.category || "").slice(1).toLowerCase()}
          </h2>
          <a href="#" className="font-[family-name:var(--font-scale)] text-[11px] font-semibold text-gray-400 hover:text-red-600">View All →</a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-8">
          {moreInCategory.map((item) => (
            <a key={item.id} href={item.href || "#"} className="group flex flex-col gap-2">
              <div className="w-full aspect-[4/3] overflow-hidden bg-gray-100">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
              </div>
              <span className="font-[family-name:var(--font-scale)] text-[9px] font-semibold uppercase tracking-widest text-red-600">{item.category}</span>
              <h3 className="font-[family-name:var(--font-owners-xnarrow)] text-sm font-black uppercase leading-tight text-gray-900 group-hover:underline">{item.title}</h3>
              <p className="font-[family-name:var(--font-owners-text)] text-[11px] text-gray-500">By {item.author}</p>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
