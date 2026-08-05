"use client";
// components/ViewTracker.jsx
// Fires a one-time "view" ping for the current article. Rendered by
// ArticlePageResolver.jsx (a Server Component can't itself run this --
// there's no client-side lifecycle on the server), so this is the one
// small client island on an otherwise server-rendered article page.
//
// Deliberately fire-and-forget: no loading state, no retry, no UI at all.
// A missed view ping is not worth showing an error or blocking anything
// for -- this exists purely to make Article.views (and therefore the
// Dashboard's "Total Views" card) reflect real traffic.
import { useEffect } from "react";
import { API_BASE } from "@/lib/apiConfig";

export default function ViewTracker({ slug }) {
  useEffect(() => {
    if (!slug) return;
    // navigator.sendBeacon is preferred here: it's designed exactly for
    // "fire this request even if the user immediately navigates away,"
    // which a plain fetch() can't guarantee. Falls back to fetch for
    // browsers/environments without sendBeacon support.
    const url = `${API_BASE}/api/articles/${encodeURIComponent(slug)}/view`;
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([], { type: "text/plain" }));
    } else {
      fetch(url, { method: "POST", keepalive: true }).catch(() => {});
    }
    // Only ever fire once per mount -- an article page doesn't remount on
    // its own, and we don't want a view counted again from, say, a parent
    // re-render caused by unrelated state elsewhere on the page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
