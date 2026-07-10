import { NextResponse } from 'next/server';
import { readStore, writeStore } from '../../../../lib/store/fileStore';
import { DEFAULT_HOMEPAGE_CONFIG } from '../../../../lib/homepageDefaults';

// Never cache this route -- see app/api/homepage-template/route.js for why.
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const NO_STORE_HEADERS = { 'Cache-Control': 'no-store, no-cache, must-revalidate' };

export async function GET() {
  const config = readStore('homepage-config', DEFAULT_HOMEPAGE_CONFIG);
  return NextResponse.json({ config }, { headers: NO_STORE_HEADERS });
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const current = readStore('homepage-config', DEFAULT_HOMEPAGE_CONFIG);
    const updated = { ...current, ...body };
    writeStore('homepage-config', updated);
    return NextResponse.json({ config: updated }, { headers: NO_STORE_HEADERS });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400, headers: NO_STORE_HEADERS });
  }
}
