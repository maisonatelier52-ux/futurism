// app/category/[slug]/page.jsx
// Usage: /category/health-medicine, /category/artificial-intelligence, etc.
// Renders whichever template + content was chosen for this category slug
// in Admin -> Categories -> Page Builder. Falls back to the original default
// layout/content automatically if nothing has been saved yet.

import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import CategoryPageResolver from '../../../components/CategoryPageResolver';
import { API_BASE } from '../../../lib/apiConfig';
import { DEFAULT_CATEGORY_PAGE_CONFIG } from '../../../lib/categoryPageDefaults';

// Always render fresh -- never statically cache this page -- so a save in
// Category Page Builder shows up immediately on the next page load.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getCategoryPageConfig(slug) {
  try {
    const res = await fetch(`${API_BASE}/api/category-page-template?slug=${encodeURIComponent(slug)}`, {
      cache: 'no-store',
    });
    if (!res.ok) return DEFAULT_CATEGORY_PAGE_CONFIG;
    const d = await res.json();
    return d.config || DEFAULT_CATEGORY_PAGE_CONFIG;
  } catch {
    return DEFAULT_CATEGORY_PAGE_CONFIG;
  }
}

// Next.js 16: `params` is a Promise in Server Components and must be awaited.
export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const config = await getCategoryPageConfig(slug);

  return (
    <>
      <Header />
      <CategoryPageResolver config={config} />
      <Footer />
    </>
  );
}
