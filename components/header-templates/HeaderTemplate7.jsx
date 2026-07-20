'use client';
// Template 7: Diagonal logo block left, split nav center, weather+social right, breaking news bar
import { useState } from 'react';
import SocialIcons from './SocialIcons';
import { DEFAULT_HEADER_CONFIG } from '@/lib/headerDefaults';

export default function HeaderTemplate7({ config }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const c = config || DEFAULT_HEADER_CONFIG;
  const allLinks = [...(c.mainLinks || []), ...(c.secondaryLinks || [])];

  return (
    <header className="z-40 border-b border-gray-200" style={{ backgroundColor: c.bgColor }}>

      {/* ── Main row ────────────────────────────────────── */}
      <div className="flex items-stretch overflow-hidden">

        {/* Diagonal black logo block — desktop only */}
        <div className="hidden md:flex relative bg-[#111] items-center px-6 pr-14 flex-shrink-0"
          style={{ clipPath: 'polygon(0 0, 100% 0, 88% 100%, 0 100%)' }}>
          <img src={c.logo} alt="Futurism" className="h-11 w-auto invert relative z-10" />
        </div>

        {/* Mobile: regular logo + hamburger */}
        <div className="md:hidden flex items-center gap-2 xs:gap-3 px-2 xs:px-4 py-3 flex-shrink-0">
          <button onClick={() => setMenuOpen(!menuOpen)} className="w-8 h-8 flex items-center justify-center text-xl" style={{ color: c.textColor }}>
            {menuOpen ? '✕' : '☰'}
          </button>
          <img src={c.logo} alt="Futurism" className="h-7 xs:h-8 w-auto" />
        </div>

        {/* Center nav — desktop */}
        <div className="hidden md:flex flex-1 flex-col justify-center px-4 lg:px-6 overflow-hidden">
          <nav className="flex flex-wrap items-center gap-x-4 lg:gap-x-5 gap-y-0.5 text-sm font-[family-name:var(--font-scale)] tracking-wide overflow-hidden">
            {(c.mainLinks || []).map((link, i) => (
              <a key={i} href={link.href || '#'} className="uppercase whitespace-nowrap hover:opacity-70 flex items-center gap-0.5 flex-shrink-0 transition-opacity" style={{ color: c.textColor }}>
                {link.name}<span className="text-[10px] opacity-40">▼</span>
              </a>
            ))}
          </nav>
          {(c.secondaryLinks || []).length > 0 && (
            <div className="flex items-center gap-4 text-sm mt-0.5">
              {c.secondaryLinks.map((link, i) => (
                <a key={i} href={link.href || '#'} className="uppercase flex items-center gap-0.5 hover:opacity-70 transition-opacity" style={{ color: c.textColor }}>
                  {link.name}{i === 0 && <span className="text-[10px] opacity-40">▼</span>}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Right: weather + social — desktop */}
        <div className="hidden md:flex items-center gap-3 px-4 flex-shrink-0">
          {c.showWeather && (
            <div className="flex items-center gap-1.5 text-sm" style={{ color: c.textColor }}>
              <span>☁️</span>
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-xs" style={{ color: c.accentColor }}>{c.weatherText || '24°C'}</span>
                <span className="text-[10px] opacity-50">New York, US ▼</span>
              </div>
            </div>
          )}
          <SocialIcons links={c.socialLinks} />
        </div>

        {/* Mobile right: search */}
        <div className="md:hidden ml-auto flex items-center px-2 xs:px-3">
          <button className="p-1.5" style={{ color: c.textColor }}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 01-14 0 7 7 0 0114 0z"/></svg>
          </button>
        </div>
      </div>

      {/* ── Breaking news bar ───────────────────────────── */}
      <div className="flex items-stretch text-xs border-t border-gray-200 overflow-hidden">
        <div className="flex items-center gap-1.5 px-2 xs:px-3 md:px-4 py-2.5 font-black uppercase tracking-widest whitespace-nowrap flex-shrink-0 text-white" style={{ backgroundColor: c.accentColor }}>
          <span className="hidden sm:inline text-[10px]">BREAKING NEWS</span>
          <span className="sm:hidden text-[10px]">BREAKING</span>
        </div>
        <div className="flex items-center flex-1 overflow-hidden divide-x divide-gray-200 border-l border-gray-200">
          {(c.breakingNews || []).slice(0, 2).map((item, i) => (
            <a key={i} href={item.href || '#'}
              className={`flex items-center gap-2 px-2 xs:px-3 md:px-4 py-2.5 hover:underline truncate flex-1 min-w-0 ${i > 0 ? 'hidden md:flex' : ''}`}
              style={{ color: c.textColor }}>
              <span className="truncate text-[11px] md:text-xs">{item.text}</span>
              {item.time && <span className="font-semibold flex-shrink-0 text-[10px]" style={{ color: c.accentColor }}>{item.time}</span>}
            </a>
          ))}
        </div>
      </div>

      {/* ── Mobile menu ─────────────────────────────────── */}
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