'use client';
// Template 3: Large logo + search + weather/social right, full-width nav row below
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SocialIcons from './SocialIcons';
import { DEFAULT_HEADER_CONFIG } from '@/lib/headerDefaults';

export default function HeaderTemplate3({ config }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const c = config || DEFAULT_HEADER_CONFIG;
  const allLinks = [...(c.mainLinks || []), ...(c.secondaryLinks || [])];
  const surfaceVars = { '--hdr-bg': c.bgColor, '--hdr-fg': c.textColor };
  // The newsletter CTA below is intentionally inverted (bg=textColor,
  // fg=bgColor) -- its own swapped variable pairing keeps that contrast
  // relationship correct in dark mode too, rather than reusing --hdr-bg/fg.
  const ctaVars = { '--hdr-bg': c.textColor, '--hdr-fg': c.bgColor };

  function handleSearchSubmit(e) {
    e.preventDefault();
    const q = searchQuery.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
  }

  return (
    <header className="header-surface z-40 border-b border-gray-200 dark:border-gray-800" style={surfaceVars}>

      {/* ── Top row ─────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-3 md:py-4">
        <div className="flex items-center gap-3 md:gap-6">
          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="header-fg md:hidden flex-shrink-0 text-xl">
            {menuOpen ? '✕' : '☰'}
          </button>
          {/* Logo */}
          <img src={c.logo} alt="Futurism" className="h-10 md:h-14 w-auto flex-shrink-0 dark:invert" />
          {/* Search — hidden on small mobile, shown md+ */}
          <form onSubmit={handleSearchSubmit} className="hidden sm:flex flex-1 max-w-xl relative">
            <input type="text" placeholder="Search the future..."
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 md:h-10 pl-4 pr-10 border border-gray-300 dark:border-gray-700 rounded-full text-sm focus:outline-none bg-white dark:bg-[#1c1c24] dark:text-gray-100" />
            <button type="submit" aria-label="Search" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 01-14 0 7 7 0 0114 0z"/></svg>
            </button>
          </form>
          {/* Weather + social */}
          <div className="ml-auto flex items-center gap-3 flex-shrink-0">
            {c.showWeather && (
              <div className="header-fg hidden lg:flex items-center gap-1.5 text-sm">
                <span>☁️</span>
                <span className="font-semibold">{c.weatherText || '24°C'}</span>
                <span className="text-xs opacity-50">▼</span>
              </div>
            )}
            <div className="hidden sm:block w-px h-5 bg-gray-200 dark:bg-gray-700" />
            <SocialIcons links={c.socialLinks} size="sm" />
            {/* Mobile search icon -- no room for the full search box at
                this width, so this links straight to the search page
                instead (the other 6 header templates follow this same
                pattern for their search icon). */}
            <Link href="/search" className="header-fg sm:hidden p-1.5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 01-14 0 7 7 0 0114 0z"/></svg>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Nav row — desktop only ───────────────────────── */}
      <div className="hidden md:block border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-10 flex items-center justify-between">
          <nav className="flex items-center overflow-x-auto scrollbar-hide">
            {allLinks.map((link, i) => (
              <a key={i} href={link.href || '#'}
                className="header-fg px-4 py-3 text-sm uppercase font-[family-name:var(--font-scale)] tracking-wide whitespace-nowrap hover:opacity-70 flex items-center gap-0.5 border-r border-gray-100 dark:border-gray-800 flex-shrink-0">
                {link.name}<span className="text-[10px] opacity-40">▼</span>
              </a>
            ))}
          </nav>
          <a href={c.newsletterHref || '#'}
            className="header-surface header-fg hidden lg:flex items-center gap-2 ml-4 px-4 py-2 text-xs font-bold uppercase tracking-widest flex-shrink-0"
            style={ctaVars}>
            ✉ {c.newsletterLabel || 'NEWSLETTER'}
          </a>
        </div>
      </div>

      {/* ── Mobile menu ─────────────────────────────────── */}
      {menuOpen && (
        <div className="header-surface md:hidden border-t border-gray-200 dark:border-gray-800" style={surfaceVars}>
          <nav className="flex flex-col px-4 py-2">
            {allLinks.map((link, i) => (
              <a key={i} href={link.href || '#'} className="header-fg py-3 border-b border-gray-100 dark:border-gray-800 uppercase text-sm flex justify-between">
                {link.name}<span className="opacity-40 text-xs">▼</span>
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
