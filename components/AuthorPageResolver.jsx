// components/AuthorPageResolver.jsx
// Server Component: picks the author's layout variation and renders it with
// the author + articles data fetched by the page itself (see
// app/authors/[slug]/page.jsx). No client-side fetch/loading state --
// avoids the header/footer-then-content flash the old version had.
import AuthorTemplate1 from "./author-templates/AuthorTemplate1";
import AuthorTemplate2 from "./author-templates/AuthorTemplate2";
import AuthorTemplate3 from "./author-templates/AuthorTemplate3";
import AuthorTemplate4 from "./author-templates/AuthorTemplate4";
import { DEFAULT_AUTHOR_ARTICLES } from "@/lib/authorTemplateDefaults";

const TEMPLATES = {
  "variation-1": AuthorTemplate1,
  "variation-2": AuthorTemplate2,
  "variation-3": AuthorTemplate3,
  "variation-4": AuthorTemplate4,
};

export default function AuthorPageResolver({ author, articles, pagination }) {
  if (!author) {
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
