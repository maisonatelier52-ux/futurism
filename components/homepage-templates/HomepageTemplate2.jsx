// components/homepage-templates/HomepageTemplate2.jsx
// Variation 2: Split Hero Carousel + Dual Feed System
// Full-width hero banner (rotates through hero+secondary as slides),
// category icon row, top stories grid, latest news strip, category
// sections, the feed. Content-driven via the `data` prop.
// Author names and category tags are real links (to /authors/[slug] and
// /category/[slug]) whenever the data provides an href.
"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { AuthorByline, CategoryTag } from "../shared/ArticleLinks";

function HeroCarousel({ hero, secondary }) {
  const slides = [hero, ...secondary].filter(Boolean);
  const [index, setIndex] = useState(0);
  const active = slides[index] || hero;

  function next() {
    setIndex((i) => (i + 1) % slides.length);
  }

  return (
    <div className="relative w-full aspect-[16/8] md:aspect-[16/6] overflow-hidden bg-gray-900 group">
      <a href={active.href || "#"} className="absolute inset-0">
        <img src={active.image} alt={active.title} className="w-full h-full object-cover" />
      </a>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 p-6 md:p-10 max-w-2xl">
        <span className="font-[family-name:var(--font-scale)] text-[11px] font-bold uppercase tracking-widest text-red-400">
          {active.category}
        </span>
        <a href={active.href || "#"}>
          <h2 className="font-[family-name:var(--font-owners-xnarrow)] text-2xl md:text-4xl font-black uppercase leading-tight text-white mt-2 hover:underline break-words">
            {active.title}
          </h2>
        </a>
        {active.excerpt && (
          <p className="font-[family-name:var(--font-bitter)] italic text-white/80 text-sm md:text-base mt-3 max-w-xl">
            "{active.excerpt}"
          </p>
        )}
        <p className="font-[family-name:var(--font-owners-text)] text-xs text-white/60 mt-3">
          <AuthorByline author={active.author} authorHref={active.authorHref} className="text-white/60" nameClassName="font-semibold text-white/90" />
        </p>
        <a href={active.href || "#"} className="inline-block mt-5 bg-white text-black font-[family-name:var(--font-scale)] font-bold uppercase tracking-widest text-xs px-5 py-2.5 rounded">
          Read More
        </a>
      </div>
      {slides.length > 1 && (
        <button
          onClick={next}
          aria-label="Next slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors z-10"
        >
          <ChevronRight size={18} />
        </button>
      )}
      <div className="absolute bottom-3 right-4 flex gap-1.5">
        {slides.map((_, i) => (
          <span key={i} className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-white" : "w-1.5 bg-white/40"}`} />
        ))}
      </div>
    </div>
  );
}

// Quick nav row linking to real category pages. `categories` comes from
// the live category list (see resolver/page); falls back to a static
// placeholder set only if none was provided.
function CategoryIconRow({ categories }) {
  const items = categories?.length
    ? categories
    : ["AI", "SOCIETY", "HEALTH", "MACHINES", "SCIENCE", "SPACE", "TRANSPORT"].map((label) => ({ name: label, slug: "" }));

  return (
    <div className="flex items-center justify-center gap-8 md:gap-12 py-6 flex-wrap">
      {items.map((cat) => (
        <a key={cat.slug || cat.name} href={cat.slug ? `/category/${cat.slug}` : "#"} className="flex flex-col items-center gap-2 group">
          <span className="w-11 h-11 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 group-hover:border-red-600 group-hover:text-red-600 transition-colors text-[10px] font-bold">
            {cat.name.slice(0, 2)}
          </span>
          <span className="font-[family-name:var(--font-scale)] text-[10px] font-semibold uppercase tracking-widest text-gray-600 group-hover:text-red-600">
            {cat.name}
          </span>
        </a>
      ))}
    </div>
  );
}

function TopStoriesGrid({ topStories }) {
  return (
    <section className="w-full">
      <div className="flex items-center gap-3 mb-5 border-b border-gray-300 pb-3">
        <h2 className="font-[family-name:var(--font-scale)] text-sm font-bold uppercase tracking-widest text-red-600">Top Stories</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {topStories.map((story) => (
          <div key={story.id} className="group flex flex-col gap-2">
            <a href={story.href || "#"} className="flex flex-col gap-2">
              <div className="w-full aspect-[4/3] overflow-hidden bg-gray-100">
                <img src={story.image} alt={story.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
              </div>
              <span className="font-[family-name:var(--font-scale)] text-[10px] font-semibold uppercase tracking-widest text-red-600">{story.category}</span>
              <h3 className="font-[family-name:var(--font-owners-xnarrow)] text-sm font-black uppercase leading-tight text-gray-900 group-hover:underline break-words">{story.title}</h3>
            </a>
            <p className="font-[family-name:var(--font-owners-text)] text-xs text-gray-500">
              <AuthorByline author={story.author} authorHref={story.authorHref} />
            </p>
          </div>
        ))}
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {latest.map((story) => (
          <a key={story.id} href={story.href || "#"} className="group flex gap-3">
            <div className="w-16 h-16 shrink-0 overflow-hidden bg-gray-100">
              {story.image && <img src={story.image} alt={story.title} className="w-full h-full object-cover" />}
            </div>
            <div className="min-w-0">
              <span className="font-[family-name:var(--font-scale)] text-[9px] font-bold uppercase tracking-widest text-red-600">{story.category}</span>
              <h4 className="font-[family-name:var(--font-owners-xnarrow)] text-[12px] font-bold leading-snug text-gray-900 group-hover:underline break-words">{story.title}</h4>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function CategorySectionBlock({ title, articles }) {
  return (
    <section className="w-full py-6">
      <div className="flex items-center gap-3 mb-4 border-b border-gray-300 pb-2">
        <h2 className="font-[family-name:var(--font-owners-xnarrow)] text-xl font-black uppercase tracking-wide text-red-600 break-words">{title}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div key={article.id} className="group flex flex-col gap-2">
            <a href={article.href || "#"} className="flex flex-col gap-2">
              <div className="w-full aspect-[4/3] overflow-hidden bg-gray-100">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
              </div>
              <span className="font-[family-name:var(--font-scale)] text-[10px] font-semibold uppercase tracking-widest text-red-600 mt-1">{article.category}</span>
              <h3 className="font-[family-name:var(--font-owners-xnarrow)] text-lg font-black uppercase leading-tight text-gray-900 group-hover:underline break-words">{article.title}</h3>
            </a>
            <p className="font-[family-name:var(--font-owners-text)] text-xs text-gray-500">
              <AuthorByline author={article.author} authorHref={article.authorHref} />
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function TheFeedList({ feed }) {
  return (
    <section className="w-full">
      <div className="border-b border-gray-300 pb-2 mb-2">
        <h2 className="font-[family-name:var(--font-owners-xnarrow)] text-xl font-black uppercase tracking-wide text-red-600 break-words">The Feed</h2>
      </div>
      <ul className="divide-y divide-dashed divide-gray-300">
        {feed.map((article) => (
          <li key={article.id} className="flex flex-row gap-4 py-4 items-start">
            <a href={article.href || "#"} className="group flex flex-row gap-4 flex-1">
              <div className="flex-shrink-0 w-36 sm:w-44 lg:w-64 aspect-[4/3] overflow-hidden bg-gray-100">
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

function NewsletterSidebarBox({ newsletter }) {
  return (
    <div className="bg-[#1f2326] text-white p-5">
      <h3 className="font-[family-name:var(--font-owners-xnarrow)] text-lg font-black uppercase leading-tight tracking-wide mb-2 break-words">{newsletter.title}</h3>
      <p className="font-[family-name:var(--font-owners-text)] text-gray-300 text-xs leading-relaxed mb-4">{newsletter.description}</p>
      <div className="space-y-3">
        <input type="email" placeholder="Enter your email" className="w-full h-9 px-3 bg-white text-black text-xs border border-gray-300 focus:outline-none rounded-none" />
        <button className="w-full h-9 bg-white text-black font-[family-name:var(--font-scale)] font-bold uppercase tracking-widest text-xs border border-white hover:bg-gray-200 transition rounded-none">
          {newsletter.buttonLabel}
        </button>
      </div>
    </div>
  );
}

function TrendingSidebar({ latest }) {
  return (
    <div className="border border-gray-200 bg-white p-4">
      <h3 className="font-[family-name:var(--font-scale)] text-[11px] font-bold uppercase tracking-widest text-gray-900 border-b border-gray-200 pb-2 mb-3">
        Trending Now
      </h3>
      <ul className="divide-y divide-gray-100">
        {latest.slice(0, 5).map((story, i) => (
          <li key={story.id} className="py-2.5 flex gap-2">
            <span className="text-red-600 font-black text-sm">{i + 1}</span>
            <a href={story.href || "#"} className="group">
              <h4 className="font-[family-name:var(--font-owners-xnarrow)] text-[12.5px] font-bold leading-snug text-gray-900 group-hover:underline break-words">{story.title}</h4>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function HomepageTemplate2({ data }) {
  const { hero, secondary, latest, topStories, categorySections, feed, newsletter, categories } = data;

  return (
    <main className="min-h-[100vh] bg-gray-50">
      <HeroCarousel hero={hero} secondary={secondary} />
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <CategoryIconRow categories={categories} />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-8">
        <TopStoriesGrid topStories={topStories} />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-8">
        <LatestNewsStrip latest={latest} />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-8">
        <div className="w-full divide-y divide-gray-200">
          {categorySections.map((section) => (
            <CategorySectionBlock key={section.id} title={section.title} articles={section.articles} />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <TheFeedList feed={feed} />
          </div>
          <div className="lg:col-span-4 flex flex-col gap-4">
            <NewsletterSidebarBox newsletter={newsletter} />
            <TrendingSidebar latest={latest} />
          </div>
        </div>
      </div>
    </main>
  );
}
