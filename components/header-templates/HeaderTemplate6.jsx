'use client';
// Template 6: Logo with accent underline, inline nav, trending bar below
import { useState } from 'react';
import SocialIcons from './SocialIcons';
import { DEFAULT_HEADER_CONFIG } from '@/lib/headerDefaults';

export default function HeaderTemplate6({ config }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const c = config || DEFAULT_HEADER_CONFIG;
  const allLinks = [...(c.mainLinks || []), ...(c.secondaryLinks || [])];

  return (
    <header className="z-40 border-b border-gray-200" style={{ backgroundColor: c.bgColor }}>
      <div className="max-w-7xl mx-auto px-2 xs:px-4 md:px-10">
        <div className="flex items-center h-14 md:h-16 gap-2 xs:gap-3 md:gap-6">
          {/* Logo with accent underline */}
          <div className="flex-shrink-0 relative pb-1">
            <img src={c.logo} alt="Futurism" className="h-7 xs:h-8 md:h-10 w-auto" />
            <div className="absolute bottom-0 left-0 w-full h-0.5 rounded-full" style={{ backgroundColor: c.accentColor }} />
          </div>
          {/* Separator */}
          <div className="hidden md:block w-px h-7 bg-gray-200 flex-shrink-0" />
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-5 text-sm font-[family-name:var(--font-scale)] tracking-wide flex-1 overflow-x-auto scrollbar-hide">
            {allLinks.map((link, i) => (
              <a key={i} href={link.href || '#'} className="uppercase whitespace-nowrap hover:opacity-70 flex items-center gap-0.5 flex-shrink-0 transition-opacity" style={{ color: c.textColor }}>
                {link.name}<span className="text-[10px] opacity-40">▼</span>
              </a>
            ))}
          </nav>
          {/* Right */}
          <div className="ml-auto flex items-center gap-1 xs:gap-2 flex-shrink-0">
            <button className="p-1.5 hover:opacity-70" style={{ color: c.textColor }}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 01-14 0 7 7 0 0114 0z"/></svg>
            </button>
            <div className="hidden sm:block">
              <SocialIcons links={c.socialLinks} />
            </div>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden w-8 h-8 flex items-center justify-center text-xl" style={{ color: c.textColor }}>
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Trending bar */}
      <div className="border-t border-gray-200 overflow-x-auto scrollbar-hide">
        <div className="max-w-7xl mx-auto px-2 xs:px-4 md:px-10 py-2 flex items-center gap-3 overflow-x-auto scrollbar-hide">
          <span className="text-[10px] xs:text-xs font-black uppercase tracking-widest flex-shrink-0 whitespace-nowrap" style={{ color: '#8b5cf6' }}>
            〔📡〕 TRENDING:
          </span>
          {(c.trendingTopics || []).map((topic, i) => (
            <a key={i} href={topic.href || '#'} className="flex items-center gap-1.5 text-[11px] xs:text-xs whitespace-nowrap hover:underline flex-shrink-0" style={{ color: c.textColor }}>
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: c.accentColor }} />
              {topic.label}
            </a>
          ))}
          <a href="#" className="ml-auto flex-shrink-0 text-[11px] xs:text-xs font-semibold whitespace-nowrap hover:underline" style={{ color: c.accentColor }}>
            View All Trends →
          </a>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200" style={{ backgroundColor: c.bgColor }}>
          <nav className="flex flex-col px-4 py-2">
            {allLinks.map((link, i) => (
              <a key={i} href={link.href || '#'} className="py-4 border-b border-gray-100 uppercase text-sm flex justify-between" style={{ color: c.textColor }}>
                {link.name}<span className="opacity-40 text-xs">▼</span>
              </a>
            ))}
          </nav>
          <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-3">
            <SocialIcons links={c.socialLinks} />
          </div>
        </div>
      )}
    </header>
  );
}