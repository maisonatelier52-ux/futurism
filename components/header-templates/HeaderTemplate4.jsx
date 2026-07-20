'use client';
// Template 4: Dark theme + breaking news bar
import { useState } from 'react';
import SocialIcons from './SocialIcons';
import { DEFAULT_HEADER_CONFIG } from '@/lib/headerDefaults';

export default function HeaderTemplate4({ config }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const c = config || DEFAULT_HEADER_CONFIG;
  const allLinks = [...(c.mainLinks || []), ...(c.secondaryLinks || [])];
  const darkBg = '#111111';

  return (
    <header className="z-40" style={{ backgroundColor: darkBg }}>
      <div className="max-w-7xl mx-auto px-2 xs:px-4 md:px-10">
        <div className="flex items-center h-14 md:h-16 gap-2 xs:gap-3">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white/80 hover:text-white flex-shrink-0 w-8 h-8 flex items-center justify-center text-xl">
            {menuOpen ? '✕' : '☰'}
          </button>
          <img src={c.logo} alt="Futurism" className="h-7 xs:h-8 md:h-10 w-auto flex-shrink-0 invert" />
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-5 text-sm font-[family-name:var(--font-scale)] tracking-wide flex-1 overflow-x-auto scrollbar-hide">
            {allLinks.map((link, i) => (
              <a key={i} href={link.href || '#'} className="text-white/80 hover:text-white uppercase whitespace-nowrap flex items-center gap-0.5 flex-shrink-0 transition-colors">
                {link.name}<span className="text-[10px] opacity-40">▼</span>
              </a>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2 flex-shrink-0">
            <button className="p-1.5 text-white/70 hover:text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 01-14 0 7 7 0 0114 0z"/></svg>
            </button>
            <div className="hidden sm:block w-px h-5 bg-white/20" />
            <div className="hidden sm:block">
              <SocialIcons links={c.socialLinks} dark={true} />
            </div>
          </div>
        </div>
      </div>

      {/* Breaking news bar */}
      <div style={{ backgroundColor: '#1a1a1a' }} className="border-t border-white/10 flex items-stretch text-xs overflow-hidden">
        <div className="flex items-center gap-2 px-2 xs:px-3 md:px-4 py-2.5 font-black uppercase tracking-widest whitespace-nowrap flex-shrink-0" style={{ backgroundColor: c.accentColor, color: '#fff' }}>
          <span className="hidden sm:inline">⚡</span>
          <span className="text-[10px] md:text-xs">BREAKING</span>
        </div>
        <div className="flex items-center flex-1 overflow-hidden">
          {(c.breakingNews || []).slice(0, 2).map((item, i) => (
            <a key={i} href={item.href || '#'}
              className={`flex items-center gap-2 px-2 xs:px-3 md:px-4 py-2.5 text-white/75 hover:text-white truncate flex-1 min-w-0 ${i > 0 ? 'hidden md:flex border-l border-white/10' : ''}`}>
              <span className="truncate text-[11px] md:text-xs">{item.text}</span>
              {item.time && <span className="font-semibold flex-shrink-0 text-[10px]" style={{ color: c.accentColor }}>{item.time}</span>}
            </a>
          ))}
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-white/10" style={{ backgroundColor: darkBg }}>
          <nav className="flex flex-col px-4 py-2">
            {allLinks.map((link, i) => (
              <a key={i} href={link.href || '#'} className="py-4 border-b border-white/10 uppercase text-sm text-white/75 flex justify-between">
                {link.name}<span className="opacity-40 text-xs">▼</span>
              </a>
            ))}
          </nav>
          <div className="px-4 py-3 border-t border-white/10">
            <SocialIcons links={c.socialLinks} dark={true} />
          </div>
        </div>
      )}
    </header>
  );
}