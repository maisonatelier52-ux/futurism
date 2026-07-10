// Variation 4: Dark theme — 4 cols: logo+social | center+legal | categories bold | newsletter+disclaimer
import FooterSocialIcons from './FooterSocialIcons';
import { DEFAULT_FOOTER_CONFIG } from '@/lib/footerDefaults';

export default function FooterTemplate4({ config }) {
  const c = config || DEFAULT_FOOTER_CONFIG;
  return (
    <footer className="bg-[#111111] text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">

          {/* Col 1: Logo + subtext + social */}
          <div className="flex flex-col gap-4">
            <img src={c.logo} alt="Futurism" className="h-10 w-auto invert" />
            <p className="text-gray-400 text-xs leading-relaxed">{c.newsletter?.subtext}</p>
            <FooterSocialIcons links={c.socialLinks} dark={true} />
          </div>

          {/* Col 2: Center + legal links */}
          <div className="flex flex-col gap-3">
            {(c.centerLinks || []).map((l, i) => (
              <a key={i} href={l.href || '#'} className="text-sm font-bold uppercase text-white hover:text-gray-300 hover:underline">{l.name}</a>
            ))}
            <div className="h-px bg-white/10 my-1" />
            {(c.legalLinks || []).map((l, i) => (
              <a key={i} href={l.href || '#'} className="text-xs text-gray-500 uppercase hover:text-gray-300 hover:underline">{l.name}</a>
            ))}
          </div>

          {/* Col 3: Categories — bold */}
          <div className="flex flex-col gap-2">
            {(c.categoryLinks || []).map((l, i) => (
              <a key={i} href={l.href || '#'} className="text-sm font-bold uppercase text-white hover:text-gray-300 hover:underline">{l.name}</a>
            ))}
          </div>

          {/* Col 4: Newsletter + disclaimer */}
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm font-black uppercase leading-tight">{(c.newsletter?.heading || '').replace('\n', ' ')}</p>
              <p className="text-xs text-gray-400 mt-1">{c.newsletter?.subtext}</p>
            </div>
            <div className="flex gap-2">
              <input type="email" placeholder="Enter your email"
                className="flex-1 h-10 px-3 bg-white/10 border border-white/20 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-white/50" />
              <button className="h-10 px-4 bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition whitespace-nowrap">
                {c.newsletter?.buttonLabel || 'SIGN UP'}
              </button>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">{c.disclaimer}</p>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-3 text-center text-xs text-gray-600">
          {c.copyright}
        </div>
      </div>
    </footer>
  );
}
