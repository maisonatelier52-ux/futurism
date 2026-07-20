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

/**
 * @param {object} query { mode: "auto"|"pinned", category: string, limit: number, pinnedIds: string[] }
 * @param {string} apiBase e.g. API_BASE from lib/apiConfig.js
 * @param {object} [fetchOptions] passed through to fetch() -- e.g. { cache: "no-store" }
 * @returns {Promise<Array>} array of article cards: { id, category, title, author, image, href, date }
 */
export async function resolveArticleQuery(query, apiBase, fetchOptions = {}) {
  if (!query) return [];

  try {
    let url;
    if (query.mode === "pinned" && query.pinnedIds?.length) {
      url = `${apiBase}/api/articles?ids=${query.pinnedIds.join(",")}`;
    } else {
      const params = new URLSearchParams({ limit: String(query.limit || 5) });
      if (query.category) params.set("categorySlug", query.category);
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
  const [heroResults, secondary, latest, topStories, feed, categoriesRes, ...sectionResults] = await Promise.all([
    resolveArticleQuery(content.heroQuery, apiBase, fetchOptions),
    resolveArticleQuery(content.secondaryQuery, apiBase, fetchOptions),
    resolveArticleQuery(content.latestQuery, apiBase, fetchOptions),
    resolveArticleQuery(content.topStoriesQuery, apiBase, fetchOptions),
    resolveArticleQuery(content.feedQuery, apiBase, fetchOptions),
    fetch(`${apiBase}/api/categories`, { cache: "no-store", ...fetchOptions }).then((r) => (r.ok ? r.json() : { categories: [] })).catch(() => ({ categories: [] })),
    ...(content.categorySections || []).map((s) => resolveArticleQuery(s.query, apiBase, fetchOptions)),
  ]);

  const hero = heroResults[0] || FALLBACK_HERO;

  const categorySections = (content.categorySections || []).map((s, i) => ({
    id: s.id,
    title: s.title,
    articles: sectionResults[i] || [],
  }));

  return {
    hero,
    secondary,
    latest,
    topStories,
    categorySections,
    feed,
    categories: categoriesRes?.categories || [],
    newsletter: content.newsletter,
    originals: content.originals,
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

  const [featuredResults, latest] = await Promise.all([
    resolveArticleQuery(scopedQuery(content.featuredQuery), apiBase, fetchOptions),
    resolveArticleQuery(scopedQuery(content.latestQuery), apiBase, fetchOptions),
  ]);

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
    deepDive: content.deepDive,
    newsletter: content.newsletter,
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
