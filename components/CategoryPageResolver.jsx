"use client";
import { useEffect, useState } from "react";
import CategoryTemplate1 from "./category-templates/CategoryTemplate1";
import CategoryTemplate2 from "./category-templates/CategoryTemplate2";
import CategoryTemplate3 from "./category-templates/CategoryTemplate3";
import CategoryTemplate4 from "./category-templates/CategoryTemplate4";
import { DEFAULT_CATEGORY_PAGE_CONFIG } from "@/lib/categoryPageDefaults";
import { apiFetch } from "@/lib/apiConfig";

const TEMPLATES = {
  "template-1": CategoryTemplate1,
  "template-2": CategoryTemplate2,
  "template-3": CategoryTemplate3,
  "template-4": CategoryTemplate4,
};

export default function CategoryPageResolver({ slug }) {
  const [config, setConfig] = useState(DEFAULT_CATEGORY_PAGE_CONFIG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    // `cache: "no-store"` opts out of the browser HTTP cache; the `_ts`
    // query param additionally guarantees a byte-different URL on every
    // request, which defeats any caching layer (proxy, CDN, service worker,
    // bfcache re-fetch) that might ignore Cache-Control headers.
    const url = `/api/category-page-template?slug=${encodeURIComponent(slug)}&_ts=${Date.now()}`;

    apiFetch(url, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (active && d.config) setConfig(d.config);
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) return null;

  const ActiveTemplate = TEMPLATES[config?.activeTemplate] || CategoryTemplate4;
  return <ActiveTemplate data={config?.content || DEFAULT_CATEGORY_PAGE_CONFIG.content} />;
}
