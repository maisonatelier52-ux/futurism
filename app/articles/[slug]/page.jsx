// app/articles/[slug]/page.jsx
// Renders whichever layout variation was chosen for this article in
// Admin -> Articles (Variation 1-4). Falls back to Variation 4 (the
// original default layout) if an article hasn't set one. "Most Popular"
// and "More in Category" sidebar/grid sections now show real, newest-first
// articles instead of placeholder content.

import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import ArticlePageResolver, { normalizeArticle } from '../../../components/ArticlePageResolver';
import { API_BASE } from '../../../lib/apiConfig';
import { serverFetch } from '../../../lib/serverFetch';
import { resolveArticleRelated } from '../../../lib/resolveArticleQuery';

// Always render fresh -- never statically cache this page -- so a newly
// published/edited article shows up immediately.
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 30;

async function getArticle(slug) {
  try {
    const res = await serverFetch(`${API_BASE}/api/articles/${encodeURIComponent(slug)}`, { timeoutMs: 5000 });
    if (!res.ok) return null; // includes 404 -- treated as "not found" below
    const d = await res.json();
    return d?.article ? normalizeArticle(d.article) : null;
  } catch {
    return null;
  }
}

// Next.js 16: `params` is a Promise in Server Components and must be awaited.
// Data loading lives in ArticleContent so <Header/>, <ArticleContent/> and
// <Footer/> are sibling async components that render IN PARALLEL -- their
// backend waits overlap instead of stacking one after another.
async function ArticleContent({ params }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  const related = article
    ? await resolveArticleRelated(article, API_BASE)
    : { mostPopular: [], aroundTheWeb: [], moreInCategory: [] };

  return <ArticlePageResolver article={article} related={related} />;
}

export default function ArticlePage({ params }) {
  return (
    <>
      <Header />
      <ArticleContent params={params} />
      <Footer />
    </>
  );
}
