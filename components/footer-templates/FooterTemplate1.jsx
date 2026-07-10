// Variation 1: Your original design — logo+newsletter | nav+legal+social+disclaimer | categories
import FooterSocialIcons from './FooterSocialIcons';
import { NewsletterBox } from './NewsletterInput';
import { DEFAULT_FOOTER_CONFIG } from '@/lib/footerDefaults';

export default function FooterTemplate1({ config }) {
  const c = config || DEFAULT_FOOTER_CONFIG;
  return (
    <footer className="bg-[#f8f8f8] border-t border-gray-200 pt-5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

        {/* Col 1: Logo + Newsletter */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <img src={c.logo} alt="Futurism" className="h-10 w-auto" />
          <NewsletterBox newsletter={c.newsletter} />
        </div>

        {/* Col 2: Nav + Legal + Social + Disclaimer */}
        <div className="lg:col-span-5">
          <div className="flex flex-nowrap overflow-x-auto gap-x-6 md:gap-x-8 text-sm font-black mb-6 py-3 border-t-2 border-b-2 border-dotted border-gray-400 scrollbar-hide">
            {(c.centerLinks || []).map((l, i) => (
              <a key={i} href={l.href || '#'} className="hover:underline whitespace-nowrap">{l.name}</a>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-4 md:gap-x-6 gap-y-2 text-xs text-gray-900 mb-8">
            {(c.legalLinks || []).map((l, i) => (
              <a key={i} href={l.href || '#'} className="hover:underline">{l.name}</a>
            ))}
          </div>
          <div className="mb-6"><FooterSocialIcons links={c.socialLinks} /></div>
          <div className="text-xs text-gray-500 leading-relaxed max-w-lg">
            <p className="mb-4">{c.disclaimer}</p>
            <p>{c.copyright}</p>
          </div>
        </div>

        {/* Col 3: Categories */}
        <div className="lg:col-span-3 lg:border-l-2 lg:border-dotted lg:border-gray-400 lg:pl-8 border-t-2 border-dotted border-gray-400 pt-6 lg:pt-0 lg:border-t-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-y-3 gap-x-4 text-sm font-medium">
            {(c.categoryLinks || []).map((l, i) => (
              <a key={i} href={l.href || '#'} className="block hover:underline">{l.name}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
