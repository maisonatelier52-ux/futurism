// lib/resolveArticleQuery.js
//
// Turns a section's query config ({ mode, category, limit, pinnedIds })
// into real article cards from the backend. Used by:
//  - app/page.jsx (server-side, builds the live homepage)
//  - app/category/[slug]/page.jsx (server-side, builds the live category page)
//  - app/articles/[slug]/page.jsx (server-side, builds "related" sidebar content)
//  - components/homepage-builder/HomepageBuilder.jsx (client-side, live preview)
//  - components/category-page-builder/CategoryPageBuilder.jsx (client-side, live preview)
//
// Builders and live pages call the exact same functions so a builder's
// preview always shows what the live site will actually show for a given query.

const FALLBACK_HERO = {
  category: "FUTURISM",
  title: "Welcome to Futurism — publish your first article to see it here",
  excerpt: "",
  author: "",
  image: "/images/img1.webp",
  href: "#",
};

// Safe fallbacks for manually-edited (non-query) fields, used whenever a
// saved config is missing a field entirely -- e.g. it was saved before
// that field existed, or the builder saved a partial object. Without
// these, a template reading `newsletter.title` on `undefined` crashes the
// whole page instead of just showing sensible default copy.
const FALLBACK_NEWSLETTER = {
  title: "Sign up to see the future, today",
  description: "Can't-miss innovations from the bleeding edge of science and tech",
  buttonLabel: "Sign Up",
};

const FALLBACK_DEEP_DIVE = {
  title: "Deep Dive",
  description: "In-depth analysis and expert insights on the biggest stories.",
  items: [],
};

const FALLBACK_ORIGINALS = {
  sectionTitle: "Futurism Originals",
  featuredImage: "/images/img8.webp",
  items: [],
};

/**
 * @param {object} query { mode: "auto"|"pinned", category: string, limit: number, pinnedIds: string[] }
 * @param {string} apiBase e.g. API_BASE from lib/apiConfig.js
 * @param {object} [fetchOptions] passed through to fetch() -- e.g. { cache: "no-store" }
 * @returns {Promise<Array>} array of article cards: { id, category, title, author, image, href, date }
 */
export async function resolveArticleQuery(query, apiBase, fetchOptions = {}, excludeIds = []) {
  if (!query) return [];

  try {
    let url;
    if (query.mode === "pinned" && query.pinnedIds?.length) {
      url = `${apiBase}/api/articles?ids=${query.pinnedIds.join(",")}`;
    } else {
      const params = new URLSearchParams({ limit: String(query.limit || 5) });
      if (query.category) params.set("categorySlug", query.category);
      if (excludeIds.length) params.set("excludeIds", excludeIds.join(","));
      url = `${apiBase}/api/articles?${params.toString()}`;
    }

    const res = await fetch(url, { cache: "no-store", ...fetchOptions });
    if (!res.ok) return [];
    const d = await res.json();
    return d.articles || [];
  } catch {
    return [];
  }
}

/**
 * Resolves every query in a homepage "content" object in parallel and
 * returns a fully-expanded content tree in the exact shape
 * HomepageTemplate1-4.jsx already expect (hero, secondary, latest,
 * topStories, categorySections[].articles, feed) -- so the templates
 * themselves never need to know queries exist.
 */
export async function resolveHomepageContent(content, apiBase, fetchOptions = {}) {
  // Sections are resolved in priority order (Hero first, Feed last), each
  // excluding articles already picked by an earlier section. Without this,
  // with only a handful of real articles published, "auto: newest N" in
  // every section independently picks the same recent article(s), so one
  // new article appears repeated across Hero, Secondary, Latest, Top
  // Stories, etc. all at once. Pinned sections are untouched by this --
  // an admin explicitly chose those, so they always show regardless of
  // what auto sections picked elsewhere on the page.
  const usedIds = [];

  function trackUsed(articles) {
    for (const a of articles) {
      if (a?.id) usedIds.push(String(a.id));
    }
    return articles;
  }

  const categoriesRes = await fetch(`${apiBase}/api/categories`, { cache: "no-store", ...fetchOptions })
    .then((r) => (r.ok ? r.json() : { categories: [] }))
    .catch(() => ({ categories: [] }));

  const heroResults = trackUsed(await resolveArticleQuery(content.heroQuery, apiBase, fetchOptions, usedIds));
  const hero = heroResults[0] || FALLBACK_HERO;

  const secondary = trackUsed(await resolveArticleQuery(content.secondaryQuery, apiBase, fetchOptions, usedIds));
  const latest = trackUsed(await resolveArticleQuery(content.latestQuery, apiBase, fetchOptions, usedIds));
  const topStories = trackUsed(await resolveArticleQuery(content.topStoriesQuery, apiBase, fetchOptions, usedIds));

  const categorySections = [];
  for (const s of content.categorySections || []) {
    const articles = trackUsed(await resolveArticleQuery(s.query, apiBase, fetchOptions, usedIds));
    categorySections.push({ id: s.id, title: s.title, articles });
  }

  const feed = trackUsed(await resolveArticleQuery(content.feedQuery, apiBase, fetchOptions, usedIds));

  return {
    hero,
    secondary,
    latest,
    topStories,
    categorySections,
    feed,
    categories: categoriesRes?.categories || [],
    newsletter: content.newsletter || FALLBACK_NEWSLETTER,
    originals: content.originals || FALLBACK_ORIGINALS,
  };
}

/**
 * Resolves a category page's query configs (featuredQuery, latestQuery,
 * articlesQuery) into real, category-scoped article data, in the exact
 * shape CategoryTemplate1-4.jsx already expect: hero, tabs, featured,
 * latest, articles, deepDive, newsletter, pagination.
 *
 * @param {object} content the category page's stored content (query configs + manual fields)
 * @param {object} category the real category doc { name, slug, description }
 * @param {string} apiBase
 * @param {number} [page] which page of the main `articles` grid to fetch (1-based)
 * @param {object} [fetchOptions]
 */
export async function resolveCategoryPageContent(content, category, apiBase, page = 1, fetchOptions = {}) {
  const categorySlug = category?.slug || "";

  const scopedQuery = (q) => ({ ...(q || {}), category: categorySlug });

  // Featured resolves first so Latest can exclude it -- avoids the same
  // story showing as both the "top story" and the first item in the
  // "Latest in [category]" rail right next to it.
  const featuredResults = await resolveArticleQuery(scopedQuery(content.featuredQuery), apiBase, fetchOptions);
  const featuredIds = featuredResults.map((a) => String(a.id)).filter(Boolean);
  const latest = await resolveArticleQuery(scopedQuery(content.latestQuery), apiBase, fetchOptions, featuredIds);

  const articlesLimit = content.articlesQuery?.limit || 12;
  let articles = [];
  let pagination = { currentPage: 1, totalPages: 1 };

  if (content.articlesQuery?.mode === "pinned" && content.articlesQuery.pinnedIds?.length) {
    articles = await resolveArticleQuery(content.articlesQuery, apiBase, fetchOptions);
  } else {
    try {
      const params = new URLSearchParams({
        limit: String(articlesLimit),
        page: String(page),
        categorySlug,
      });
      const res = await fetch(`${apiBase}/api/articles?${params.toString()}`, { cache: "no-store", ...fetchOptions });
      if (res.ok) {
        const d = await res.json();
        articles = d.articles || [];
        pagination = { currentPage: d.page || 1, totalPages: d.pages || 1 };
      }
    } catch {
      articles = [];
    }
  }

  return {
    hero: {
      title: content.hero?.title || category?.name || "",
      description: content.hero?.description || category?.description || "",
    },
    tabs: content.tabs || { subcategories: [], extraCount: 0 },
    featured: featuredResults[0] || FALLBACK_HERO,
    latest,
    articles,
    deepDive: content.deepDive || FALLBACK_DEEP_DIVE,
    newsletter: content.newsletter || FALLBACK_NEWSLETTER,
    pagination,
  };
}

/**
 * Resolves an article page's "related content" sections (Most Popular,
 * Around the Web equivalent, More in Category) from real data:
 *  - mostPopular: sitewide newest articles (excluding the current one)
 *  - moreInCategory: newest articles in the same category (excluding the current one)
 * "Around the Web" stays a placeholder since it's third-party content, not
 * something Admin -> Articles produces.
 *
 * @param {object} article the normalized current article (needs id, categorySlug)
 * @param {string} apiBase
 * @param {object} [fetchOptions]
 */
export async function resolveArticleRelated(article, apiBase, fetchOptions = {}) {
  const [mostPopular, moreInCategory] = await Promise.all([
    resolveArticleQuery({ mode: "auto", limit: 5 }, apiBase, fetchOptions).then((list) =>
      list.filter((a) => String(a.id) !== String(article.id))
    ),
    article.categorySlug
      ? resolveArticleQuery({ mode: "auto", limit: 8, category: article.categorySlug }, apiBase, fetchOptions).then(
          (list) => list.filter((a) => String(a.id) !== String(article.id))
        )
      : Promise.resolve([]),
  ]);

  return {
    mostPopular,
    aroundTheWeb: [],
    moreInCategory,
  };
}
