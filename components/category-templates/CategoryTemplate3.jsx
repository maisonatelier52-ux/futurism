// components/category-templates/CategoryTemplate3.jsx
// Variation 3: Stacked hero + right "Latest" rail + paginated articles grid + dark signup block
// Author names are real links (to /authors/[slug]) whenever the data
// provides an authorHref. Subcategory tabs are plain labels (no per-tab
// page exists yet), so they render as text rather than dead links.
"use client";

import { AuthorByline } from "../shared/ArticleLinks";

function RailItem({ article }) {
  return (
    <div className="group flex gap-3 py-3 border-b border-gray-200 last:border-b-0">
      <a href={article.href || "#"} className="flex gap-3 flex-1">
        <div className="w-16 h-16 shrink-0 overflow-hidden bg-gray-200">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0">
          <span className="font-[family-name:var(--font-scale)] text-[10px] font-bold uppercase tracking-widest text-red-600">
            {article.category}
          </span>
          <h4 className="font-[family-name:var(--font-owners-xnarrow)] text-[12px] font-bold leading-snug text-gray-900 group-hover:underline uppercase break-words">
            {article.title}
          </h4>
        </div>
      </a>
      <p className="font-[family-name:var(--font-owners-text)] text-[11px] text-gray-500 mt-0.5 pl-[76px] -mt-2">
        <AuthorByline author={article.author} authorHref={article.authorHref} />
      </p>
    </div>
  );
}

function GridCard({ article }) {
  return (
    <div className="group flex flex-col gap-2">
      <a href={article.href || "#"} className="flex flex-col gap-2">
        <div className="w-full aspect-[4/3] overflow-hidden bg-gray-200">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
        </div>
        <span className="font-[family-name:var(--font-scale)] text-[10px] font-semibold uppercase tracking-widest text-red-600">
          {article.category}
        </span>
        <h3 className="font-[family-name:var(--font-owners-xnarrow)] text-sm font-black uppercase leading-tight text-gray-900 group-hover:underline break-words">
          {article.title}
        </h3>
      </a>
      <p className="font-[family-name:var(--font-owners-text)] text-xs text-gray-500">
        <AuthorByline author={article.author} authorHref={article.authorHref} nameClassName="font-semibold text-gray-700" />
      </p>
    </div>
  );
}

function Pagination({ current, total }) {
  return (
    <div className="flex items-center gap-1 py-8">
      <button className="w-9 h-9 flex items-center justify-center rounded-sm bg-red-600 text-white font-[family-name:var(--font-scale)] text-sm font-bold">{current}</button>
      <button className="w-9 h-9 flex items-center justify-center rounded-sm text-gray-700 hover:bg-gray-100 font-[family-name:var(--font-scale)] text-sm">2</button>
      <button className="w-9 h-9 flex items-center justify-center rounded-sm text-gray-700 hover:bg-gray-100 font-[family-name:var(--font-scale)] text-sm">3</button>
      <span className="w-9 h-9 flex items-center justify-center text-gray-400 font-[family-name:var(--font-scale)] text-sm">...</span>
      <button className="w-9 h-9 flex items-center justify-center rounded-sm text-gray-700 hover:bg-gray-100 font-[family-name:var(--font-scale)] text-sm">{total}</button>
      <button className="w-9 h-9 flex items-center justify-center text-red-600 hover:bg-red-50 rounded-sm">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

export default function CategoryTemplate3({ data }) {
  const { hero, tabs, featured, latest, articles, newsletter, pagination } = data;

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-6">
        <h1 className="font-[family-name:var(--font-owners-xnarrow)] text-4xl md:text-5xl font-black uppercase leading-none text-gray-900 break-words">
          {hero.title}
        </h1>
        <div className="h-0.5 w-12 bg-red-600 mt-4" />
        <p className="font-[family-name:var(--font-owners-text)] text-sm text-gray-600 leading-relaxed max-w-2xl mt-5">
          {hero.description}
        </p>
      </div>

      {/* Subcategory tabs (plain labels -- no per-tab page yet) */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-6 pb-4 border-b border-gray-200 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
        {tabs.subcategories.map((sub) => (
          <span key={sub} className="font-[family-name:var(--font-scale)] text-xs font-semibold uppercase tracking-widest text-gray-700">
            {sub}
          </span>
        ))}
        {tabs.extraCount > 0 && (
          <span className="font-[family-name:var(--font-scale)] text-xs font-semibold uppercase tracking-widest text-gray-400">
            +{tabs.extraCount} more
          </span>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <p className="font-[family-name:var(--font-scale)] text-[11px] font-bold uppercase tracking-widest text-red-600 mb-4">
          Latest in {hero.title}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-10">
          {/* Stacked hero */}
          <div className="lg:col-span-8">
            <div className="group flex flex-col">
              <a href={featured.href || "#"} className="block">
                <div className="w-full aspect-[16/9] overflow-hidden bg-gray-200 relative">
                  <span className="absolute top-3 left-3 z-10 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1">
                    {featured.category}
                  </span>
                  <img src={featured.image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" />
                </div>
                <span className="block font-[family-name:var(--font-scale)] text-[10px] font-bold uppercase tracking-widest text-red-600 mt-3">
                  {featured.category}
                </span>
                <h2 className="font-[family-name:var(--font-owners-xnarrow)] text-2xl font-black uppercase leading-tight text-gray-900 group-hover:underline mt-1 break-words">
                  {featured.title}
                </h2>
              </a>
              <p className="font-[family-name:var(--font-owners-text)] text-xs text-gray-500 mt-2">
                <AuthorByline author={featured.author} authorHref={featured.authorHref} />
              </p>
            </div>
          </div>

          {/* Right rail */}
          <div className="lg:col-span-4">
            {latest.map((a) => <RailItem key={a.id} article={a} />)}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8">
          {articles.map((a) => <GridCard key={a.id} article={a} />)}
        </div>

        <Pagination current={pagination.currentPage} total={pagination.totalPages} />
      </div>

      {/* Dark newsletter block */}
      <div className="bg-[#faf9f7] border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-[family-name:var(--font-bitter)] italic text-2xl text-gray-900">{newsletter.title}</h3>
            <p className="font-[family-name:var(--font-owners-text)] text-sm text-gray-500 mt-1">{newsletter.description}</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <input type="email" placeholder="Enter your email" className="flex-1 md:w-64 border border-gray-300 rounded-full px-5 py-3 text-sm" />
            <button className="bg-red-600 hover:bg-red-700 text-white font-[family-name:var(--font-scale)] font-bold uppercase tracking-widest text-xs px-6 py-3 rounded-full">
              {newsletter.buttonLabel}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
