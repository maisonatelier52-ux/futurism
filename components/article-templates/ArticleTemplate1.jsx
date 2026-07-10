// components/article-templates/ArticleTemplate1.jsx
// Variation 1: Dark split hero banner (text left, image right), left "The
// Saga So Far" numbered timeline + share icons, center article body, right
// Most Popular + sticky red newsletter box, full-width Around the Web strip.
"use client";

import ArticleBody from "./ArticleBody";
import { DEFAULT_SAGA_SO_FAR } from "@/lib/articleTemplateDefaults";

function ShareIcons() {
  const icons = ["f", "𝕏", "in", "✉", "🔗"];
  return (
    <div className="flex items-center gap-2">
      {icons.map((ic, i) => (
        <a key={i} href="#" className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-[11px] hover:bg-red-600 transition-colors">
          {ic}
        </a>
      ))}
    </div>
  );
}

export default function ArticleTemplate1({ article, related }) {
  const { mostPopular, aroundTheWeb } = related;
  const saga = article.sagaSoFar?.length ? article.sagaSoFar : DEFAULT_SAGA_SO_FAR;
  const activeSagaIndex = saga.length - 1; // last item highlighted, matching the reference image

  return (
    <main className="min-h-screen bg-white">
      {/* Dark split hero */}
      <div className="w-full bg-black">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch">
          <div className="py-10 md:py-16 md:pr-10 flex flex-col justify-center">
            {article.tag && (
              <p className="font-[family-name:var(--font-scale)] text-[11px] font-bold uppercase tracking-widest text-red-500 mb-3">
                {article.tag}
              </p>
            )}
            <h1 className="font-[family-name:var(--font-owners-xnarrow)] text-3xl md:text-4xl font-black uppercase leading-[0.95] text-white mb-4">
              {article.title}
            </h1>
            {article.excerpt && (
              <p className="font-[family-name:var(--font-bitter)] italic text-lg text-gray-300 mb-4">{article.excerpt}</p>
            )}
            <div className="flex items-center gap-2 text-xs font-[family-name:var(--font-owners-text)] text-gray-400">
              <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-700 shrink-0">
                <img src={article.author.avatar} alt={article.author.name} className="w-full h-full object-cover" />
              </div>
              <span>By <a href={article.author.href || "#"} className="font-semibold text-red-500 hover:underline">{article.author.name}</a></span>
              <span className="text-gray-600">·</span>
              <span>{article.publishedAt}</span>
            </div>
          </div>
          <div className="w-full h-56 md:h-auto overflow-hidden">
            <img src={article.heroImage} alt={article.title} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT: Saga So Far + share */}
          <aside className="lg:col-span-3 order-2 lg:order-1">
            <div className="lg:sticky lg:top-4">
              <h3 className="font-[family-name:var(--font-scale)] text-[11px] font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-2 mb-3">
                The Saga So Far
              </h3>
              <ol className="flex flex-col">
                {saga.map((item, i) => (
                  <li key={item.id ?? i} className={`flex gap-3 py-2.5 border-l-2 pl-4 -ml-px ${i === activeSagaIndex ? "border-red-600" : "border-gray-200"}`}>
                    <span className={`font-[family-name:var(--font-scale)] text-[11px] font-black shrink-0 ${i === activeSagaIndex ? "text-red-600" : "text-gray-400"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={`font-[family-name:var(--font-owners-text)] text-[13px] leading-snug ${i === activeSagaIndex ? "text-gray-900 font-semibold" : "text-gray-500"}`}>
                      {item.text}
                    </span>
                  </li>
                ))}
              </ol>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="font-[family-name:var(--font-scale)] text-[11px] font-bold uppercase tracking-widest text-gray-900 mb-3">
                  Share This Story
                </p>
                <ShareIcons />
              </div>
            </div>
          </aside>

          {/* CENTER: Article body */}
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

          {/* RIGHT: Most Popular + sticky newsletter */}
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
                        <span className="font-[family-name:var(--font-scale)] text-[9px] font-bold uppercase tracking-widest text-red-600 block mb-1">
                          {item.category}
                        </span>
                        <h3 className="font-[family-name:var(--font-owners-xnarrow)] text-sm font-black uppercase leading-tight text-gray-900 group-hover:underline mb-1">
                          {item.title}
                        </h3>
                        <p className="font-[family-name:var(--font-owners-text)] text-[11px] text-gray-500">By {item.author}</p>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-red-600 text-white p-5">
                <p className="font-[family-name:var(--font-owners-xnarrow)] text-sm font-black uppercase tracking-wide mb-1">Futurism</p>
                <h3 className="font-[family-name:var(--font-owners-xnarrow)] text-3xl font-black uppercase leading-[0.9] mb-3">The Future Is</h3>
                <p className="font-[family-name:var(--font-owners-text)] text-xs mb-4">Sign up for our daily newsletter</p>
                <button className="w-full flex items-center justify-between bg-white text-red-600 font-[family-name:var(--font-scale)] font-bold uppercase tracking-widest text-xs px-4 py-3 rounded">
                  Sign Up For Our Daily Newsletter
                  <span>→</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Around the Web */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-10 border-t border-gray-200 pt-8">
        <h2 className="font-[family-name:var(--font-owners-xnarrow)] text-xl font-black uppercase text-gray-900 mb-6">Around the Web</h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-x-6 gap-y-8">
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
    </main>
  );
}
