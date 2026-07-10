import { NextResponse } from 'next/server';
import { store, DEFAULT_SITE_SETTINGS } from '../../../../lib/store/memoryStore';

export async function GET() {
  if (!store.siteSettings) store.siteSettings = { ...DEFAULT_SITE_SETTINGS };
  return NextResponse.json({ settings: store.siteSettings });
}

export async function PUT(req) {
  try {
    const body = await req.json();
    store.siteSettings = { ...(store.siteSettings || DEFAULT_SITE_SETTINGS), ...body };
    return NextResponse.json({ settings: store.siteSettings });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
