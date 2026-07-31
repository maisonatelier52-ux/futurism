// Variation 3: Logo + all links in top row, then 3-col below: newsletter+social | disclaimer | categories 2-col
import FooterSocialIcons from './FooterSocialIcons';
import { NewsletterInline } from './NewsletterInput';
import { DEFAULT_FOOTER_CONFIG } from '@/lib/footerDefaults';

export default function FooterTemplate3({ config }) {
  const c = config || DEFAULT_FOOTER_CONFIG;
  const allLinks = [...(c.centerLinks || []), ...(c.legalLinks || [])];

  return (
    <footer className="bg-white dark:bg-[#0f0f14] border-t border-gray-200 dark:border-gray-800">

      {/* Top row: logo + all nav links */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-gray-200 dark:border-gray-800">
        <img src={c.logo} alt="Futurism" className="h-9 w-auto flex-shrink-0 dark:invert" />
        <div className="w-px h-5 bg-gray-300 dark:bg-gray-700 hidden md:block" />
        {allLinks.map((l, i) => (
          <a key={i} href={l.href || '#'} className="text-xs uppercase font-semibold text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:underline whitespace-nowrap">
            {l.name}
          </a>
        ))}
      </div>

      {/* Main content: 3 cols */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">

          {/* Col 1: Newsletter heading + inline input + social */}
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-black uppercase leading-tight text-gray-900 dark:text-gray-100">
                {(c.newsletter?.heading || '').split('\n')[0]}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{c.newsletter?.subtext}</p>
            </div>
            <NewsletterInline newsletter={c.newsletter} />
            <FooterSocialIcons links={c.socialLinks} />
          </div>

          {/* Col 2: Disclaimer + copyright */}
          <div className="flex flex-col justify-end">
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{c.disclaimer}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 text-center">{c.copyright}</p>
          </div>

          {/* Col 3: Categories in 2-col grid */}
          <div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {(c.categoryLinks || []).map((l, i) => (
                <a key={i} href={l.href || '#'} className="text-xs font-semibold uppercase hover:underline text-gray-900 dark:text-gray-100">{l.name}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
