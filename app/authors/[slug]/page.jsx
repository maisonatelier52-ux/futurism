// app/authors/[slug]/page.jsx
// Renders whichever layout variation was chosen for this author in
// Admin -> Authors (Variation 1-4). Falls back to Variation 4 (the
// original default layout) if an author hasn't set one. Real category
// names are injected as the category-filter sidebar options (Variation 1)
// so filtering actually matches real categories instead of placeholder guesses.

import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import AuthorPageResolver from '../../../components/AuthorPageResolver';
import { API_BASE } from '../../../lib/apiConfig';
import { serverFetch } from '../../../lib/serverFetch';

// Always render fresh -- never statically cache this page -- so a newly
// saved author profile shows up immediately.
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 30;

async function getAuthorData(slug, page, category) {
  try {
    const params = new URLSearchParams({ page: String(page) });
    if (category) params.set('category', category);
    const res = await serverFetch(`${API_BASE}/api/authors/${encodeURIComponent(slug)}?${params.toString()}`, { timeoutMs: 5000 });
    if (!res.ok) return { author: null, articles: [], pagination: { currentPage: 1, totalPages: 1 } };
    const d = await res.json();
    return {
      author: d?.author || null,
      articles: d?.articles || [],
      pagination: d?.pagination || { currentPage: 1, totalPages: 1 },
    };
  } catch {
    return { author: null, articles: [], pagination: { currentPage: 1, totalPages: 1 } };
  }
}

async function getCategoryNames() {
  try {
    const res = await serverFetch(`${API_BASE}/api/categories`, { timeoutMs: 4000 });
    if (!res.ok) return [];
    const d = await res.json();
    return (d.categories || []).map((c) => c.name);
  } catch {
    return [];
  }
}

// Next.js 16: `params`/`searchParams` are Promises in Server Components and must be awaited.
// Data loading lives in AuthorContent so <Header/>, <AuthorContent/> and
// <Footer/> are sibling async components that render IN PARALLEL.
async function AuthorContent({ params, searchParams }) {
  const { slug } = await params;
  const { page: pageParam, category } = (await searchParams) || {};
  const page = Math.max(1, parseInt(pageParam || '1', 10) || 1);

  const [{ author, articles, pagination }, categoryNames] = await Promise.all([
    getAuthorData(slug, page, category),
    getCategoryNames(),
  ]);

  const authorWithFilters = author && !author.categoryFilters?.length && categoryNames.length
    ? { ...author, categoryFilters: ['All Articles', ...categoryNames] }
    : author;

  return <AuthorPageResolver author={authorWithFilters} articles={articles} pagination={pagination} />;
}

export default function AuthorPage({ params, searchParams }) {
  return (
    <>
      <Header />
      <AuthorContent params={params} searchParams={searchParams} />
      <Footer />
    </>
  );
}
