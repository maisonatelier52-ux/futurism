// lib/articleTemplateDefaults.js
// Descriptor for the 4 article page layout variations, plus default
// placeholder content for the sidebar/related sections every template
// shares (Most Popular, Around the Web, More in Category). This mirrors
// the pattern used by lib/homepageDefaults.js and lib/categoryPageDefaults.js.

export const ARTICLE_LAYOUT_OPTIONS = [
  {
    value: "variation-4",
    label: "Variation 4 (Default)",
    desc: "Widened hero + right sidebar",
    detail: "Full-width hero image, 8/4 content grid, Most Popular + sticky ad sidebar, Around the Web + More in Category grids below.",
    thumb: "📄",
  },
  {
    value: "variation-1",
    label: "Variation 1",
    desc: "Dark split hero + Saga So Far",
    detail: "Black split hero banner (text left, image right), left 'The Saga So Far' numbered timeline, right Most Popular + sticky newsletter box.",
    thumb: "🗞️",
  },
  {
    value: "variation-2",
    label: "Variation 2",
    desc: "Breadcrumb + share rail + Read Next",
    detail: "Home > Category breadcrumb, left share icons + Read Next mini-list, right Most Popular + newsletter box.",
    thumb: "📰",
  },
  {
    value: "variation-3",
    label: "Variation 3",
    desc: "Full-bleed hero + Table of Contents",
    detail: "Dark full-bleed hero with overlaid title, left auto-generated Table of Contents (from subheadings) + newsletter, right Most Popular + newsletter promo.",
    thumb: "📑",
  },
];

// Shared placeholder content for the sidebar/related sections. In a real
// deployment these would come from other real articles; kept as editable
// defaults here so every template has something sensible to render.
export const DEFAULT_ARTICLE_RELATED_CONTENT = {
  mostPopular: [
    { id: 1, category: "SPACEX", title: "SpaceX Investors Are Losing a Colossal Amount of Money", author: "Victor Tangermann", href: "#" },
    { id: 2, category: "MARS", title: 'NASA Rover Finds "Complex Organic Matter" on Mars', author: "Victor Tangermann", href: "#" },
    { id: 3, category: "POLLUTION", title: "Volunteer Under Investigation for Cleaning Polluted River Without a License, Faces Two Years in Prison", author: "Joe Wilkins", href: "#" },
    { id: 4, category: "ARTIFICIAL INTELLIGENCE", title: "DuckDuckGo's AI Feature Is Telling Users That Trump Died of Rabies Earlier This Month", author: "Frank Landymore", href: "#" },
    { id: 5, category: "STARSHIP", title: "NASA Has a Major Problem Threatening Its Entire Moon Plans", author: "Victor Tangermann", href: "#" },
  ],
  aroundTheWeb: [
    { id: 1, title: "We've Got Your Eyes Covered - Find Your Perfect Pair!", image: "/images/img1.webp", href: "#" },
    { id: 2, title: "Get Ready to Rethink Your Workplace Shoe Game", image: "/images/img2.webp", href: "#" },
    { id: 3, title: "The Surprising Link Between Your Pillowcase and Aging", image: "/images/img3.webp", href: "#" },
    { id: 4, title: "Take on a Challenge: Make Pasta Al Limone at Home", image: "/images/img4.webp", href: "#" },
    { id: 5, title: "The Smart Approach to Selling Your Home", image: "/images/img5.webp", href: "#" },
    { id: 6, title: "How Much Money Should You Have Before Hiring a Financial Advisor?", image: "/images/img6.webp", href: "#" },
    { id: 7, title: "Achieve Total Peace of Mind With Ring Devices", image: "/images/img7.webp", href: "#" },
    { id: 8, title: "Support Your Neighbors and Get Involved With Food Rescue", image: "/images/img1.webp", href: "#" },
  ],
  moreInCategory: [
    { id: 1, category: "ARTIFICIAL INTELLIGENCE", title: "CEO Receives Violent Threats After Kicking Off AI Layoffs", author: "Frank Landymore", image: "/images/img7.webp", href: "#" },
    { id: 2, category: "FUTURE SOCIETY", title: "Bernie Sanders Announces Plan to Seize Half of AI Industry for the Public Good", author: "Victor Tangermann", image: "/images/img6.webp", href: "#" },
    { id: 3, category: "ETHICS", title: 'New York Times Roasted for "Profiling" the "AI-Generated Actress" Tilly Northwood', author: "Frank Landymore", image: "/images/img5.webp", href: "#" },
    { id: 4, category: "FUTURE SOCIETY", title: "Bill Gates Offers Bizarre Excuse About Epstein", author: "Victor Tangermann", image: "/images/img4.webp", href: "#" },
    { id: 5, category: "FACIAL RECOGNITION", title: "Innocent Man Freed After Spending Over 50 Days in Jail Due to Horribly Inaccurate AI Facial Recognition Tech", author: "Joe Wilkins", image: "/images/img3.webp", href: "#" },
    { id: 6, category: "FUTURE SOCIETY", title: "Investigators Questioning Bill Gates Over Ties to Jeffrey Epstein", author: "Victor Tangermann", image: "/images/img2.webp", href: "#" },
    { id: 7, category: "CRYPTOCURRENCY", title: "Disaster Strikes When Meme Coin Pays Man to Tattoo Its Name on His Forehead, But They Misspelled It", author: "Victor Tangermann", image: "/images/img1.webp", href: "#" },
    { id: 8, category: "ARTIFICIAL INTELLIGENCE", title: 'Argentina Moves to Legalize "Non-Human Corporations" Run by AI', author: "Frank Landymore", image: "/images/img3.webp", href: "#" },
  ],
};

// Variation 1 only: "The Saga So Far" numbered timeline. Editable per
// article from the admin form when Variation 1 is selected; falls back to
// this default if the article hasn't set its own.
export const DEFAULT_SAGA_SO_FAR = [
  { id: 1, text: 'The endless march of "innovation"' },
  { id: 2, text: "What Meta is really building" },
  { id: 3, text: "The track record speaks for itself" },
  { id: 4, text: "Innovation or digital junk?" },
  { id: 5, text: "What comes next" },
];
