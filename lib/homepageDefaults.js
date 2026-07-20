// lib/homepageDefaults.js
//
// The Homepage Builder no longer stores hand-typed article arrays. Instead,
// each article-driven section stores a small QUERY CONFIG describing which
// real articles (from Admin -> Articles) should appear there -- sitewide
// latest, latest from one category, or a specific pinned set -- and the
// resolver (components/HomepageResolver.jsx) expands that query into real
// article data shaped exactly like the old manual arrays, so every
// HomepageTemplate1-4.jsx keeps working completely unchanged.
//
// Sections that are inherently curatorial rather than "latest from
// category X" (Futurism Originals, and each Category Section's title)
// remain manually editable, per your instruction.

// Shape of one article-driven section's query config.
export function defaultQuery(overrides = {}) {
  return {
    mode: "auto",       // "auto" | "pinned"
    category: "",        // category slug, "" = sitewide
    limit: 5,
    pinnedIds: [],        // article _ids, used when mode === "pinned"
    ...overrides,
  };
}

export const DEFAULT_HOMEPAGE_SECTION_CONTENT = {
  // Single dominant hero article -- auto-picks the sitewide (or
  // category-filtered) most recent article unless a specific one is pinned.
  heroQuery: defaultQuery({ limit: 1 }),

  // Secondary/featured articles next to the hero.
  secondaryQuery: defaultQuery({ limit: 2 }),

  // "Our Latest Stories" rail.
  latestQuery: defaultQuery({ limit: 5 }),

  // "Top Stories" grid.
  topStoriesQuery: defaultQuery({ limit: 4 }),

  // "The Feed" long list.
  feedQuery: defaultQuery({ limit: 10 }),

  // Category Sections ("AI Psychosis", "Musk Watch", etc.) -- titles stay
  // hand-picked/curatorial, but each section's articles are now a query
  // (defaults to that section's own category, since these often map 1:1
  // to a real category or theme you want to filter by).
  categorySections: [
    { id: "section-1", title: "AI Psychosis", query: defaultQuery({ limit: 3 }) },
    { id: "section-2", title: "Musk Watch", query: defaultQuery({ limit: 3 }) },
  ],

  // Manual, non-article content -- unchanged.
  newsletter: {
    title: "Sign up to see the future, today",
    description: "Can't-miss innovations from the bleeding edge of science and tech",
    buttonLabel: "Sign Up",
  },
  originals: {
    sectionTitle: "Futurism Originals",
    featuredImage: "/images/img8.webp",
    // Curatorial pinned list -- these are hand-picked by design, so they
    // stay as a small manual list rather than a query.
    items: [],
  },
};

export const DEFAULT_HOMEPAGE_CONFIG = {
  activeTemplate: "template-1",
  content: DEFAULT_HOMEPAGE_SECTION_CONTENT,
};

export const HOMEPAGE_TEMPLATE_OPTIONS = [
  {
    value: "template-1",
    label: "Variation 1 (Default)",
    desc: "Hero Dominant Left + Right Intelligence Rail",
    detail: "Single hero article with featured articles, latest stories sidebar, top stories grid, category sections, the feed with originals sidebar.",
    thumb: "🗞️",
  },
  {
    value: "template-2",
    label: "Variation 2",
    desc: "Split Hero Carousel + Dual Feed System",
    detail: "Full-width rotating hero, category icon nav row, top stories grid, latest news strip, category sections, the feed.",
    thumb: "🎠",
  },
  {
    value: "template-3",
    label: "Variation 3",
    desc: "Magazine Mosaic Grid Layout",
    detail: "No single hero -- mosaic grid (1 large + 2 medium + 3 equal), latest news strip, trending sidebar, category sections, feed.",
    thumb: "📰",
  },
  {
    value: "template-4",
    label: "Variation 4",
    desc: "Editorial Feed + Sticky Intelligence Column",
    detail: "Large stacked story cards left, sticky sidebar right (trending + newsletter + category shortcuts), editor picks mid-feed, category grid.",
    thumb: "📋",
  },
];
