import { NextResponse } from 'next/server';
import { readStore } from '../../../lib/store/fileStore';
import { DEFAULT_CATEGORY_PAGE_CONFIG } from '../../../lib/categoryPageDefaults';

// Force this route to always execute fresh on every request and never be
// cached by Next.js (dev Turbopack cache or prod route cache). The config
// is written to disk by a separate route handler (admin PUT), so Next has
// no way to know the data changed -- without this, a save can appear to
// "not show up" on the public page until an unrelated source file change
// invalidates the cache.
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug') || '';

  const all = readStore('category-page-config', {});
  const config = all[slug] || DEFAULT_CATEGORY_PAGE_CONFIG;

  return NextResponse.json(
    { config },
    { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
  );
}
