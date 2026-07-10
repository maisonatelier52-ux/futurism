'use client';
import { useEffect, useState } from 'react';
import HomepageTemplate1 from './homepage-templates/HomepageTemplate1';
import HomepageTemplate2 from './homepage-templates/HomepageTemplate2';
import HomepageTemplate3 from './homepage-templates/HomepageTemplate3';
import HomepageTemplate4 from './homepage-templates/HomepageTemplate4';
import { DEFAULT_HOMEPAGE_CONFIG } from '../lib/homepageDefaults';
import { apiFetch } from '../lib/apiConfig';

const TEMPLATES = {
  'template-1': HomepageTemplate1,
  'template-2': HomepageTemplate2,
  'template-3': HomepageTemplate3,
  'template-4': HomepageTemplate4,
};

export default function HomepageResolver() {
  const [config, setConfig] = useState(DEFAULT_HOMEPAGE_CONFIG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    // `cache: "no-store"` plus a timestamped query param defeats any
    // caching layer (browser HTTP cache, proxy, bfcache) so a Homepage
    // Builder save is reflected on the very next page load.
    const url = `/api/homepage-template?_ts=${Date.now()}`;
    apiFetch(url, { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (active && d) {
          setConfig({
            ...DEFAULT_HOMEPAGE_CONFIG,
            ...d,
            content: {
              ...DEFAULT_HOMEPAGE_CONFIG.content,
              ...(d.content || {}),
            },
          });
        }
      })
      .catch(() => {}) // falls back to default config
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  if (loading) return null;

  const ActiveTemplate = TEMPLATES[config.activeTemplate] || HomepageTemplate1;
  return <ActiveTemplate data={config.content || DEFAULT_HOMEPAGE_CONFIG.content} />;
}
