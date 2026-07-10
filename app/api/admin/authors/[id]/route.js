import { NextResponse } from 'next/server';
import { store } from '../../../../../lib/store/memoryStore';

// Next.js 16: `params` is a Promise in Route Handlers and must be awaited.
export async function GET(req, { params }) {
  const { id } = await params;
  const author = store.authors.find(a => a._id === id);
  if (!author) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ author });
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const idx = store.authors.findIndex(a => a._id === id);
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    store.authors[idx] = { ...store.authors[idx], ...body, updatedAt: new Date().toISOString() };
    return NextResponse.json({ author: store.authors[idx] });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  store.authors = store.authors.filter(a => a._id !== id);
  return NextResponse.json({ success: true });
}
