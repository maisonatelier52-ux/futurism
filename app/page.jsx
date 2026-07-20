import Header from '../components/Header';
import Footer from '../components/Footer';
import HomepageResolver from '../components/HomepageResolver';
import { API_BASE } from '../lib/apiConfig';
import { DEFAULT_HOMEPAGE_CONFIG } from '../lib/homepageDefaults';
import { resolveHomepageContent } from '../lib/resolveArticleQuery';

// Always render fresh -- never statically cache this page -- so a Homepage
// Builder save (or a newly published article) shows up on the very next request.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getHomepageConfig() {
  try {
    const res = await fetch(`${API_BASE}/api/homepage-template`, { cache: 'no-store' });
    if (!res.ok) return DEFAULT_HOMEPAGE_CONFIG;
    const d = await res.json();
    return {
      ...DEFAULT_HOMEPAGE_CONFIG,
      ...d,
      content: { ...DEFAULT_HOMEPAGE_CONFIG.content, ...(d.content || {}) },
    };
  } catch {
    return DEFAULT_HOMEPAGE_CONFIG;
  }
}

export default async function Home() {
  const config = await getHomepageConfig();
  // Expands each section's query config (heroQuery, latestQuery, etc.) into
  // real, newest-first articles from Admin -> Articles.
  const resolvedContent = await resolveHomepageContent(config.content, API_BASE);

  return (
    <>
      <Header />
      <HomepageResolver config={{ activeTemplate: config.activeTemplate, content: resolvedContent }} />
      <Footer />
    </>
  );
}
