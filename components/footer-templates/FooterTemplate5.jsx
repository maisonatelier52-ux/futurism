// Variation 5: Magazine style 5-col — logo+social | icon+nav col | icon+legal col | categories 2-col | newsletter+disclaimer
import FooterSocialIcons from './FooterSocialIcons';
import { DEFAULT_FOOTER_CONFIG } from '@/lib/footerDefaults';

// Small icon label for section headers
function ColHeader({ icon, label }) {
  return (
    <div className="flex items-center gap-2 pb-2 mb-3 border-b border-gray-200">
      <span className="text-gray-400 text-base">{icon}</span>
      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</span>
    </div>
  );
}

export default function FooterTemplate5({ config }) {
  const c = config || DEFAULT_FOOTER_CONFIG;
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">

          {/* Col 1: Logo + subtext + social */}
          <div className="flex flex-col gap-3">
            <img src={c.logo} alt="Futurism" className="h-10 w-auto" />
            <p className="text-xs text-gray-500 leading-relaxed">{c.newsletter?.subtext}</p>
            <FooterSocialIcons links={c.socialLinks} size="sm" />
          </div>

          {/* Col 2: Nav links with icon header */}
          <div>
            <ColHeader icon="📋" label="Navigate" />
            {(c.centerLinks || []).map((l, i) => (
              <a key={i} href={l.href || '#'} className="block text-sm font-semibold uppercase mb-2 hover:underline">{l.name}</a>
            ))}
          </div>

          {/* Col 3: Legal links with icon header */}
          <div>
            <ColHeader icon="🛡️" label="Policies" />
            {(c.legalLinks || []).map((l, i) => (
              <a key={i} href={l.href || '#'} className="block text-xs uppercase text-gray-500 mb-2 hover:underline">{l.name}</a>
            ))}
          </div>

          {/* Col 4: Categories in 2-col grid with icon header */}
          <div className="sm:col-span-2 lg:col-span-1">
            <ColHeader icon="📁" label="Topics" />
            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
              {(c.categoryLinks || []).map((l, i) => (
                <a key={i} href={l.href || '#'} className="text-xs font-semibold uppercase hover:underline">{l.name}</a>
              ))}
            </div>
          </div>

          {/* Col 5: Newsletter + disclaimer */}
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="text-sm font-black uppercase leading-tight mb-1">{(c.newsletter?.heading || '').replace('\n', ' ')}</p>
            <div className="flex gap-2 mb-3">
              <input type="email" placeholder="Enter your email"
                className="flex-1 min-w-0 h-9 px-3 border border-gray-300 text-xs focus:outline-none bg-white" />
              <button className="h-9 px-3 bg-[#111] text-white font-bold text-[10px] uppercase tracking-widest hover:bg-black transition whitespace-nowrap">
                {c.newsletter?.buttonLabel || 'SIGN UP'}
              </button>
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed">{c.disclaimer}</p>
            <p className="text-[10px] text-gray-400 mt-2">{c.copyright}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
