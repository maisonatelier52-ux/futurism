// components/homepage-templates/HomepageTemplate4.jsx
// Variation 4: Editorial Feed + Sticky Intelligence Column
// Large stacked story cards (left, ~65%), sticky sidebar (right, ~35%)
// with Trending Now / Newsletter Signup / Category shortcuts, mid-feed
// inserts (sponsored slot + featured editor pick), bottom category
// expansion grid. Content-driven via the `data` prop.
// Author names and category tags are real links (to /authors/[slug] and
// /category/[slug]) whenever the data provides an href.
"use client";

import { AuthorByline } from "../shared/ArticleLinks";

function StackedStoryCard({ article, large = false }) {
  return (
    <div className="group flex flex-col gap-3 py-6 border-b border-gray-200">
      <a href={article.href || "#"} className="flex flex-col gap-3">
        <div className={`w-full ${large ? "aspect-[16/9]" : "aspect-[16/8]"} overflow-hidden bg-gray-100`}>
          <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
        </div>
        <span className="font-[family-name:var(--font-scale)] text-[10px] font-semibold uppercase tracking-widest text-red-600">{article.category}</span>
        <h3 className={`font-[family-name:var(--font-owners-xnarrow)] ${large ? "text-3xl" : "text-2xl"} font-black uppercase leading-tight text-gray-900 group-hover:underline`}>
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="font-[family-name:var(--font-bitter)] italic text-[#4a90a4] text-base">"{article.excerpt}"</p>
        )}
      </a>
      <p className="font-[family-name:var(--font-owners-text)] text-xs text-gray-500">
        <AuthorByline author={article.author} authorHref={article.authorHref} nameClassName="font-semibold text-gray-700" />
      </p>
    </div>
  );
}

function SponsoredSlot() {
  return (
    <div className="my-6 border border-dashed border-gray-300 bg-gray-50 rounded-lg p-6 text-center">
      <span className="font-[family-name:var(--font-scale)] text-[10px] font-bold uppercase tracking-widest text-gray-400">Sponsored</span>
      <p className="font-[family-name:var(--font-owners-text)] text-sm text-gray-400 mt-2">Ad slot — reserved space in the feed</p>
    </div>
  );
}

function EditorPickBlock({ article }) {
  if (!article) return null;
  return (
    <div className="group flex flex-col md:flex-row gap-4 my-6 bg-white border border-gray-200 rounded-lg overflow-hidden">
      <a href={article.href || "#"} className="flex flex-col md:flex-row gap-4 flex-1">
        <div className="md:w-2/5 aspect-[4/3] md:aspect-auto overflow-hidden bg-gray-100">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" />
        </div>
        <div className="p-5 flex flex-col justify-center">
          <span className="font-[family-name:var(--font-scale)] text-[10px] font-bold uppercase tracking-widest text-red-600">Editor's Pick</span>
          <h3 className="font-[family-name:var(--font-owners-xnarrow)] text-xl font-black uppercase leading-tight text-gray-900 group-hover:underline mt-2 break-words">{article.title}</h3>
          <p className="font-[family-name:var(--font-owners-text)] text-xs text-gray-500 mt-2">
            <AuthorByline author={article.author} authorHref={article.authorHref} />
          </p>
        </div>
      </a>
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

function NewsletterBox({ newsletter }) {
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

// Jumps to that category section further down this same page (these are
// curated homepage sections, not necessarily 1:1 with real category pages).
function CategoryShortcuts({ categorySections }) {
  return (
    <div className="border border-gray-200 bg-white p-4">
      <h3 className="font-[family-name:var(--font-scale)] text-[11px] font-bold uppercase tracking-widest text-gray-900 border-b border-gray-200 pb-2 mb-3">
        Category Shortcuts
      </h3>
      <ul className="flex flex-col gap-2">
        {categorySections.map((section) => (
          <li key={section.id}>
            <a href={`#section-${section.id}`} className="font-[family-name:var(--font-scale)] text-xs font-semibold uppercase tracking-widest text-gray-700 hover:text-red-600 transition-colors">
              {section.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CategoryExpansionGrid({ categorySections }) {
  return (
    <section className="w-full space-y-8">
      {categorySections.map((section) => (
        <div key={section.id} id={`section-${section.id}`} className="scroll-mt-24">
          <div className="flex items-center gap-3 mb-4 border-b border-gray-300 pb-2">
            <h2 className="font-[family-name:var(--font-owners-xnarrow)] text-xl font-black uppercase tracking-wide text-red-600 break-words">{section.title}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {section.articles.map((article) => (
              <div key={article.id} className="group flex flex-col gap-2">
                <a href={article.href || "#"} className="flex flex-col gap-2">
                  <div className="w-full aspect-[4/3] overflow-hidden bg-gray-100">
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                  </div>
                  <span className="font-[family-name:var(--font-scale)] text-[10px] font-semibold uppercase tracking-widest text-red-600">{article.category}</span>
                  <h3 className="font-[family-name:var(--font-owners-xnarrow)] text-base font-black uppercase leading-tight text-gray-900 group-hover:underline break-words">{article.title}</h3>
                </a>
                <p className="font-[family-name:var(--font-owners-text)] text-xs text-gray-500">
                  <AuthorByline author={article.author} authorHref={article.authorHref} />
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

export default function HomepageTemplate4({ data }) {
  const { hero, secondary, latest, topStories, categorySections, feed, newsletter } = data;

  // Build the primary editorial feed: hero + secondary + a slice of topStories/feed as stacked cards
  const stacked = [hero, ...secondary, ...topStories.slice(0, 2)].filter(Boolean);
  const editorPick = feed?.[0];
  const restOfFeed = feed?.slice(1) || [];

  return (
    <main className="min-h-[100vh] bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: editorial feed */}
          <div className="lg:col-span-8">
            {stacked.map((article, i) => (
              <div key={article.id ?? i}>
                <StackedStoryCard article={article} large={i === 0} />
                {i === 0 && <SponsoredSlot />}
                {i === 1 && <EditorPickBlock article={editorPick} />}
              </div>
            ))}

            {/* Continue with the rest of the feed as smaller stacked cards */}
            <div className="divide-y divide-gray-200">
              {restOfFeed.map((article) => (
                <StackedStoryCard key={article.id} article={article} />
              ))}
            </div>
          </div>

          {/* Right: sticky sidebar */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-4 flex flex-col gap-4">
              <TrendingSidebar latest={latest} />
              <NewsletterBox newsletter={newsletter} />
              <CategoryShortcuts categorySections={categorySections} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: full category expansion grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-8">
        <CategoryExpansionGrid categorySections={categorySections} />
      </div>
    </main>
  );
}
