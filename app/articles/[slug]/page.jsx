// app/articles/[slug]/page.jsx
// Renders whichever layout variation was chosen for this article in
// Admin -> Articles (Variation 1-4). Falls back to Variation 4 (the
// original default layout) if an article hasn't set one.

import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import ArticlePageResolver, { normalizeArticle } from '../../../components/ArticlePageResolver';
import { API_BASE } from '../../../lib/apiConfig';

// Always render fresh -- never statically cache this page -- so a newly
// published/edited article shows up immediately.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getArticle(slug) {
  try {
    const res = await fetch(`${API_BASE}/api/articles/${encodeURIComponent(slug)}`, { cache: 'no-store' });
    if (!res.ok) return null; // includes 404 -- treated as "not found" below
    const d = await res.json();
    return d?.article ? normalizeArticle(d.article) : null;
  } catch {
    return null;
  }
}

// Next.js 16: `params` is a Promise in Server Components and must be awaited.
export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = await getArticle(slug);

  return (
    <>
      <Header />
      <ArticlePageResolver article={article} />
      <Footer />
    </>
  );
}
