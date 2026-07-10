import { NextResponse } from 'next/server';
import { store, newId } from '../../../../lib/store/memoryStore';


export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page     = parseInt(searchParams.get('page') || '1');
  const limit    = parseInt(searchParams.get('limit') || '20');
  const status   = searchParams.get('status');
  const category = searchParams.get('category');
  const search   = searchParams.get('search');

  let results = [...store.articles];
  if (status)   results = results.filter(a => a.status === status);
  if (category) results = results.filter(a => (a.category || '').toLowerCase().includes(category.toLowerCase()));
  if (search)   results = results.filter(a => (a.title || '').toLowerCase().includes(search.toLowerCase()));

  results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const total = results.length;
  const paged = results.slice((page - 1) * limit, page * limit).map(a => ({
    ...a,
    author: store.authors.find(au => au._id === a.author) || null,
  }));

  return NextResponse.json({ articles: paged, total, page, pages: Math.ceil(total / limit) || 1 });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const now = new Date().toISOString();
    const article = { _id: newId(), createdAt: now, updatedAt: now, ...body };
    store.articles.push(article);
    return NextResponse.json({ article }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
