import { NextResponse } from 'next/server';
import { readStore, writeStore } from '../../../../lib/store/fileStore';
import { DEFAULT_CATEGORY_PAGE_CONFIG } from '../../../../lib/categoryPageDefaults';

const STORE_KEY = 'category-page-config';

// Never cache this route -- it reads/writes a JSON file on disk that Next's
// dev/prod route cache has no visibility into, so without this a save can
// appear "not to show up" until something else invalidates the cache.
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const NO_STORE_HEADERS = { 'Cache-Control': 'no-store, no-cache, must-revalidate' };

// GET /api/admin/category-page-template?slug=health-medicine
// Returns the saved config for one category slug (or the default shape).
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug') || '';

  const all = readStore(STORE_KEY, {});
  const config = all[slug] || DEFAULT_CATEGORY_PAGE_CONFIG;

  return NextResponse.json({ config }, { headers: NO_STORE_HEADERS });
}

// PUT /api/admin/category-page-template
// Body: { slug: "health-medicine", config: { activeTemplate, content } }
export async function PUT(req) {
  try {
    const body = await req.json();
    const { slug, config } = body || {};
    if (!slug) {
      return NextResponse.json({ error: 'slug is required' }, { status: 400, headers: NO_STORE_HEADERS });
    }

    const all = readStore(STORE_KEY, {});
    const current = all[slug] || DEFAULT_CATEGORY_PAGE_CONFIG;
    const updated = {
      ...current,
      ...config,
      content: { ...current.content, ...(config?.content || {}) },
    };

    const next = { ...all, [slug]: updated };
    writeStore(STORE_KEY, next);

    return NextResponse.json({ config: updated }, { headers: NO_STORE_HEADERS });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400, headers: NO_STORE_HEADERS });
  }
}
