// app/search/page.jsx
// Usage: /search?q=robots -- linked from every header template's search
// icon (previously a decorative, non-functional button) and reachable by
// typing a URL directly. Server-renders the initial result set for the
// query in the URL (so a shared/bookmarked search link works and is
// crawlable), then hands off to a client component for live re-searching
// without a full page reload.
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SearchResults from '../../components/SearchResults';
import { API_BASE } from '../../lib/apiConfig';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function searchArticles(q) {
  if (!q?.trim()) return { articles: [], total: 0 };
  try {
    const params = new URLSearchParams({ search: q.trim(), limit: '20' });
    const res = await fetch(`${API_BASE}/api/articles?${params.toString()}`, { cache: 'no-store' });
    if (!res.ok) return { articles: [], total: 0 };
    const d = await res.json();
    return { articles: d.articles || [], total: d.total || 0 };
  } catch {
    return { articles: [], total: 0 };
  }
}

// Next.js 16: `searchParams` is a Promise in Server Components and must be awaited.
export default async function SearchPage({ searchParams }) {
  const { q } = (await searchParams) || {};
  const initialQuery = q || '';
  const { articles, total } = await searchArticles(initialQuery);

  return (
    <>
      <Header />
      <SearchResults initialQuery={initialQuery} initialArticles={articles} initialTotal={total} />
      <Footer />
    </>
  );
}
