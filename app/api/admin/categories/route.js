import { NextResponse } from 'next/server';
import { store, newId } from '../../../../lib/store/memoryStore';

export async function GET() {
  const categories = [...store.categories].sort(
    (a, b) => (a.order ?? a.position ?? 99) - (b.order ?? b.position ?? 99) || (a.name || '').localeCompare(b.name || '')
  );
  return NextResponse.json({ categories });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const now = new Date().toISOString();
    const category = { _id: newId(), createdAt: now, updatedAt: now, ...body };
    store.categories.push(category);
    return NextResponse.json({ category }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
