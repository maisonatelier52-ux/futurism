"use client";
import { useEffect, useState } from "react";
import AuthorTemplate1 from "./author-templates/AuthorTemplate1";
import AuthorTemplate2 from "./author-templates/AuthorTemplate2";
import AuthorTemplate3 from "./author-templates/AuthorTemplate3";
import AuthorTemplate4 from "./author-templates/AuthorTemplate4";
import { DEFAULT_AUTHOR_ARTICLES } from "@/lib/authorTemplateDefaults";
import { apiFetch } from "@/lib/apiConfig";

const TEMPLATES = {
  "variation-1": AuthorTemplate1,
  "variation-2": AuthorTemplate2,
  "variation-3": AuthorTemplate3,
  "variation-4": AuthorTemplate4,
};

export default function AuthorPageResolver({ slug }) {
  const [data, setData] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFound(false);

    apiFetch(`/api/authors/${encodeURIComponent(slug)}?_ts=${Date.now()}`, { cache: "no-store" })
      .then(async (r) => {
        if (r.status === 404) {
          if (active) setNotFound(true);
          return null;
        }
        return r.json();
      })
      .then((d) => {
        if (active && d?.author) setData(d);
      })
      .catch(() => {
        if (active) setNotFound(true);
      })
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) return null;

  if (notFound || !data) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 py-24 text-center">
        <div>
          <h1 className="font-[family-name:var(--font-owners-xnarrow)] text-3xl font-black uppercase text-gray-900 mb-2">
            Author not found
          </h1>
          <p className="font-[family-name:var(--font-owners-text)] text-sm text-gray-500">
            This author profile may have been removed or the link is incorrect.
          </p>
        </div>
      </main>
    );
  }

  const { author, articles, pagination } = data;
  const variation = author.layoutVariation || "variation-4";
  const ActiveTemplate = TEMPLATES[variation] || AuthorTemplate4;

  return (
    <ActiveTemplate
      author={author}
      articles={articles?.length ? articles : DEFAULT_AUTHOR_ARTICLES}
      pagination={pagination || { currentPage: 1, totalPages: 1 }}
    />
  );
}
