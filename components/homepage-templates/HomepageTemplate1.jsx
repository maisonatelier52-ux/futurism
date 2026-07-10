// components/homepage-templates/HomepageTemplate1.jsx
// Variation 1 (Default): Hero dominant + right rail + top stories + category sections + feed
// This is your original homepage layout, now content-driven via the `data` prop
// so every block is editable from the Homepage Builder. Visual output is unchanged.
"use client";

function HeroSection({ hero, secondary }) {
  return (
    <section className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        {/* Hero Article */}
        <div className="md:col-span-2 md:border-r border-gray-200 md:pr-6">
          <a href={hero.href || "#"} className="group block">
            <div className="w-full aspect-[4/3] overflow-hidden bg-gray-100 mb-4">
              <img src={hero.image} alt={hero.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
            </div>
            <span className="font-[family-name:var(--font-scale)] text-[10px] font-semibold uppercase tracking-widest text-red-600 block mb-2 text-center">
              {hero.category}
            </span>
            <h2 className="font-[family-name:var(--font-owners-xnarrow)] text-2xl md:text-4xl font-black leading-tight uppercase text-gray-900 text-center group-hover:underline mb-4 px-2 break-words hyphens-auto md:line-clamp-3 line-clamp-none">
              {hero.title}
            </h2>
            <p className="font-[family-name:var(--font-bitter)] italic text-xl text-[#4a90a4] text-center leading-relaxed mb-3 px-4">
              "{hero.excerpt}"
            </p>
            <p className="font-[family-name:var(--font-owners-text)] text-xs text-center text-gray-500">
              By <span className="font-semibold text-gray-800 underline">{hero.author}</span>
            </p>
          </a>
        </div>

        {/* Secondary Articles */}
        <div className="flex flex-col divide-y divide-gray-200 md:pl-6">
          {secondary.map((article) => (
            <a key={article.id} href={article.href || "#"} className="group flex flex-col gap-3 py-5 first:pt-0 md:first:pt-0">
              <span className="text-[10px] font-bold uppercase tracking-widest text-red-600">{article.category}</span>
              <h3 className="font-[family-name:var(--font-owners-xnarrow)] text-2xl font-black leading-none uppercase text-gray-900 group-hover:underline">
                {article.title}
              </h3>
              <p className="text-xs text-gray-500">
                By <span className="font-semibold text-gray-800 underline">{article.author}</span>
              </p>
              <div className="w-full aspect-[4/3] overflow-hidden bg-gray-100">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function LatestStoriesRail({ latest }) {
  return (
    <aside className="w-full">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-300">
        <span className="relative inline-flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-60 animate-ping"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600 shadow-md shadow-red-500/40"></span>
        </span>
        <h2 className="font-[family-name:var(--font-owners-text)] text-xs font-black uppercase tracking-widest text-gray-900">
          Our Latest Stories
        </h2>
      </div>
      <ul className="divide-y divide-gray-200">
        {latest.map((story) => (
          <li key={story.id} className="py-5">
            <a href="#" className="group block">
              <span className="font-[family-name:var(--font-scale)] text-[10px] font-semibold uppercase tracking-widest text-red-600 block mb-1">
                {story.category}
              </span>
              <h3 className="font-[family-name:var(--font-owners-xnarrow)] text-lg font-black uppercase leading-tight text-gray-900 group-hover:underline mb-1">
                {story.title}
              </h3>
              <p className="font-[family-name:var(--font-owners-text)] text-xs text-gray-500">
                By <span className="font-semibold text-gray-700 hover:underline cursor-pointer">{story.author}</span>
              </p>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function TopStoriesGrid({ topStories }) {
  return (
    <section className="w-full py-1">
      <div className="flex items-center gap-3 mb-6 border-b border-gray-300 pb-3">
        <h2 className="font-[family-name:var(--font-scale)] text-sm font-bold uppercase tracking-widest text-red-600">Top Stories</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {topStories.map((story) => (
          <a key={story.id} href={story.href || "#"} className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="w-full aspect-[4/3] overflow-hidden bg-gray-100">
              <img src={story.image} alt={story.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
            </div>
            <div className="flex flex-col flex-1 p-4 text-center">
              <span className="font-[family-name:var(--font-scale)] text-[10px] font-semibold uppercase tracking-widest text-red-600 block mb-2">{story.category}</span>
              <h3 className="font-[family-name:var(--font-owners-xnarrow)] text-base md:text-lg font-black uppercase leading-tight text-gray-900 group-hover:underline mb-3 flex-1">{story.title}</h3>
              <p className="font-[family-name:var(--font-owners-text)] text-xs text-gray-500 mb-4">
                By <span className="font-semibold text-gray-700 underline">{story.author}</span>
              </p>
              <div className="flex justify-center">
                <span className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600 transition-colors duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
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
        <h2 className="font-[family-name:var(--font-owners-xnarrow)] text-xl font-black uppercase tracking-wide text-red-600">{title}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        {articles.map((article) => (
          <a key={article.id} href={article.href || "#"} className="group flex flex-col gap-2">
            <div className="w-full aspect-[4/3] overflow-hidden bg-gray-100">
              <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
            </div>
            <span className="font-[family-name:var(--font-scale)] text-[10px] font-semibold uppercase tracking-widest text-red-600 mt-1">{article.category}</span>
            <h3 className="font-[family-name:var(--font-owners-xnarrow)] text-lg font-black uppercase leading-tight text-gray-900 group-hover:underline">{article.title}</h3>
            <p className="font-[family-name:var(--font-owners-text)] text-xs text-gray-500">
              By <span className="font-semibold text-gray-700 underline">{article.author}</span>
            </p>
          </a>
        ))}
      </div>
      <div className="flex justify-center mt-2">
        <button className="font-[family-name:var(--font-scale)] text-xs font-semibold uppercase tracking-widest px-8 py-3 rounded-full border border-gray-400 text-gray-800 hover:border-gray-800 hover:bg-gray-900 hover:text-white transition-all duration-200">
          Read More
        </button>
      </div>
    </section>
  );
}

function TheFeedList({ feed }) {
  return (
    <section className="w-full">
      <div className="border-b border-gray-300 pb-2 mb-2">
        <h2 className="font-[family-name:var(--font-owners-xnarrow)] text-xl font-black uppercase tracking-wide text-red-600">The Feed</h2>
      </div>
      <ul className="divide-y divide-dashed divide-gray-300">
        {feed.map((article) => (
          <li key={article.id}>
            <a href={article.href || "#"} className="group flex flex-row gap-4 py-4 items-start">
              <div className="flex-shrink-0 w-36 sm:w-44 lg:w-80 aspect-[4/3] overflow-hidden bg-gray-100">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
              </div>
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <span className="font-[family-name:var(--font-scale)] text-[10px] font-semibold uppercase tracking-widest text-red-600">{article.category}</span>
                <h3 className="font-[family-name:var(--font-owners-xnarrow)] text-xl sm:text-2xl font-black uppercase leading-tight text-gray-900 group-hover:underline">{article.title}</h3>
                <p className="font-[family-name:var(--font-owners-text)] text-xs text-gray-500">
                  By <span className="font-semibold text-gray-700 underline">{article.author}</span>
                </p>
              </div>
            </a>
          </li>
        ))}
      </ul>
      <div className="flex justify-center pt-6">
        <button className="font-[family-name:var(--font-scale)] text-xs font-semibold uppercase tracking-widest px-8 py-3 rounded-full border border-gray-400 text-gray-800 hover:border-gray-800 hover:bg-gray-900 hover:text-white transition-all duration-200">
          More Stories
        </button>
      </div>
    </section>
  );
}

function FeedNewsletterBox({ newsletter }) {
  return (
    <div className="bg-[#1f2326] text-white p-5">
      <h3 className="font-[family-name:var(--font-owners-xnarrow)] text-lg font-black uppercase leading-tight tracking-wide mb-2">{newsletter.title}</h3>
      <p className="font-[family-name:var(--font-owners-text)] text-gray-300 text-xs leading-relaxed mb-4">{newsletter.description}</p>
      <div className="space-y-3 mb-3">
        <input type="email" placeholder="Enter your email" className="w-full h-9 px-3 bg-white text-black text-xs border border-gray-300 focus:outline-none rounded-none" />
        <button className="w-full h-9 bg-white text-black font-[family-name:var(--font-scale)] font-bold uppercase tracking-widest text-xs border border-white hover:bg-gray-200 transition rounded-none">
          {newsletter.buttonLabel}
        </button>
      </div>
      <p className="font-[family-name:var(--font-owners-text)] text-[10px] text-gray-400">
        <a href="#" className="underline hover:text-white">Terms of Service</a>{" & "}
        <a href="#" className="underline hover:text-white">Privacy Policy</a>
      </p>
    </div>
  );
}

function FuturismOriginalsBox({ originals }) {
  return (
    <div className="border border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-4 py-2">
        <h2 className="font-[family-name:var(--font-scale)] text-[11px] font-bold uppercase tracking-widest text-gray-900">{originals.sectionTitle}</h2>
      </div>
      <div className="w-full aspect-[16/9] overflow-hidden bg-gray-100">
        <img src={originals.featuredImage} alt={originals.sectionTitle} className="w-full h-full object-cover" />
      </div>
      <ul className="divide-y divide-dashed divide-gray-200">
        {originals.items.map((article) => (
          <li key={article.id} className="px-4 py-3">
            <a href={article.href || "#"} className="group block">
              <span className="font-[family-name:var(--font-scale)] text-[9px] font-semibold uppercase tracking-widest text-red-600 block mb-1">{article.category}</span>
              <h3 className="font-[family-name:var(--font-owners-text)] text-sm leading-snug text-gray-900 group-hover:underline mb-1">{article.title}</h3>
              <p className="font-[family-name:var(--font-owners-text)] text-[10px] text-gray-500">
                By <span className="font-semibold text-gray-700 underline">{article.author}</span>
              </p>
            </a>
          </li>
        ))}
      </ul>
      <div className="flex justify-center py-4 px-4">
        <button className="font-[family-name:var(--font-scale)] text-xs font-semibold uppercase tracking-widest px-8 py-2.5 rounded-full border border-gray-400 text-gray-800 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-200 w-full">
          See More
        </button>
      </div>
    </div>
  );
}

export default function HomepageTemplate1({ data }) {
  const { hero, secondary, latest, topStories, categorySections, feed, newsletter, originals } = data;

  return (
    <main className="min-h-[100vh] bg-gray-50">
      {/* Hero + Latest Stories Rail */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-9">
            <HeroSection hero={hero} secondary={secondary} />
          </div>
          <div className="lg:col-span-3 lg:border-l border-gray-200 lg:pl-8">
            <LatestStoriesRail latest={latest} />
          </div>
        </div>
      </div>

      {/* Top Stories */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-8">
        <TopStoriesGrid topStories={topStories} />
      </div>

      {/* Category Sections */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-8">
        <div className="w-full divide-y divide-gray-200">
          {categorySections.map((section) => (
            <CategorySectionBlock key={section.id} title={section.title} articles={section.articles} />
          ))}
        </div>
      </div>

      {/* The Feed + Sidebar */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 mt-0 pt-0">
            <TheFeedList feed={feed} />
          </div>
          <div className="lg:col-span-4 flex flex-col gap-4">
            <FeedNewsletterBox newsletter={newsletter} />
            <div className="sticky top-4">
              <FuturismOriginalsBox originals={originals} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
