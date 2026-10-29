import Header from '../components/Header';
import Footer from '../components/Footer';
import HomepageResolver from '../components/HomepageResolver';
import { API_BASE } from '../lib/apiConfig';
import { DEFAULT_HOMEPAGE_CONFIG } from '../lib/homepageDefaults';
import { resolveHomepageContent } from '../lib/resolveArticleQuery';
import { serverFetch, abortedSignal } from '../lib/serverFetch';

// Always render fresh -- never statically cache this page -- so a Homepage
// Builder save (or a newly published article) shows up on the very next request.
export const dynamic = 'force-dynamic';
export const revalidate = 0;
// Safety net so Vercel never kills this render mid-flight if the backend is slow.
export const maxDuration = 30;

// Returns { config, backendDown }. `backendDown` is true only when the
// request itself failed or timed out (e.g. Render free tier is asleep) -- NOT
// for a normal HTTP error response -- so the caller can skip the ~10 follow-up
// article requests that would just time out the same way.
async function getHomepageConfig() {
  try {
    const res = await serverFetch(`${API_BASE}/api/homepage-template`, { timeoutMs: 4000 });
    if (!res.ok) return { config: DEFAULT_HOMEPAGE_CONFIG, backendDown: false };
    const d = await res.json();
    return {
      config: {
        ...DEFAULT_HOMEPAGE_CONFIG,
        ...d,
        content: { ...DEFAULT_HOMEPAGE_CONFIG.content, ...(d.content || {}) },
      },
      backendDown: false,
    };
  } catch {
    return { config: DEFAULT_HOMEPAGE_CONFIG, backendDown: true };
  }
}

// Split out of Home() on purpose: Header, HomeContent and Footer are now
// sibling async components, so React renders them IN PARALLEL. Before, Home
// awaited all of its data first and only then rendered <Header/> and
// <Footer/>, which started their own backend requests afterwards -- the
// waits stacked up one after another instead of overlapping.
async function HomeContent() {
  const { config, backendDown } = await getHomepageConfig();

  // Expands each section's query config (heroQuery, latestQuery, etc.) into
  // real, newest-first articles from Admin -> Articles. If the backend didn't
  // answer at all, skip straight to the fallback content (an already-aborted
  // signal makes every article request fail instantly).
  const resolvedContent = await resolveHomepageContent(
    config.content,
    API_BASE,
    backendDown ? { signal: abortedSignal() } : {}
  );

  return <HomepageResolver config={{ activeTemplate: config.activeTemplate, content: resolvedContent }} />;
}

export default function Home() {
  return (
    <>
      <Header />
      <HomeContent />
      <Footer />
    </>
  );
}
