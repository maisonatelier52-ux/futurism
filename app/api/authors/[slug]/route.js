import { NextResponse } from 'next/server';
import { store } from '../../../../lib/store/memoryStore';

// Public GET /api/authors/[slug]?page=1&category=Ethics
// Returns one author by slug, plus their published articles (paginated,
// optionally filtered by category name -- used by Variation 1's sidebar).
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const PAGE_SIZE = 16;

export async function GET(req, { params }) {
  const { slug } = await params;
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
  const categoryFilter = searchParams.get('category') || '';

  const author = store.authors.find((a) => a.slug === slug);
  if (!author) {
    return NextResponse.json(
      { error: 'Not found' },
      { status: 404, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  let byAuthor = store.articles.filter(
    (a) => a.author === author._id && (a.isPublished ?? true)
  );

  if (categoryFilter && categoryFilter !== 'All Articles') {
    byAuthor = byAuthor.filter((a) => {
      const cat = store.categories.find((c) => c._id === a.categoryId);
      return (cat?.name || '').toLowerCase() === categoryFilter.toLowerCase();
    });
  }

  byAuthor.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));

  const total = byAuthor.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const paged = byAuthor.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((a) => {
    const cat = store.categories.find((c) => c._id === a.categoryId);
    return {
      id: a._id,
      category: (cat?.name || a.category || '').toUpperCase(),
      title: a.title,
      image: a.mainImage || '',
      href: `/articles/${a.slug}`,
    };
  });

  return NextResponse.json(
    {
      author,
      articles: paged,
      pagination: { currentPage: page, totalPages: pages },
    },
    { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
  );
}
