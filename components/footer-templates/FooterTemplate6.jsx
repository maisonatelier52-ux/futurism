// Variation 6: Dark left logo panel + 3 light cols: nav/legal | categories 2-col | social+disclaimer
import FooterSocialIcons from './FooterSocialIcons';
import { DEFAULT_FOOTER_CONFIG } from '@/lib/footerDefaults';

function ColHeader({ icon, label }) {
  return (
    <div className="flex items-center gap-2 pb-2 mb-3 border-b border-gray-200">
      <span className="text-gray-400 text-base">{icon}</span>
      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</span>
    </div>
  );
}

export default function FooterTemplate6({ config }) {
  const c = config || DEFAULT_FOOTER_CONFIG;
  return (
    <footer className="border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12">

          {/* Left dark panel: logo + subtext + newsletter + social */}
          <div className="lg:col-span-3 bg-[#111111] text-white p-8 flex flex-col gap-5">
            <img src={c.logo} alt="Futurism" className="h-10 w-auto invert" />
            <p className="text-gray-400 text-xs leading-relaxed">{c.newsletter?.subtext}</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Enter your email"
                className="flex-1 min-w-0 h-9 px-3 bg-white/10 border border-white/20 text-white text-xs placeholder:text-white/40 focus:outline-none" />
              <button className="h-9 px-3 bg-white text-black font-bold text-[10px] uppercase tracking-widest hover:bg-gray-200 transition whitespace-nowrap">
                {c.newsletter?.buttonLabel || 'SIGN UP'}
              </button>
            </div>
          </div>

          {/* Right 3 cols */}
          <div className="lg:col-span-9 bg-white px-6 md:px-10 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">

              {/* Col 1: Nav + legal with icon headers */}
              <div>
                <ColHeader icon="ℹ️" label="About" />
                {(c.centerLinks || []).map((l, i) => (
                  <a key={i} href={l.href || '#'} className="block text-sm font-semibold uppercase mb-2 hover:underline">{l.name}</a>
                ))}
                <div className="mt-4">
                  <ColHeader icon="🛡️" label="Policies" />
                  {(c.legalLinks || []).map((l, i) => (
                    <a key={i} href={l.href || '#'} className="block text-xs text-gray-500 uppercase mb-1.5 hover:underline">{l.name}</a>
                  ))}
                </div>
              </div>

              {/* Col 2: Categories with icon header, 2-col grid */}
              <div>
                <ColHeader icon="📁" label="Explore" />
                <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                  {(c.categoryLinks || []).map((l, i) => (
                    <a key={i} href={l.href || '#'} className="text-xs font-semibold uppercase hover:underline">{l.name}</a>
                  ))}
                </div>
              </div>

              {/* Col 3: Social + disclaimer */}
              <div className="flex flex-col gap-4">
                <div>
                  <div className="pb-2 mb-3 border-b border-gray-200" />
                  <FooterSocialIcons links={c.socialLinks} />
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed">{c.disclaimer}</p>
              </div>

            </div>

            {/* Copyright */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-[10px] text-gray-400">{c.copyright}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
