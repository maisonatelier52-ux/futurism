import './globals.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { Anton, Bitter, Barlow, DM_Sans } from 'next/font/google';
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
    <html lang="en" className={`${anton.variable} ${bitter.variable} ${barlow.variable} ${dmSans.variable}`}>
      <body className="antialiased bg-gray-50 text-zinc-900">
        {children}
      </body>
    </html>
  );
}