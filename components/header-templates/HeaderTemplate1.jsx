'use client';
// Template 1: Original Futurism — logo left, 2-row nav, social icons right
import { useState } from 'react';
import SocialIcons from './SocialIcons';
import { DEFAULT_HEADER_CONFIG } from '@/lib/headerDefaults';

export default function HeaderTemplate1({ config }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const c = config || DEFAULT_HEADER_CONFIG;
  const allLinks = [...(c.mainLinks || []), ...(c.secondaryLinks || [])];

  return (
    <header className="border-b border-gray-200 z-40" style={{ backgroundColor: c.bgColor }}>

      {/* ── Desktop ─────────────────────────────────────── */}
      <div className="hidden md:block max-w-7xl mx-auto px-12 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0 mt-3">
            <img src={c.logo} alt="Futurism" className="h-16 w-auto" />
          </div>
          <nav className="flex items-center gap-5 text-sm tracking-wider font-[family-name:var(--font-scale)]">
            {(c.mainLinks || []).map((link, i) => (
              <a key={i} href={link.href || '#'} className="uppercase whitespace-nowrap hover:opacity-70 flex items-center gap-0.5 transition-opacity" style={{ color: c.textColor }}>
                {link.name}<span className="text-[10px] opacity-40 mt-0.5">▼</span>
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-4 flex-shrink-0">
            <button className="p-2 hover:opacity-70" style={{ color: c.textColor }}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 01-14 0 7 7 0 0114 0z"/></svg>
            </button>
            <div className="pl-3 border-l border-gray-300">
              <SocialIcons links={c.socialLinks} />
            </div>
          </div>
        </div>
        {/* Row 2 */}
        <div className="flex items-center gap-4 text-sm tracking-wider pl-[calc(16rem+4.2rem)] font-[family-name:var(--font-scale)] -mt-1">
          {(c.secondaryLinks || []).map((link, i) => (
            <a key={i} href={link.href || '#'} className="uppercase hover:opacity-70 flex items-center gap-0.5 transition-opacity" style={{ color: c.textColor }}>
              {link.name}{i === 0 && <span className="text-[10px] opacity-40">▼</span>}
            </a>
          ))}
        </div>
      </div>

      {/* ── Mobile ──────────────────────────────────────── */}
      <div className="md:hidden">
        <div className="flex items-center justify-between px-2 xs:px-4 py-3">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-2xl leading-none" style={{ color: c.textColor }}>
            {menuOpen ? '✕' : '☰'}
          </button>
          <img src={c.logo} alt="Futurism" className="h-8 w-auto" />
          <button className="p-2 hover:opacity-70" style={{ color: c.textColor }}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 01-14 0 7 7 0 0114 0z"/></svg>
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-gray-200 px-4 pb-4" style={{ backgroundColor: c.bgColor }}>
            <nav className="flex flex-col">
              {allLinks.map((link, i) => (
                <a key={i} href={link.href || '#'} className="py-4 border-b border-gray-100 flex items-center justify-between uppercase text-sm font-medium" style={{ color: c.textColor }}>
                  {link.name}<span className="opacity-40 text-xs">▼</span>
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-3 pt-4">
              <SocialIcons links={c.socialLinks} />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}