'use client';
// Template 3: Large logo + search + weather/social right, full-width nav row below
import { useState } from 'react';
import SocialIcons from './SocialIcons';
import { DEFAULT_HEADER_CONFIG } from '@/lib/headerDefaults';

export default function HeaderTemplate3({ config }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const c = config || DEFAULT_HEADER_CONFIG;
  const allLinks = [...(c.mainLinks || []), ...(c.secondaryLinks || [])];

  return (
    <header className="z-40 border-b border-gray-200" style={{ backgroundColor: c.bgColor }}>

      {/* ── Top row ─────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-3 md:py-4">
        <div className="flex items-center gap-3 md:gap-6">
          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex-shrink-0 text-xl" style={{ color: c.textColor }}>
            {menuOpen ? '✕' : '☰'}
          </button>
          {/* Logo */}
          <img src={c.logo} alt="Futurism" className="h-10 md:h-14 w-auto flex-shrink-0" />
          {/* Search — hidden on small mobile, shown md+ */}
          <div className="hidden sm:flex flex-1 max-w-xl relative">
            <input type="text" placeholder="Search the future..."
              className="w-full h-9 md:h-10 pl-4 pr-10 border border-gray-300 rounded-full text-sm focus:outline-none bg-white" />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 01-14 0 7 7 0 0114 0z"/></svg>
            </button>
          </div>
          {/* Weather + social */}
          <div className="ml-auto flex items-center gap-3 flex-shrink-0">
            {c.showWeather && (
              <div className="hidden lg:flex items-center gap-1.5 text-sm" style={{ color: c.textColor }}>
                <span>☁️</span>
                <span className="font-semibold">{c.weatherText || '24°C'}</span>
                <span className="text-xs opacity-50">▼</span>
              </div>
            )}
            <div className="hidden sm:block w-px h-5 bg-gray-200" />
            <SocialIcons links={c.socialLinks} size="sm" />
            {/* Mobile search icon */}
            <button className="sm:hidden p-1.5" style={{ color: c.textColor }}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 01-14 0 7 7 0 0114 0z"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Nav row — desktop only ───────────────────────── */}
      <div className="hidden md:block border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-10 flex items-center justify-between">
          <nav className="flex items-center overflow-x-auto scrollbar-hide">
            {allLinks.map((link, i) => (
              <a key={i} href={link.href || '#'}
                className="px-4 py-3 text-sm uppercase font-[family-name:var(--font-scale)] tracking-wide whitespace-nowrap hover:opacity-70 flex items-center gap-0.5 border-r border-gray-100 flex-shrink-0"
                style={{ color: c.textColor }}>
                {link.name}<span className="text-[10px] opacity-40">▼</span>
              </a>
            ))}
          </nav>
          <a href={c.newsletterHref || '#'}
            className="hidden lg:flex items-center gap-2 ml-4 px-4 py-2 text-xs font-bold uppercase tracking-widest flex-shrink-0"
            style={{ backgroundColor: c.textColor, color: c.bgColor }}>
            ✉ {c.newsletterLabel || 'NEWSLETTER'}
          </a>
        </div>
      </div>

      {/* ── Mobile menu ─────────────────────────────────── */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200" style={{ backgroundColor: c.bgColor }}>
          <nav className="flex flex-col px-4 py-2">
            {allLinks.map((link, i) => (
              <a key={i} href={link.href || '#'} className="py-3 border-b border-gray-100 uppercase text-sm flex justify-between" style={{ color: c.textColor }}>
                {link.name}<span className="opacity-40 text-xs">▼</span>
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
