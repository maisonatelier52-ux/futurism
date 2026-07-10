// lib/authorTemplateDefaults.js
// Descriptor for the 4 author page layout variations, plus default content
// for the extra fields some variations need (stat row, quote, background,
// beyond-writing) that don't exist in the base author record. Mirrors the
// pattern used by lib/homepageDefaults.js / lib/categoryPageDefaults.js /
// lib/articleTemplateDefaults.js.

export const AUTHOR_LAYOUT_OPTIONS = [
  {
    value: "variation-4",
    label: "Variation 4 (Default)",
    desc: "Centered profile + stacked sections",
    detail: "Centered avatar, name, role, About/Education/Notable Works stacked, More From grid + pagination.",
    thumb: "📄",
  },
  {
    value: "variation-1",
    label: "Variation 1",
    desc: "Bio hero + stat row + Notable Works strip",
    detail: "Photo + bio hero with email/location, gray About band with pull-quote, Education/Years/Focus Areas stat row, black Notable Works strip, More From with category filter sidebar.",
    thumb: "🗞️",
  },
  {
    value: "variation-2",
    label: "Variation 2",
    desc: "Full black hero + Latest From strip",
    detail: "Full-width black hero (photo, bio, Education + Notable Works list), Quote/About/Background/Beyond Writing row, dark Latest From horizontal strip, More From grid.",
    thumb: "⬛",
  },
  {
    value: "variation-3",
    label: "Variation 3",
    desc: "Minimal hero + Recent Articles",
    detail: "Small avatar hero with inline bio, Recent Articles list + pull-quote side by side, More From grid + pagination.",
    thumb: "📰",
  },
];

// Variation 1: Education / Years at Futurism / Focus Areas stat row.
export const DEFAULT_AUTHOR_STATS = {
  education: "McGill University",
  yearsSince: "2017",
  focusAreas: "AI, Space, Transport, Policy, Science",
};

// Variation 1 & 3: a short pull-quote attributed to the author.
export const DEFAULT_AUTHOR_QUOTE =
  "The future isn't something we enter. The future is something we build — one story, one question, one idea at a time.";

// Variation 2 only: three short blurbs (About / Background / Beyond Writing).
export const DEFAULT_AUTHOR_EXTRAS = {
  background: "I spent my childhood living in Manila, the Philippines, and Geneva, Switzerland, attended McGill University, and now live in Toronto, Canada.",
  beyondWriting: "When I'm not writing, I'm a small photography studio. In my free time, I'm an avid gardener, foodie, and craft beer lover.",
};

// Shared fallback article list for the public preview / builder preview,
// used only until real articles by this author exist.
export const DEFAULT_AUTHOR_ARTICLES = [
  { id: 1, category: "FUTURE SOCIETY", title: "Mark Zuckerberg Is Selflessly Building Yet Another Horrible Product Nobody Asked For", image: "/images/img1.webp", href: "#" },
  { id: 2, category: "ETHICS", title: "Massive Data Center Cooks Nearby Residents Alive Amidst Deadly Heatwave", image: "/images/img2.webp", href: "#" },
  { id: 3, category: "STARSHIP", title: "NASA Has a Major Problem Threatening Its Entire Moon Plans", image: "/images/img3.webp", href: "#" },
  { id: 4, category: "ARTIFICIAL INTELLIGENCE", title: "If There Wasn't Enough Opposition to AI Data Centers Already, Now They're Supercharging Inflation", image: "/images/img4.webp", href: "#" },
  { id: 5, category: "MARS", title: "NASA Rover Finds Complex Organic Matter on Mars", image: "/images/img5.webp", href: "#" },
  { id: 6, category: "ETHICS", title: "Peppa Pig Owner Demands Child Actors Sign Away Voice Rights to AI", image: "/images/img6.webp", href: "#" },
  { id: 7, category: "ETHICS", title: "Softbank CEO Who's Invested $64 Billion in OpenAI Says It's Blasphemy to Mention the AI Bubble", image: "/images/img7.webp", href: "#" },
  { id: 8, category: "ETHICS", title: "Customers Are Ditching Companies That Force Them to Talk to an AI Agent", image: "/images/img1.webp", href: "#" },
];

export const DEFAULT_AUTHOR_CATEGORY_FILTERS = [
  "All Articles", "AI & Robotics", "Tech", "Science", "Space",
  "Lifestyle", "Business", "Future Society", "Ethics", "Off-World", "Treatments",
];
