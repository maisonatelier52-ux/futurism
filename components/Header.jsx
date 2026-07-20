// components/Header.jsx
// Server Component: fetches the saved header config before rendering, so
// the correct header template/config is part of the very first HTML sent
// to the browser -- no more "default template flashes, then my chosen
// one appears" gap that the old client-fetching version had.
import HeaderTemplate1 from './header-templates/HeaderTemplate1';
import HeaderTemplate2 from './header-templates/HeaderTemplate2';
import HeaderTemplate3 from './header-templates/HeaderTemplate3';
import HeaderTemplate4 from './header-templates/HeaderTemplate4';
import HeaderTemplate5 from './header-templates/HeaderTemplate5';
import HeaderTemplate6 from './header-templates/HeaderTemplate6';
import HeaderTemplate7 from './header-templates/HeaderTemplate7';
import { DEFAULT_HEADER_CONFIG } from '@/lib/headerDefaults';
import { API_BASE } from '@/lib/apiConfig';

const TEMPLATES = {
  'template-1': HeaderTemplate1,
  'template-2': HeaderTemplate2,
  'template-3': HeaderTemplate3,
  'template-4': HeaderTemplate4,
  'template-5': HeaderTemplate5,
  'template-6': HeaderTemplate6,
  'template-7': HeaderTemplate7,
};

async function getHeaderConfig() {
  try {
    const res = await fetch(`${API_BASE}/api/header`, { cache: 'no-store' });
    if (!res.ok) return DEFAULT_HEADER_CONFIG;
    const d = await res.json();
    return d.config || DEFAULT_HEADER_CONFIG;
  } catch {
    return DEFAULT_HEADER_CONFIG;
  }
}

export default async function Header() {
  const config = await getHeaderConfig();
  const ActiveTemplate = TEMPLATES[config?.activeTemplate] || HeaderTemplate1;
  return <ActiveTemplate config={config} />;
}
