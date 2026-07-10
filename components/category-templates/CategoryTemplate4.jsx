// components/category-templates/CategoryTemplate4.jsx
// Variation 4 (Default): Centered title + full-width "Latest" grid + pagination + newsletter
"use client";

function ArticleCard({ article }) {
  return (
    <a href={article.href || "#"} className="group flex flex-col gap-2">
      <div className="w-full aspect-[4/3] overflow-hidden bg-gray-200">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
        />
      </div>
      <span className="font-[family-name:var(--font-scale)] text-[10px] font-semibold uppercase tracking-widest text-red-600 mt-1">
        {article.category}
      </span>
      <h3 className="font-[family-name:var(--font-owners-xnarrow)] text-base font-black uppercase leading-tight text-gray-900 group-hover:underline">
        {article.title}
      </h3>
      <p className="font-[family-name:var(--font-owners-text)] text-xs text-gray-500">
        By <span className="font-semibold text-gray-700 underline">{article.author}</span>
      </p>
    </a>
  );
}

function Pagination({ current, total }) {
  return (
    <div className="flex items-center justify-center gap-1 py-10">
      <button className="w-9 h-9 flex items-center justify-center rounded-sm bg-red-600 text-white font-[family-name:var(--font-scale)] text-sm font-bold">
        {current}
      </button>
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

export default function CategoryTemplate4({ data }) {
  const { hero, tabs, articles, newsletter, pagination } = data;

  return (
    <main className="min-h-screen bg-white">
      {/* Category Hero */}
      <div className="max-w-2xl mx-auto px-6 py-10 text-center">
        <h1 className="font-[family-name:var(--font-owners-xnarrow)] text-5xl md:text-6xl font-black uppercase leading-none text-gray-900 mb-5">
          {hero.title}
        </h1>
        <p className="font-[family-name:var(--font-owners-text)] text-sm text-gray-600 leading-relaxed">
          {hero.description}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <hr className="border-gray-200" />
      </div>

      {/* Subcategory Tabs */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {tabs.subcategories.map((sub) => (
          <a key={sub} href="#" className="font-[family-name:var(--font-scale)] text-xs font-semibold uppercase tracking-widest text-gray-700 hover:text-red-600 transition-colors">
            {sub}
          </a>
        ))}
        <a href="#" className="font-[family-name:var(--font-scale)] text-xs font-semibold uppercase tracking-widest text-gray-400 hover:text-red-600 transition-colors">
          See {tabs.extraCount} More Categories +
        </a>
      </div>

      {/* Latest Section Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-6">
        <div className="border-b border-gray-300 pb-3">
          <h2 className="font-[family-name:var(--font-owners-xnarrow)] text-sm font-black uppercase tracking-widest text-red-600">
            Latest in {hero.title}
          </h2>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <Pagination current={pagination.currentPage} total={pagination.totalPages} />
      </div>

      {/* Newsletter Banner */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <div className="border border-gray-200 bg-[#faf9f7] flex flex-col md:flex-row items-center justify-between gap-6 px-10 py-8">
          <div className="hidden md:block flex-1" />
          <div className="flex-1 flex flex-col gap-3 w-full">
            <div>
              <h3 className="font-[family-name:var(--font-bitter)] italic text-2xl text-gray-900">
                {newsletter.title}
              </h3>
              <p className="font-[family-name:var(--font-owners-text)] text-sm text-gray-500 mt-1">
                {newsletter.description}
              </p>
            </div>
            <button className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-[family-name:var(--font-scale)] font-bold uppercase tracking-widest text-sm rounded-full transition-colors duration-200">
              {newsletter.buttonLabel}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
