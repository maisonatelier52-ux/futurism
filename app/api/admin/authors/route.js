import { NextResponse } from 'next/server';
import { store, newId } from '../../../../lib/store/memoryStore';

export async function GET() {
  const authors = [...store.authors]
    .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    .map(a => ({
      ...a,
      articleCount: store.articles.filter(art => art.author === a._id).length,
    }));
  return NextResponse.json({ authors });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const now = new Date().toISOString();
    const author = { _id: newId(), createdAt: now, updatedAt: now, ...body };
    store.authors.push(author);
    return NextResponse.json({ author }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
