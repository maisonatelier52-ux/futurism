// components/HomepageResolver.jsx
// Server Component: picks the active homepage template and renders it with
// the config fetched by the page itself (see app/page.jsx). No client-side
// fetch/loading state here anymore -- the whole page (Header + this +
// Footer) is sent to the browser already fully rendered, which is what
// eliminates the "header/footer show up, then content pops in a beat
// later" flash the old client-fetching version had.
import HomepageTemplate1 from './homepage-templates/HomepageTemplate1';
import HomepageTemplate2 from './homepage-templates/HomepageTemplate2';
import HomepageTemplate3 from './homepage-templates/HomepageTemplate3';
import HomepageTemplate4 from './homepage-templates/HomepageTemplate4';
import { DEFAULT_HOMEPAGE_CONFIG } from '../lib/homepageDefaults';

const TEMPLATES = {
  'template-1': HomepageTemplate1,
  'template-2': HomepageTemplate2,
  'template-3': HomepageTemplate3,
  'template-4': HomepageTemplate4,
};

export default function HomepageResolver({ config }) {
  const safeConfig = config || DEFAULT_HOMEPAGE_CONFIG;
  const ActiveTemplate = TEMPLATES[safeConfig.activeTemplate] || HomepageTemplate1;
  return <ActiveTemplate data={safeConfig.content || DEFAULT_HOMEPAGE_CONFIG.content} />;
}
