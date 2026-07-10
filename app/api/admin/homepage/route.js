import { NextResponse } from 'next/server';
import { store, DEFAULT_HOMEPAGE_CONFIG } from '../../../../lib/store/memoryStore';

export async function GET() {
  if (!store.homepageConfig) store.homepageConfig = { ...DEFAULT_HOMEPAGE_CONFIG };
  return NextResponse.json({ config: store.homepageConfig });
}

export async function PUT(req) {
  try {
    const { sections } = await req.json();
    store.homepageConfig = { ...(store.homepageConfig || DEFAULT_HOMEPAGE_CONFIG), sections };
    return NextResponse.json({ config: store.homepageConfig });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
