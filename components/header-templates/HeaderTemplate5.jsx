'use client';
// Template 5: Centered logo, split nav left/right, utility bar below
import { useState } from 'react';
import SocialIcons from './SocialIcons';
import { DEFAULT_HEADER_CONFIG } from '@/lib/headerDefaults';

export default function HeaderTemplate5({ config }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const c = config || DEFAULT_HEADER_CONFIG;
  const all = [...(c.mainLinks || []), ...(c.secondaryLinks || [])];
  const half = Math.ceil((c.mainLinks || []).length / 2);
  const leftLinks  = (c.mainLinks || []).slice(0, half);
  const rightLinks = (c.mainLinks || []).slice(half);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const surfaceVars = { '--hdr-bg': c.bgColor, '--hdr-fg': c.textColor };
  const ctaVars = { '--hdr-bg': c.textColor, '--hdr-fg': c.bgColor }; // inverted subscribe button
  const accentVars = { '--hdr-fg': c.accentColor };

  return (
    <header className="header-surface z-40 border-b border-gray-200 dark:border-gray-800" style={surfaceVars}>

      {/* ── Main row ────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="flex items-center h-14 md:h-16 gap-2 md:gap-4">
          {/* Home icon — desktop only */}
          <a href="/" className="header-fg hidden md:flex flex-shrink-0 w-9 h-9 border border-gray-300 dark:border-gray-700 items-center justify-center text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">⌂</a>
          {/* Left nav — desktop only */}
          <nav className="hidden md:flex items-center gap-3 lg:gap-4 text-sm font-[family-name:var(--font-scale)] tracking-wide flex-1 overflow-hidden">
            {leftLinks.map((link, i) => (
              <a key={i} href={link.href || '#'} className="header-fg uppercase whitespace-nowrap hover:opacity-70 flex items-center gap-0.5 flex-shrink-0 transition-opacity">
                {link.name}<span className="text-[10px] opacity-40">▼</span>
              </a>
            ))}
          </nav>
          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="header-fg md:hidden flex-shrink-0 w-8 h-8 flex items-center justify-center text-xl">
            {menuOpen ? '✕' : '☰'}
          </button>
          {/* Centered logo */}
          <img src={c.logo} alt="Futurism" className="h-9 md:h-11 w-auto flex-shrink-0 mx-auto md:mx-0 dark:invert" />
          {/* Right nav — desktop only */}
          <nav className="hidden md:flex items-center gap-3 lg:gap-4 text-sm font-[family-name:var(--font-scale)] tracking-wide flex-1 justify-end overflow-hidden">
            {rightLinks.map((link, i) => (
              <a key={i} href={link.href || '#'} className="header-fg uppercase whitespace-nowrap hover:opacity-70 flex items-center gap-0.5 flex-shrink-0 transition-opacity">
                {link.name}<span className="text-[10px] opacity-40">▼</span>
              </a>
            ))}
          </nav>
          {/* Search */}
          <button className="header-fg p-1.5 flex-shrink-0 hover:opacity-70">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 01-14 0 7 7 0 0114 0z"/></svg>
          </button>
        </div>
        {/* Secondary links row — desktop */}
        {(c.secondaryLinks || []).length > 0 && (
          <div className="hidden md:flex justify-center gap-6 pb-2 text-sm font-[family-name:var(--font-scale)]">
            {c.secondaryLinks.map((link, i) => (
              <a key={i} href={link.href || '#'} className="header-fg uppercase flex items-center gap-0.5 hover:opacity-70 transition-opacity">
                {link.name}{i === 0 && <span className="text-[10px] opacity-40">▼</span>}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* ── Utility bar — desktop only ───────────────────── */}
      <div className="hidden md:block border-t border-gray-200 dark:border-gray-800">
        <div className="header-fg max-w-7xl mx-auto px-10 py-2 flex items-center gap-6 text-xs overflow-x-auto scrollbar-hide">
          {c.showWeather && (
            <div className="flex items-center gap-1.5 whitespace-nowrap flex-shrink-0">
              <span>🌤️</span>
              <span className="header-fg font-semibold" style={accentVars}>{c.weatherText || '24°C'}</span>
              <span className="opacity-50 text-[10px]">▼</span>
            </div>
          )}
          {c.showDate && (
            <div className="flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 opacity-70">
              <span>📅</span><span>{today}</span>
            </div>
          )}
          {c.showPodcast && (
            <div className="flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 opacity-70 cursor-pointer hover:opacity-100">
              <span>▶</span><span>Listen to Podcast</span>
            </div>
          )}
          <div className="flex-1" />
          {c.showSubscribeButton && (
            <a href={c.subscribeHref || '#'} className="header-surface header-fg flex-shrink-0 px-4 py-1.5 font-bold uppercase tracking-widest text-[11px]" style={ctaVars}>
              {c.subscribeLabel || 'SUBSCRIBE'}
            </a>
          )}
        </div>
      </div>

      {/* ── Mobile menu ─────────────────────────────────── */}
      {menuOpen && (
        <div className="header-surface md:hidden border-t border-gray-200 dark:border-gray-800" style={surfaceVars}>
          <nav className="flex flex-col px-4 py-2">
            {all.map((link, i) => (
              <a key={i} href={link.href || '#'} className="header-fg py-3 border-b border-gray-100 dark:border-gray-800 uppercase text-sm flex justify-between">
                {link.name}<span className="opacity-40 text-xs">▼</span>
              </a>
            ))}
          </nav>
          {c.showSubscribeButton && (
            <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800">
              <a href={c.subscribeHref || '#'} className="header-surface header-fg block w-full text-center py-2.5 font-bold uppercase tracking-widest text-sm" style={ctaVars}>
                {c.subscribeLabel || 'SUBSCRIBE'}
              </a>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
