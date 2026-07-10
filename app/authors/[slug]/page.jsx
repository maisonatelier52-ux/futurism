// app/authors/[slug]/page.jsx
// Renders whichever layout variation was chosen for this author in
// Admin -> Authors (Variation 1-4). Falls back to Variation 4 (the
// original default layout) if an author hasn't set one.

import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import AuthorPageResolver from '../../../components/AuthorPageResolver';
import { API_BASE } from '../../../lib/apiConfig';

// Always render fresh -- never statically cache this page -- so a newly
// saved author profile shows up immediately.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getAuthorData(slug) {
  try {
    const res = await fetch(`${API_BASE}/api/authors/${encodeURIComponent(slug)}`, { cache: 'no-store' });
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

// Next.js 16: `params` is a Promise in Server Components and must be awaited.
export default async function AuthorPage({ params }) {
  const { slug } = await params;
  const { author, articles, pagination } = await getAuthorData(slug);

  return (
    <>
      <Header />
      <AuthorPageResolver author={author} articles={articles} pagination={pagination} />
      <Footer />
    </>
  );
}
