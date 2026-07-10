import { NextResponse } from 'next/server';
import { readStore, writeStore } from '../../../../lib/store/fileStore';
import { DEFAULT_FOOTER_CONFIG } from '../../../../lib/footerDefaults';

export async function GET() {
  const config = readStore('footer-config', DEFAULT_FOOTER_CONFIG);
  return NextResponse.json({ config });
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const current = readStore('footer-config', DEFAULT_FOOTER_CONFIG);
    const updated = { ...current, ...body };
    writeStore('footer-config', updated);
    return NextResponse.json({ config: updated });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
