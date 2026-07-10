// components/ArticlePageResolver.jsx
// Server Component: picks the article's layout variation and renders it
// with the article data fetched by the page itself (see
// app/articles/[slug]/page.jsx). No client-side fetch/loading state --
// avoids the header/footer-then-content flash the old version had.
import ArticleTemplate1 from "./article-templates/ArticleTemplate1";
import ArticleTemplate2 from "./article-templates/ArticleTemplate2";
import ArticleTemplate3 from "./article-templates/ArticleTemplate3";
import ArticleTemplate4 from "./article-templates/ArticleTemplate4";
import { DEFAULT_ARTICLE_RELATED_CONTENT } from "@/lib/articleTemplateDefaults";

const TEMPLATES = {
  "variation-1": ArticleTemplate1,
  "variation-2": ArticleTemplate2,
  "variation-3": ArticleTemplate3,
  "variation-4": ArticleTemplate4,
};

// Normalizes a raw saved article (from the admin form / store) into the
// `{ category, tag, title, excerpt, author, publishedAt, heroImage,
// heroCaption, body, sagaSoFar }` shape every template expects.
export function normalizeArticle(raw) {
  return {
    layoutVariation: raw.layoutVariation || "variation-4",
    category: (raw.categoryName || raw.category || "").toUpperCase(),
    tag: (raw.tags && raw.tags[0]) || "",
    title: raw.title || "",
    excerpt: raw.excerpt || "",
    author: {
      name: raw.author?.name || "Futurism Staff",
      href: raw.author?.href || "#",
      role: raw.author?.role || "",
      avatar: raw.author?.avatar || "/images/author1.webp",
      bio: raw.author?.bio || "",
    },
    publishedAt: raw.date
      ? new Date(raw.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "",
    heroImage: raw.mainImage || "",
    heroCaption: raw.imageAlt || "",
    body: raw.content || [],
    sagaSoFar: raw.sagaSoFar || [],
  };
}

export default function ArticlePageResolver({ article }) {
  if (!article) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 py-24 text-center">
        <div>
          <h1 className="font-[family-name:var(--font-owners-xnarrow)] text-3xl font-black uppercase text-gray-900 mb-2">
            Article not found
          </h1>
          <p className="font-[family-name:var(--font-owners-text)] text-sm text-gray-500">
            This article may have been unpublished or the link is incorrect.
          </p>
        </div>
      </main>
    );
  }

  const variation = article.layoutVariation || "variation-4";
  const ActiveTemplate = TEMPLATES[variation] || ArticleTemplate4;

  return <ActiveTemplate article={article} related={DEFAULT_ARTICLE_RELATED_CONTENT} />;
}
