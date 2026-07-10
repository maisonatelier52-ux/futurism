// components/article-templates/ArticleBody.jsx
// Shared content-block renderer, used by all 4 article layout templates so
// the same admin-authored blocks (paragraph, subheading, pullquote, image,
// at_a_glance, faq, readmore) render consistently everywhere -- only the
// surrounding page chrome differs between variations.
"use client";

export default function ArticleBody({ blocks, quoteColor = "text-red-600" }) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="flex flex-col gap-5">
      {blocks.map((block, i) => {
        if (block.type === "paragraph") {
          return (
            <p key={i} className="font-[family-name:var(--font-owners-text)] text-base text-gray-800 leading-relaxed">
              {block.text}
            </p>
          );
        }

        if (block.type === "subheading") {
          return (
            <h2
              key={i}
              id={slugifyHeading(block.text)}
              className="font-[family-name:var(--font-owners-xnarrow)] text-2xl font-black uppercase text-gray-900 mt-2 scroll-mt-24"
            >
              {block.text}
            </h2>
          );
        }

        if (block.type === "pullquote") {
          return (
            <blockquote key={i} className="border-l-4 border-current pl-5 py-1 my-2">
              <p className={`font-[family-name:var(--font-bitter)] italic text-xl leading-snug ${quoteColor}`}>
                "{block.text}"
              </p>
              {block.attribution && (
                <cite className="block not-italic font-[family-name:var(--font-owners-text)] text-xs text-gray-500 mt-2">
                  — {block.attribution}
                </cite>
              )}
            </blockquote>
          );
        }

        if (block.type === "image") {
          return (
            <figure key={i} className="my-2">
              <div className="w-full overflow-hidden bg-gray-100">
                <img src={block.src} alt={block.alt || block.caption || ""} className="w-full h-auto object-cover" />
              </div>
              {block.caption && (
                <figcaption className="font-[family-name:var(--font-owners-text)] text-[10px] text-gray-400 mt-1.5">
                  {block.caption}
                </figcaption>
              )}
            </figure>
          );
        }

        if (block.type === "at_a_glance") {
          return (
            <div key={i} className="border border-gray-200 bg-gray-50 rounded-lg p-5 my-2">
              <h3 className="font-[family-name:var(--font-owners-xnarrow)] text-lg font-black uppercase text-gray-900">
                {block.glanceTitle || "At a glance"}
              </h3>
              {block.glanceSubtitle && (
                <p className="font-[family-name:var(--font-owners-text)] text-xs text-gray-500 mt-1 mb-3">{block.glanceSubtitle}</p>
              )}
              <dl className="divide-y divide-gray-200 mt-2">
                {(block.glanceRows || []).map((row, ri) => (
                  <div key={ri} className="flex justify-between gap-4 py-2 text-sm">
                    <dt className="font-semibold text-gray-700 shrink-0">{row.label}</dt>
                    <dd className="text-gray-600 text-right">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          );
        }

        if (block.type === "faq") {
          return (
            <div key={i} className="my-2">
              <h3 className="font-[family-name:var(--font-owners-xnarrow)] text-lg font-black uppercase text-gray-900 mb-3">
                {block.faqTitle || "Frequently asked questions"}
              </h3>
              <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
                {(block.faqItems || []).map((item, fi) => (
                  <details key={fi} className="group py-3">
                    <summary className="font-semibold text-sm text-gray-900 cursor-pointer list-none flex justify-between items-center gap-3">
                      {item.question}
                      <span className="text-gray-400 group-open:rotate-45 transition-transform text-lg leading-none">+</span>
                    </summary>
                    <p className="font-[family-name:var(--font-owners-text)] text-sm text-gray-600 leading-relaxed mt-2">{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          );
        }

        if (block.type === "readmore") {
          return (
            <p key={i} className="font-[family-name:var(--font-owners-text)] text-sm text-gray-700 leading-relaxed">
              <span className="font-black">{block.label} </span>
              <a href={block.href || "#"} className="font-semibold italic underline text-gray-800 hover:text-red-600">
                {block.text}
              </a>
            </p>
          );
        }

        return null;
      })}
    </div>
  );
}

// Derives a stable #anchor id from a subheading's text, used by Variation 3's
// auto-generated Table of Contents to link straight to that heading.
export function slugifyHeading(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Pulls out every subheading block as { text, id } pairs -- used to build
// Variation 3's Table of Contents without needing a separate admin field.
export function extractHeadings(blocks) {
  return (blocks || [])
    .filter((b) => b.type === "subheading" && b.text?.trim())
    .map((b) => ({ text: b.text, id: slugifyHeading(b.text) }));
}
