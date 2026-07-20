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

// Always render fresh -- never statically cache this page -- so a newly
// saved author profile shows up immediately.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getAuthorData(slug, page, category) {
  try {
    const params = new URLSearchParams({ page: String(page) });
    if (category) params.set('category', category);
    const res = await fetch(`${API_BASE}/api/authors/${encodeURIComponent(slug)}?${params.toString()}`, { cache: 'no-store' });
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
    const res = await fetch(`${API_BASE}/api/categories`, { cache: 'no-store' });
    if (!res.ok) return [];
    const d = await res.json();
    return (d.categories || []).map((c) => c.name);
  } catch {
    return [];
  }
}

// Next.js 16: `params`/`searchParams` are Promises in Server Components and must be awaited.
export default async function AuthorPage({ params, searchParams }) {
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

  return (
    <>
      <Header />
      <AuthorPageResolver author={authorWithFilters} articles={articles} pagination={pagination} />
      <Footer />
    </>
  );
}
