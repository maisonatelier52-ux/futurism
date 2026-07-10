import { NextResponse } from 'next/server';
import { store } from '../../../../../lib/store/memoryStore';

export async function GET(req, { params }) {
  const article = store.articles.find(a => a._id === params.id);
  if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const author = store.authors.find(au => au._id === article.author) || null;
  return NextResponse.json({ article: { ...article, author } });
}

export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const idx = store.articles.findIndex(a => a._id === params.id);
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    store.articles[idx] = { ...store.articles[idx], ...body, updatedAt: new Date().toISOString() };
    return NextResponse.json({ article: store.articles[idx] });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  store.articles = store.articles.filter(a => a._id !== params.id);
  return NextResponse.json({ success: true });
}
