// lib/categoryPageDefaults.js
//
// The Category Page Builder no longer stores hand-typed article arrays.
// Every article-driven section (featured, latest, articles grid) now
// auto-queries real, newest-first articles that belong to this category
// slug -- no per-section category picker needed, since a category page is
// already scoped to one category by its URL. "Deep Dive" stays a small
// manual/curatorial list (like Homepage's Originals), since it's meant to
// be hand-picked highlights rather than "latest N".
//
// The resolver (components/CategoryPageResolver.jsx is now just a template
// picker; the actual query resolution happens in app/category/[slug]/page.jsx)
// expands each query into real article data shaped exactly like the old
// manual arrays, so CategoryTemplate1-4.jsx keep working unchanged.

export function defaultQuery(overrides = {}) {
  return {
    mode: "auto", // "auto" | "pinned"
    limit: 4,
    pinnedIds: [],
    ...overrides,
  };
}

export const DEFAULT_CATEGORY_SECTION_CONTENT = {
  // Manual: category hero title/description. Defaults to the real
  // category's name/description if left blank (see resolver).
  hero: {
    title: "",
    description: "",
  },
  tabs: {
    subcategories: [],
    extraCount: 0,
  },

  // Single "top story" -- auto-picks this category's most recent article
  // unless a specific one is pinned.
  featuredQuery: defaultQuery({ limit: 1 }),

  // Small "Latest in [category]" rail.
  latestQuery: defaultQuery({ limit: 4 }),

  // Main paginated articles grid.
  articlesQuery: defaultQuery({ limit: 12 }),

  // Deep Dive -- curatorial, manual, unchanged.
  deepDive: {
    title: "Deep Dive",
    description: "In-depth analysis and expert insights on the biggest stories.",
    items: [],
  },

  newsletter: {
    title: "Sign up to see the future, today",
    description: "Can't-miss innovations from the bleeding edge of science and tech",
    buttonLabel: "Sign Up",
  },
};

// One entry per category slug lives in the store under this default,
// keyed by slug — e.g. { "health-medicine": { activeTemplate, content } }
export const DEFAULT_CATEGORY_PAGE_CONFIG = {
  activeTemplate: "template-4", // template-4 = the original/default layout
  content: DEFAULT_CATEGORY_SECTION_CONTENT,
};

// Fills in any missing/partial section of a saved (or never-saved) content
// object with the same defaults a brand-new category starts with. The
// backend stores `content` as a schema-less Mixed field on purpose (see
// models/CategoryPageConfig.js), so a saved document can be missing fields
// that were added to DEFAULT_CATEGORY_SECTION_CONTENT after it was first
// created, or can be entirely absent for a category that's never been
// configured. Every place that reads content.<section>.<field> (the admin
// Category Page Builder, and the public /category/[slug] page) should run
// the raw API response through this before touching any field on it.
export function withContentDefaults(rawContent) {
  const src = rawContent || {};
  const merged = {};
  for (const key of Object.keys(DEFAULT_CATEGORY_SECTION_CONTENT)) {
    const def = DEFAULT_CATEGORY_SECTION_CONTENT[key];
    const val = src[key];
    if (Array.isArray(def)) {
      merged[key] = Array.isArray(val) ? val : def;
    } else if (def && typeof def === "object") {
      merged[key] = { ...def, ...(val && typeof val === "object" ? val : {}) };
    } else {
      merged[key] = val !== undefined ? val : def;
    }
  }
  return merged;
}

export function withConfigDefaults(rawConfig) {
  return {
    activeTemplate: rawConfig?.activeTemplate || DEFAULT_CATEGORY_PAGE_CONFIG.activeTemplate,
    content: withContentDefaults(rawConfig?.content),
  };
}

export const CATEGORY_TEMPLATE_OPTIONS = [
  {
    value: "template-1",
    label: "Variation 1",
    desc: "Split hero + intelligence rail",
    detail: "Purple hero banner with subcategory pill tabs, right-hand 'Latest' rail, trending strip, deep dive row, newsletter banner.",
    thumb: "🗞️",
  },
  {
    value: "template-2",
    label: "Variation 2",
    desc: "Sidebar latest + all stories grid",
    detail: "Left 'Latest in category' rail, top story spotlight, paginated all-stories grid, dark signup footer block.",
    thumb: "📑",
  },
  {
    value: "template-3",
    label: "Variation 3",
    desc: "Stacked hero + latest rail grid",
    detail: "Large stacked hero article, right-hand latest rail, paginated articles grid below, dark signup footer block.",
    thumb: "📰",
  },
  {
    value: "template-4",
    label: "Variation 4 (Default)",
    desc: "Centered title + full grid",
    detail: "Centered category title & description, subcategory tabs, full-width 'Latest' articles grid, pagination, newsletter banner.",
    thumb: "📋",
  },
];
