// app/category/[slug]/page.jsx
// Usage: /category/health-medicine, /category/artificial-intelligence, etc.
// Renders whichever template was chosen for this category slug in
// Admin -> Categories -> Page Builder, with real, newest-first articles
// from that category auto-populated into every article section.

import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import CategoryPageResolver from '../../../components/CategoryPageResolver';
import { API_BASE } from '../../../lib/apiConfig';
import { withConfigDefaults } from '../../../lib/categoryPageDefaults';
import { resolveCategoryPageContent } from '../../../lib/resolveArticleQuery';

// Always render fresh -- never statically cache this page -- so a save in
// Category Page Builder or a newly published article shows up immediately.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getCategoryPageConfig(slug) {
  try {
    const res = await fetch(`${API_BASE}/api/category-page-template?slug=${encodeURIComponent(slug)}`, {
      cache: 'no-store',
    });
    if (!res.ok) return withConfigDefaults(null);
    const d = await res.json();
    // withConfigDefaults fills in any section the backend didn't send
    // (including a category that's never been configured at all, or one
    // saved before a newer section like `deepDive` existed) -- a shallow
    // `d.config || DEFAULT` only caught a fully-missing config, not a
    // partial one, which crashed on the first missing field.
    return withConfigDefaults(d.config);
  } catch {
    return withConfigDefaults(null);
  }
}

async function getCategory(slug) {
  try {
    const res = await fetch(`${API_BASE}/api/categories/${encodeURIComponent(slug)}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const d = await res.json();
    return d.category || null;
  } catch {
    return null;
  }
}

// Next.js 16: `params`/`searchParams` are Promises in Server Components and must be awaited.
export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;
  const { page: pageParam } = (await searchParams) || {};
  const page = Math.max(1, parseInt(pageParam || '1', 10) || 1);

  const [config, category] = await Promise.all([
    getCategoryPageConfig(slug),
    getCategory(slug),
  ]);

  // config.content is already fully shaped by getCategoryPageConfig above.
  const resolvedContent = await resolveCategoryPageContent(config.content, category, API_BASE, page);

  return (
    <>
      <Header />
      <CategoryPageResolver config={{ activeTemplate: config.activeTemplate, content: resolvedContent }} />
      <Footer />
    </>
  );
}
