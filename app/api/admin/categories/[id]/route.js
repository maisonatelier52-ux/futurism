import { NextResponse } from 'next/server';
import { store } from '../../../../../lib/store/memoryStore';

export async function GET(req, { params }) {
  const category = store.categories.find(c => c._id === params.id);
  if (!category) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ category });
}

export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const idx = store.categories.findIndex(c => c._id === params.id);
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    store.categories[idx] = { ...store.categories[idx], ...body, updatedAt: new Date().toISOString() };
    return NextResponse.json({ category: store.categories[idx] });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  store.categories = store.categories.filter(c => c._id !== params.id);
  return NextResponse.json({ success: true });
}
