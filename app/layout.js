import './globals.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { Anton, Bitter, Barlow, DM_Sans } from 'next/font/google';
import Script from 'next/script';
import { ThemeProvider, THEME_INIT_SCRIPT } from '@/components/theme/ThemeProvider';
// Prevent Font Awesome from adding its own CSS (we already imported it)
config.autoAddCss = false;
const anton = Anton({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-owners-xnarrow',
});

const bitter = Bitter({
  subsets: ['latin'],
  style: ['italic'],
  variable: '--font-bitter',
});
const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  variable: '--font-scale',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-owners-text',
});
export const metadata = {
  title: 'Futurism',
  description: 'Independent News • Quality Journalism',
  icons: {
    icon: '/favicon.ico',
  },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${anton.variable} ${bitter.variable} ${barlow.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body className="antialiased bg-gray-50 text-zinc-900 dark:bg-gray-950 dark:text-gray-100 transition-colors" suppressHydrationWarning>
        {/* next/script with beforeInteractive injects and runs this in <head>
            before the page becomes interactive/hydrates -- a raw <script>
            tag rendered from a Server Component is never executed by
            Next.js (it's just static markup), which is what caused the
            "script tag while rendering" console error. This runs early
            enough to prevent a flash of the wrong theme on load. */}
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}