"use client";
// components/admin/SeoPreviewCard.jsx
// Shown in the Articles editor's SEO section. Purely a live preview of
// fields the admin is already editing (metaTitle, metaDescription,
// mainImage, slug) -- no new data, no backend calls, just "here's roughly
// how this will look when shared." Falls back to sensible placeholders
// for any field that's still empty, so the preview isn't blank while
// someone is mid-draft.
import { useState } from "react";
import { Search } from "lucide-react";
import { Twitter, Facebook } from "@/components/ui/BrandIcons";
import { SITE_URL } from "@/lib/apiConfig";

const TABS = [
  { key: "google", label: "Google", icon: Search },
  { key: "twitter", label: "Twitter / X", icon: Twitter },
  { key: "facebook", label: "Facebook / Slack", icon: Facebook },
];

function truncate(str, max) {
  if (!str) return "";
  return str.length > max ? `${str.slice(0, max - 1)}…` : str;
}

export default function SeoPreviewCard({ title, description, image, slug }) {
  const [tab, setTab] = useState("google");

  const displayTitle = title?.trim() || "Untitled article";
  const displayDescription = description?.trim() || "No meta description yet — add one above so search engines and social previews have something to show.";
  const displayUrl = `${SITE_URL.replace(/^https?:\/\//, "")}/articles/${slug?.trim() || "your-article-slug"}`;

  return (
    <div className="rounded-card border border-border bg-white overflow-hidden">
      <div className="flex border-b border-border">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[12px] font-medium transition-colors ${
                active ? "bg-primary-50 text-primary" : "text-ink-500 hover:bg-surface-soft"
              }`}
            >
              <Icon size={13} />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="p-4">
        {tab === "google" && (
          <div className="max-w-lg">
            <p className="text-[13px] text-[#1a0dab] dark:text-[#8ab4f8] leading-snug hover:underline cursor-pointer">
              {truncate(displayTitle, 60)}
            </p>
            <p className="text-[12px] text-[#006621] dark:text-[#8ab4f8]/70 mt-0.5">{displayUrl}</p>
            <p className="text-[12.5px] text-[#4d5156] dark:text-gray-400 mt-1 leading-snug">
              {truncate(displayDescription, 155)}
            </p>
          </div>
        )}

        {tab === "twitter" && (
          <div className="max-w-sm rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="aspect-[1.91/1] bg-gray-100 dark:bg-[#1c1c24] flex items-center justify-center">
              {image ? (
                <img src={image} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[12px] text-ink-400">No image set</span>
              )}
            </div>
            <div className="p-3">
              <p className="text-[11px] text-gray-500 dark:text-gray-400 uppercase">{displayUrl.split("/")[0]}</p>
              <p className="text-[13.5px] font-semibold text-gray-900 dark:text-gray-100 leading-snug mt-0.5">
                {truncate(displayTitle, 70)}
              </p>
              <p className="text-[12.5px] text-gray-500 dark:text-gray-400 leading-snug mt-0.5">
                {truncate(displayDescription, 125)}
              </p>
            </div>
          </div>
        )}

        {tab === "facebook" && (
          <div className="max-w-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="aspect-[1.91/1] bg-gray-100 dark:bg-[#1c1c24] flex items-center justify-center">
              {image ? (
                <img src={image} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[12px] text-ink-400">No image set</span>
              )}
            </div>
            <div className="p-2.5 bg-gray-50 dark:bg-[#1c1c24]">
              <p className="text-[10.5px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {displayUrl.split("/")[0]}
              </p>
              <p className="text-[13px] font-semibold text-gray-900 dark:text-gray-100 leading-snug mt-0.5 line-clamp-2">
                {truncate(displayTitle, 100)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
