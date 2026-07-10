import { NextResponse } from 'next/server';
import { readStore, writeStore } from '../../../../lib/store/fileStore';
import { DEFAULT_HEADER_CONFIG } from '../../../../lib/headerDefaults';

export async function GET() {
  const config = readStore('header-config', DEFAULT_HEADER_CONFIG);
  return NextResponse.json({ config });
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const current = readStore('header-config', DEFAULT_HEADER_CONFIG);
    const updated = { ...current, ...body };
    writeStore('header-config', updated);
    return NextResponse.json({ config: updated });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
