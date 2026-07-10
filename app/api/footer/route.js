import { NextResponse } from 'next/server';
import { readStore } from '../../../lib/store/fileStore';
import { DEFAULT_FOOTER_CONFIG } from '../../../lib/footerDefaults';

export async function GET() {
  const config = readStore('footer-config', DEFAULT_FOOTER_CONFIG);
  return NextResponse.json({ config });
}
