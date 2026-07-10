import { NextResponse } from 'next/server';
import { readStore } from '../../../lib/store/fileStore';
import { DEFAULT_HEADER_CONFIG } from '../../../lib/headerDefaults';

export async function GET() {
  const config = readStore('header-config', DEFAULT_HEADER_CONFIG);
  return NextResponse.json({ config });
}
