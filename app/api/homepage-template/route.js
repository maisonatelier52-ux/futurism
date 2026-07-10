import { NextResponse } from 'next/server';
import { readStore } from '../../../lib/store/fileStore';
import { DEFAULT_HOMEPAGE_CONFIG } from '../../../lib/homepageDefaults';

// Never cache this route -- the config is written to disk by a separate
// admin route handler, so Next's dev/prod route cache has no visibility
// into that change without these directives.
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET() {
  const config = readStore('homepage-config', DEFAULT_HOMEPAGE_CONFIG);
  return NextResponse.json(config, {
    headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
  });
}
