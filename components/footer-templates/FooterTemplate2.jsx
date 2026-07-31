// Variation 2: Horizontal single row — logo | newsletter | center links | legal+social | categories, disclaimer below
import FooterSocialIcons from './FooterSocialIcons';
import { NewsletterInline } from './NewsletterInput';
import { DEFAULT_FOOTER_CONFIG } from '@/lib/footerDefaults';

export default function FooterTemplate2({ config }) {
  const c = config || DEFAULT_FOOTER_CONFIG;
  return (
    <footer className="bg-white dark:bg-[#0f0f14] border-t border-gray-200 dark:border-gray-800">
      {/* Main row */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">

          {/* Logo */}
          <div className="flex flex-col gap-3">
            <img src={c.logo} alt="Futurism" className="h-10 w-auto dark:invert" />
          </div>

          {/* Newsletter inline */}
          <div className="flex flex-col gap-3 lg:border-l lg:border-gray-200 dark:lg:border-gray-800 lg:pl-6">
            <p className="text-sm font-black uppercase leading-tight text-gray-900 dark:text-gray-100">
              {(c.newsletter?.heading || '').replace('\n', ' ')}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{c.newsletter?.subtext}</p>
            <NewsletterInline newsletter={c.newsletter} />
          </div>

          {/* Center links */}
          <div className="flex flex-col gap-3 lg:border-l lg:border-gray-200 dark:lg:border-gray-800 lg:pl-6">
            {(c.centerLinks || []).map((l, i) => (
              <a key={i} href={l.href || '#'} className="text-sm font-bold hover:underline uppercase text-gray-900 dark:text-gray-100">{l.name}</a>
            ))}
          </div>

          {/* Legal + social */}
          <div className="flex flex-col gap-2 lg:border-l lg:border-gray-200 dark:lg:border-gray-800 lg:pl-6">
            {(c.legalLinks || []).map((l, i) => (
              <a key={i} href={l.href || '#'} className="text-xs text-gray-500 dark:text-gray-400 hover:underline uppercase">{l.name}</a>
            ))}
            <div className="mt-3"><FooterSocialIcons links={c.socialLinks} size="sm" /></div>
          </div>

          {/* Categories */}
          <div className="flex flex-col gap-2 lg:border-l lg:border-gray-200 dark:lg:border-gray-800 lg:pl-6">
            {(c.categoryLinks || []).map((l, i) => (
              <a key={i} href={l.href || '#'} className="text-xs font-semibold hover:underline uppercase text-gray-900 dark:text-gray-100">{l.name}</a>
            ))}
          </div>
        </div>
      </div>

      {/* Disclaimer bar */}
      <div className="border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 text-center text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
          <p>{c.disclaimer} {c.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
