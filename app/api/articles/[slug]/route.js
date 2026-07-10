import { NextResponse } from 'next/server';
import { store } from '../../../../lib/store/memoryStore';

// Public GET /api/articles/[slug]
// Returns one published article by slug, with its author resolved from
// store.authors (or a safe placeholder if no author was set on the
// article -- the admin Articles form doesn't currently collect an author,
// this keeps the public page from ever breaking on that gap).
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const FALLBACK_AUTHOR = {
  name: 'Futurism Staff',
  href: '#',
  role: 'Staff Writer',
  avatar: '/images/author1.webp',
  bio: '',
};

export async function GET(req, { params }) {
  const { slug } = await params;

  const article = store.articles.find((a) => a.slug === slug);
  if (!article) {
    return NextResponse.json(
      { error: 'Not found' },
      { status: 404, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const author =
    store.authors.find((au) => au._id === article.author) || FALLBACK_AUTHOR;

  const category = store.categories.find((c) => c._id === article.categoryId);

  return NextResponse.json(
    { article: { ...article, author, categoryName: category?.name || article.category || '' } },
    { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
  );
}
