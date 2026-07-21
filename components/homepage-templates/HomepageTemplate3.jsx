// components/homepage-templates/HomepageTemplate3.jsx
// Variation 3: Magazine Mosaic Grid Layout
// No single hero dominance -- 2-row mosaic grid (1 large + 2 medium, then
// 3 equal), latest news strip, trending sidebar, category ribbons, mixed
// editorial feed. Content-driven via the `data` prop.
// Author names and category tags are real links (to /authors/[slug] and
// /category/[slug]) whenever the data provides an href.
"use client";

import { AuthorByline } from "../shared/ArticleLinks";

function MosaicCard({ article, size = "medium" }) {
  const aspect = size === "large" ? "aspect-[16/10]" : size === "medium" ? "aspect-[4/3]" : "aspect-square";
  const titleSize = size === "large" ? "text-2xl md:text-3xl" : size === "medium" ? "text-lg" : "text-sm";
  return (
    <div className="group flex flex-col gap-2">
      <a href={article.href || "#"} className="flex flex-col gap-2">
        <div className={`w-full ${aspect} overflow-hidden bg-gray-100`}>
          <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
        </div>
        <span className="font-[family-name:var(--font-scale)] text-[10px] font-semibold uppercase tracking-widest text-red-600">{article.category}</span>
        <h3 className={`font-[family-name:var(--font-owners-xnarrow)] ${titleSize} font-black uppercase leading-tight text-gray-900 group-hover:underline`}>
          {article.title}
        </h3>
      </a>
      <p className="font-[family-name:var(--font-owners-text)] text-xs text-gray-500">
        <AuthorByline author={article.author} authorHref={article.authorHref} />
      </p>
    </div>
  );
}

function MosaicGrid({ hero, secondary, topStories }) {
  // Row 1: 1 large feature + 2 medium cards. Row 2: 3 equal cards.
  const mediumPair = secondary.slice(0, 2);
  const equalTrio = topStories.slice(0, 3);

  return (
    <section className="w-full space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <MosaicCard article={hero} size="large" />
        </div>
        <div className="flex flex-col gap-8">
          {mediumPair.map((a) => <MosaicCard key={a.id} article={a} size="medium" />)}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {equalTrio.map((a) => <MosaicCard key={a.id} article={a} size="small" />)}
      </div>
    </section>
  );
}

function LatestNewsStrip({ latest }) {
  return (
    <section className="w-full">
      <div className="flex items-center gap-2 mb-4 border-b border-gray-300 pb-2">
        <span className="relative inline-flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-60 animate-ping" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
        </span>
        <h2 className="font-[family-name:var(--font-owners-text)] text-xs font-black uppercase tracking-widest text-gray-900">Latest News</h2>
      </div>
      <div className="flex gap-6 overflow-x-auto pb-2">
        {latest.map((story) => (
          <a key={story.id} href={story.href || "#"} className="group flex flex-col gap-2 min-w-[180px]">
            <div className="w-full aspect-[4/3] overflow-hidden bg-gray-100">
              {story.image && <img src={story.image} alt={story.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" />}
            </div>
            <span className="font-[family-name:var(--font-scale)] text-[9px] font-bold uppercase tracking-widest text-red-600">{story.category}</span>
            <h4 className="font-[family-name:var(--font-owners-xnarrow)] text-sm font-black leading-tight text-gray-900 group-hover:underline break-words">{story.title}</h4>
          </a>
        ))}
      </div>
    </section>
  );
}

function TrendingSidebar({ latest }) {
  return (
    <div className="border border-gray-200 bg-white p-4 h-fit">
      <h3 className="font-[family-name:var(--font-scale)] text-[11px] font-bold uppercase tracking-widest text-gray-900 border-b border-gray-200 pb-2 mb-3">
        Trending Now
      </h3>
      <ul className="divide-y divide-gray-100">
        {latest.slice(0, 5).map((story, i) => (
          <li key={story.id} className="py-2.5 flex gap-2">
            <span className="text-red-600 font-black text-sm">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <a href={story.href || "#"} className="group">
                <h4 className="font-[family-name:var(--font-owners-xnarrow)] text-[12.5px] font-bold leading-snug text-gray-900 group-hover:underline break-words">{story.title}</h4>
              </a>
              <p className="font-[family-name:var(--font-owners-text)] text-[11px] text-gray-500 mt-0.5">
                <AuthorByline author={story.author} authorHref={story.authorHref} />
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CategoryRibbon({ title, articles }) {
  return (
    <section className="w-full py-6">
      <div className="flex items-center gap-3 mb-4 border-b border-gray-300 pb-2">
        <h2 className="font-[family-name:var(--font-owners-xnarrow)] text-xl font-black uppercase tracking-wide text-red-600 break-words">{title}</h2>
      </div>
      <div className="flex gap-6 overflow-x-auto pb-2">
        {articles.map((article) => (
          <a key={article.id} href={article.href || "#"} className="group flex flex-col gap-2 min-w-[220px]">
            <div className="w-full aspect-[4/3] overflow-hidden bg-gray-100">
              <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
            </div>
            <span className="font-[family-name:var(--font-scale)] text-[10px] font-semibold uppercase tracking-widest text-red-600">{article.category}</span>
            <h3 className="font-[family-name:var(--font-owners-xnarrow)] text-base font-black uppercase leading-tight text-gray-900 group-hover:underline break-words">{article.title}</h3>
          </a>
        ))}
      </div>
    </section>
  );
}

function MixedFeed({ feed }) {
  return (
    <section className="w-full">
      <div className="border-b border-gray-300 pb-2 mb-2">
        <h2 className="font-[family-name:var(--font-owners-xnarrow)] text-xl font-black uppercase tracking-wide text-red-600 break-words">The Feed</h2>
      </div>
      <ul className="divide-y divide-dashed divide-gray-300">
        {feed.map((article, i) => (
          <li key={article.id} className={`flex gap-4 py-4 items-start ${i % 2 === 1 ? "flex-row-reverse text-right" : ""}`}>
            <a
              href={article.href || "#"}
              className="group flex gap-4 flex-1"
            >
              <div className="flex-shrink-0 w-36 sm:w-48 aspect-[4/3] overflow-hidden bg-gray-100">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
              </div>
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <span className="font-[family-name:var(--font-scale)] text-[10px] font-semibold uppercase tracking-widest text-red-600">{article.category}</span>
                <h3 className="font-[family-name:var(--font-owners-xnarrow)] text-lg sm:text-xl font-black uppercase leading-tight text-gray-900 group-hover:underline break-words">{article.title}</h3>
                <p className="font-[family-name:var(--font-owners-text)] text-xs text-gray-500">
                  <AuthorByline author={article.author} authorHref={article.authorHref} />
                </p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function HomepageTemplate3({ data }) {
  const { hero, secondary, latest, topStories, categorySections, feed } = data;

  return (
    <main className="min-h-[100vh] bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <MosaicGrid hero={hero} secondary={secondary} topStories={topStories} />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-8">
        <LatestNewsStrip latest={latest} />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-9 w-full divide-y divide-gray-200">
            {categorySections.map((section) => (
              <CategoryRibbon key={section.id} title={section.title} articles={section.articles} />
            ))}
          </div>
          <div className="lg:col-span-3">
            <TrendingSidebar latest={latest} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <MixedFeed feed={feed} />
      </div>
    </main>
  );
}
