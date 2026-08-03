'use client';
// Template 2: Inline nav + breaking news ticker
import { useState } from 'react';
import SocialIcons from './SocialIcons';
import BreakingNewsTicker from './BreakingNewsTicker';
import { DEFAULT_HEADER_CONFIG } from '@/lib/headerDefaults';

export default function HeaderTemplate2({ config }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const c = config || DEFAULT_HEADER_CONFIG;
  const allLinks = [...(c.mainLinks || []), ...(c.secondaryLinks || [])];
  const surfaceVars = { '--hdr-bg': c.bgColor, '--hdr-fg': c.textColor };

  return (
    <header className="header-surface z-40 border-b border-gray-200 dark:border-gray-800" style={surfaceVars}>
      <div className="max-w-7xl mx-auto px-2 xs:px-4 md:px-10">
        <div className="flex items-center h-14 md:h-16 gap-2 xs:gap-3">
          {/* Hamburger — mobile only */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="header-fg flex-shrink-0 w-8 h-8 flex items-center justify-center">
            {menuOpen ? '✕' : '☰'}
          </button>
          {/* Logo */}
          <img src={c.logo} alt="Futurism" className="h-7 xs:h-8 md:h-10 w-auto flex-shrink-0 dark:invert" />
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-5 text-sm font-[family-name:var(--font-scale)] tracking-wide flex-1 overflow-x-auto scrollbar-hide">
            {allLinks.map((link, i) => (
              <a key={i} href={link.href || '#'} className="header-fg uppercase whitespace-nowrap hover:opacity-70 flex items-center gap-0.5 flex-shrink-0 transition-opacity">
                {link.name}<span className="text-[10px] opacity-40">▼</span>
              </a>
            ))}
          </nav>
          {/* Right icons */}
          <div className="ml-auto flex items-center gap-1 xs:gap-2 flex-shrink-0">
            <button className="header-fg p-1.5 hover:opacity-70">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 01-14 0 7 7 0 0114 0z"/></svg>
            </button>
            <div className="hidden sm:block">
              <SocialIcons links={c.socialLinks} size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Breaking news */}
      <BreakingNewsTicker items={c.breakingNews} accentColor={c.accentColor} />

      {/* Mobile menu */}
      {menuOpen && (
        <div className="header-surface md:hidden border-t border-gray-200 dark:border-gray-800" style={surfaceVars}>
          <nav className="flex flex-col px-4 py-2">
            {allLinks.map((link, i) => (
              <a key={i} href={link.href || '#'} className="header-fg py-4 border-b border-gray-100 dark:border-gray-800 uppercase text-sm flex justify-between">
                {link.name}<span className="opacity-40 text-xs">▼</span>
              </a>
            ))}
          </nav>
          <div className="px-4 py-3 flex items-center gap-3 border-t border-gray-100 dark:border-gray-800">
            <SocialIcons links={c.socialLinks} />
          </div>
        </div>
      )}
    </header>
  );
}