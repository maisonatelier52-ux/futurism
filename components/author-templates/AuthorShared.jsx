// components/author-templates/AuthorShared.jsx
// Small shared pieces (article card + pagination) reused by all 4 author
// page templates, so grid/pagination markup and behavior stay consistent.
"use client";

export function AuthorArticleCard({ article }) {
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
      <h3 className="font-[family-name:var(--font-owners-xnarrow)] text-sm sm:text-base font-black uppercase leading-tight text-gray-900 group-hover:underline">
        {article.title}
      </h3>
      {article.author && (
        <p className="font-[family-name:var(--font-owners-text)] text-xs text-gray-500">
          By <span className="font-semibold text-gray-700 underline">{article.author}</span>
        </p>
      )}
    </a>
  );
}

export function AuthorPagination({ current, total, dark = false }) {
  const activeCls = "bg-red-600 text-white";
  const idleCls = dark
    ? "text-gray-300 hover:bg-white/10"
    : "text-gray-700 hover:bg-gray-100";
  return (
    <div className="flex items-center justify-center gap-1 py-8 sm:py-10 flex-wrap">
      <button className={`w-9 h-9 flex items-center justify-center rounded-sm font-[family-name:var(--font-scale)] text-sm font-bold ${activeCls}`}>
        {current}
      </button>
      {[2, 3].map((p) => (
        <button key={p} className={`w-9 h-9 flex items-center justify-center rounded-sm font-[family-name:var(--font-scale)] text-sm ${idleCls}`}>
          {p}
        </button>
      ))}
      <span className={`w-9 h-9 flex items-center justify-center font-[family-name:var(--font-scale)] text-sm ${dark ? "text-gray-500" : "text-gray-400"}`}>...</span>
      <button className={`w-9 h-9 flex items-center justify-center rounded-sm font-[family-name:var(--font-scale)] text-sm ${idleCls}`}>
        {total}
      </button>
      <button className={`w-9 h-9 flex items-center justify-center rounded-sm ${dark ? "text-red-400 hover:bg-white/10" : "text-red-600 hover:bg-red-50"}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
