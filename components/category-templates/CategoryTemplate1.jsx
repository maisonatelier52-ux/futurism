// components/category-templates/CategoryTemplate1.jsx
// Variation 1: Purple hero banner + right "Latest" rail + trending strip + deep dive + newsletter
"use client";

function RailItem({ article }) {
  return (
    <a href={article.href || "#"} className="group flex gap-3 py-3 border-b border-gray-200 last:border-b-0">
      <div className="w-16 h-16 shrink-0 overflow-hidden bg-gray-200 rounded">
        <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
      </div>
      <div className="min-w-0">
        <span className="font-[family-name:var(--font-scale)] text-[10px] font-bold uppercase tracking-widest text-red-600">
          {article.category}
        </span>
        <h4 className="font-[family-name:var(--font-owners-xnarrow)] text-[13px] font-bold leading-snug text-gray-900 group-hover:underline">
          {article.title}
        </h4>
        <p className="font-[family-name:var(--font-owners-text)] text-[11px] text-gray-500 mt-0.5">By {article.author}</p>
      </div>
    </a>
  );
}

function TrendingCard({ article, index }) {
  return (
    <a href={article.href || "#"} className="group flex flex-col gap-2 min-w-[210px]">
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-200">
        <span className="absolute top-2 left-2 z-10 bg-indigo-600 text-white text-[11px] font-bold px-2 py-0.5 rounded">
          {String(index + 1).padStart(2, "0")}
        </span>
        <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
      </div>
      <span className="font-[family-name:var(--font-scale)] text-[10px] font-semibold uppercase tracking-widest text-red-600">
        {article.category}
      </span>
      <h3 className="font-[family-name:var(--font-owners-xnarrow)] text-sm font-black leading-tight text-gray-900 group-hover:underline">
        {article.title}
      </h3>
      <p className="font-[family-name:var(--font-owners-text)] text-xs text-gray-500">By {article.author}</p>
    </a>
  );
}

export default function CategoryTemplate1({ data }) {
  const { hero, tabs, featured, latest, deepDive, newsletter } = data;

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-6">
        <p className="font-[family-name:var(--font-scale)] text-[11px] font-bold uppercase tracking-widest text-indigo-600 mb-1">Category</p>
        <h1 className="font-[family-name:var(--font-owners-xnarrow)] text-4xl md:text-5xl font-black uppercase leading-none text-gray-900">
          {hero.title}
        </h1>
        <div className="h-1 w-16 bg-indigo-600 mt-4" />
      </div>

      {/* Subcategory tabs */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-6 flex flex-wrap items-center gap-x-8 gap-y-2 border border-gray-200 rounded-lg py-4">
        {tabs.subcategories.map((sub, i) => (
          <a key={sub} href="#" className={`font-[family-name:var(--font-scale)] text-xs font-semibold uppercase tracking-widest ${i === 0 ? "text-indigo-600" : "text-gray-700 hover:text-indigo-600"} transition-colors`}>
            {sub}
          </a>
        ))}
        <a href="#" className="ml-auto font-[family-name:var(--font-scale)] text-xs font-semibold uppercase tracking-widest text-indigo-600 flex items-center gap-1">
          See {tabs.extraCount} More →
        </a>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <p className="font-[family-name:var(--font-owners-text)] text-sm text-gray-600 leading-relaxed max-w-3xl mb-8">
          {hero.description}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Purple hero banner */}
          <div className="lg:col-span-8">
            <a href={featured.href || "#"} className="group grid grid-cols-1 md:grid-cols-2 bg-indigo-900 overflow-hidden rounded-lg">
              <div className="p-8 flex flex-col justify-center text-white">
                <span className="font-[family-name:var(--font-scale)] text-[11px] font-bold uppercase tracking-widest text-indigo-300 mb-3">
                  {featured.category}
                </span>
                <h2 className="font-[family-name:var(--font-owners-xnarrow)] text-2xl font-black uppercase leading-tight group-hover:underline">
                  {featured.title}
                </h2>
                <p className="font-[family-name:var(--font-owners-text)] text-xs text-indigo-200 mt-4">
                  By {featured.author} · {featured.date}
                </p>
                <span className="mt-6 inline-block w-fit bg-white text-indigo-900 font-[family-name:var(--font-scale)] font-bold text-xs uppercase tracking-widest px-4 py-2 rounded">
                  Read Full Story →
                </span>
              </div>
              <div className="h-56 md:h-full overflow-hidden">
                <img src={featured.image} alt={featured.title} className="w-full h-full object-cover" />
              </div>
            </a>
          </div>

          {/* Right rail */}
          <div className="lg:col-span-4 border border-gray-200 rounded-lg p-5">
            <h3 className="font-[family-name:var(--font-owners-xnarrow)] text-sm font-black uppercase tracking-widest text-indigo-600 border-b border-indigo-200 pb-2 mb-1">
              Latest in {hero.title}
            </h3>
            {latest.map((a) => <RailItem key={a.id} article={a} />)}
          </div>
        </div>
      </div>

      {/* Trending strip */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-8">
        <h3 className="font-[family-name:var(--font-owners-xnarrow)] text-sm font-black uppercase tracking-widest text-gray-900 mb-4">Trending Now</h3>
        <div className="flex gap-6 overflow-x-auto pb-2">
          {latest.map((a, i) => <TrendingCard key={a.id} article={a} index={i} />)}
        </div>
      </div>

      {/* Deep dive */}
      <div className="bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3">
            <p className="font-[family-name:var(--font-scale)] text-[11px] font-bold uppercase tracking-widest text-indigo-600 mb-2">| {deepDive.title}</p>
            <p className="font-[family-name:var(--font-owners-text)] text-sm text-gray-600 leading-relaxed">{deepDive.description}</p>
          </div>
          <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-6">
            {deepDive.items.map((item) => (
              <a key={item.id} href={item.href || "#"} className="group flex flex-col gap-2 bg-white rounded-lg overflow-hidden border border-gray-200">
                <div className="w-full aspect-[16/10] overflow-hidden bg-gray-200">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" />
                </div>
                <div className="p-4">
                  <span className="font-[family-name:var(--font-scale)] text-[10px] font-bold uppercase tracking-widest text-indigo-600">{item.category}</span>
                  <h4 className="font-[family-name:var(--font-owners-xnarrow)] text-sm font-black leading-tight text-gray-900 group-hover:underline mt-1">{item.title}</h4>
                  <p className="font-[family-name:var(--font-owners-text)] text-xs text-gray-500 mt-2">By {item.author}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        <div className="bg-gray-50 rounded-lg flex flex-col md:flex-row items-center gap-6 px-8 py-8">
          <div className="w-14 h-14 shrink-0 rounded-full bg-indigo-900 flex items-center justify-center text-white">✉</div>
          <div className="flex-1">
            <h3 className="font-[family-name:var(--font-owners-xnarrow)] text-lg font-black text-gray-900">{newsletter.title}</h3>
            <p className="font-[family-name:var(--font-owners-text)] text-sm text-gray-500 mt-1">{newsletter.description}</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <input type="email" placeholder="Enter your email" className="flex-1 md:w-64 border border-gray-300 rounded-lg px-4 py-2.5 text-sm" />
            <button className="bg-indigo-900 hover:bg-indigo-800 text-white font-[family-name:var(--font-scale)] font-bold uppercase tracking-widest text-xs px-6 py-2.5 rounded-lg">
              {newsletter.buttonLabel}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
