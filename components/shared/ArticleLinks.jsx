// components/shared/ArticleLinks.jsx
// Tiny shared link helpers used across every homepage/category/author/
// article template so author names, category tags, and share buttons are
// always real, working links -- and degrade gracefully to plain text if
// the data doesn't provide an href yet (e.g. content saved before these
// fields existed).
"use client";

// Renders "By <author name>" with the name linked to /authors/[slug] when
// authorHref is available. `stopPropagation` is used because this is
// frequently nested inside a larger <a> (the article card itself) --
// nested <a> tags aren't valid HTML, so most callers place this OUTSIDE
// the outer card link (see each template for the exact structure).
export function AuthorByline({ author, authorHref, className = "text-gray-500", nameClassName = "font-semibold text-gray-700" }) {
  if (!author) return null;
  return (
    <span className={className}>
      By{" "}
      {authorHref ? (
        <a href={authorHref} className={`${nameClassName} hover:underline`} onClick={(e) => e.stopPropagation()}>
          {author}
        </a>
      ) : (
        <span className={nameClassName}>{author}</span>
      )}
    </span>
  );
}

// Renders a category/tag pill linked to /category/[slug] when
// categoryHref is available.
export function CategoryTag({ category, categoryHref, className = "" }) {
  if (!category) return null;
  return categoryHref ? (
    <a href={categoryHref} className={`${className} hover:underline`} onClick={(e) => e.stopPropagation()}>
      {category}
    </a>
  ) : (
    <span className={className}>{category}</span>
  );
}

// Renders real social share links (Facebook, X, LinkedIn, email) for an
// article, using standard share-intent URLs instead of dead placeholder
// hrefs. `url` should be the article's absolute canonical URL.
export function ShareIcons({ title, url, variant = "dark" }) {
  const encodedUrl = encodeURIComponent(url || "");
  const encodedTitle = encodeURIComponent(title || "");

  const links = [
    { label: "f", name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: "𝕏", name: "X", href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}` },
    { label: "in", name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
    { label: "✉", name: "Email", href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}` },
  ];

  const cls =
    variant === "dark"
      ? "w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-[11px] hover:bg-red-600 transition-colors"
      : "w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-[10px] text-gray-600 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors";

  return (
    <div className={variant === "dark" ? "flex items-center gap-2" : "flex flex-col items-center gap-3"}>
      {links.map((link) => (
        <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" title={`Share on ${link.name}`} className={cls}>
          {link.label}
        </a>
      ))}
    </div>
  );
}
