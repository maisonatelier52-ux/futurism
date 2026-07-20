// components/Footer.jsx
// Server Component: fetches the saved footer config before rendering, same
// rationale as components/Header.jsx -- eliminates the default-then-real
// template flash.
import FooterTemplate1 from './footer-templates/FooterTemplate1';
import FooterTemplate2 from './footer-templates/FooterTemplate2';
import FooterTemplate3 from './footer-templates/FooterTemplate3';
import FooterTemplate4 from './footer-templates/FooterTemplate4';
import FooterTemplate5 from './footer-templates/FooterTemplate5';
import FooterTemplate6 from './footer-templates/FooterTemplate6';
import { DEFAULT_FOOTER_CONFIG } from '@/lib/footerDefaults';
import { API_BASE } from '@/lib/apiConfig';

const TEMPLATES = {
  'template-1': FooterTemplate1,
  'template-2': FooterTemplate2,
  'template-3': FooterTemplate3,
  'template-4': FooterTemplate4,
  'template-5': FooterTemplate5,
  'template-6': FooterTemplate6,
};

async function getFooterConfig() {
  try {
    const res = await fetch(`${API_BASE}/api/footer`, { cache: 'no-store' });
    if (!res.ok) return DEFAULT_FOOTER_CONFIG;
    const d = await res.json();
    return d.config || DEFAULT_FOOTER_CONFIG;
  } catch {
    return DEFAULT_FOOTER_CONFIG;
  }
}

export default async function Footer() {
  const config = await getFooterConfig();
  const ActiveTemplate = TEMPLATES[config?.activeTemplate] || FooterTemplate1;
  return <ActiveTemplate config={config} />;
}
