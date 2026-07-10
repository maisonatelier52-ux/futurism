// lib/api.js — Mock data layer

const LATENCY = 320;

const STORAGE_KEYS = {
  header: "htn_header_v2",
  footer: "htn_footer_v3",
  homepage: "htn_homepage_v2",
};

function delay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY));
}

function readLocal(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal(key, value) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

let uid = 0;
export function makeId(prefix = "id") {
  uid += 1;
  return `${prefix}_${Date.now().toString(36)}_${uid}`;
}

// ---------------------------------------------------------------------------
// DEFAULT HEADER CONFIG
// ---------------------------------------------------------------------------
export const DEFAULT_HEADER = {
  template: "magazine-blue",
  logo: {
    text: "Futurism",
    type: "text",
    image: "",
    font: "sans",
    size: 42,
    color: "#111111",
    letterSpacing: 0,
    fontWeight: "700",
  },
  masthead: {
    quote: '"Clarity, depth, and the courage to ask harder questions."',
    tagline: "Power • Technology • Profiles • Wealth • Finance • Lifestyle • Culture",
    establishedText: "Est. 1998 • London • New York • Singapore",
  },
  menu: [
    { id: "m0", label: "Home", url: "/", type: "link", children: [] },
    { id: "m1", label: "Power", url: "/power", type: "link", children: [] },
    { id: "m2", label: "Technology", url: "/technology", type: "link", children: [] },
    { id: "m5", label: "Profiles", url: "/profiles", type: "link", children: [] },
    { id: "m6", label: "Interviews", url: "/interviews", type: "link", children: [] },
    {
      id: "m3",
      label: "Power Lists",
      url: "/power-lists",
      type: "dropdown",
      children: [
        { id: "m3-1", label: "Billionaires", url: "/power-lists/billionaires" },
        { id: "m3-2", label: "Markets", url: "/power-lists/markets" },
      ],
    },
    { id: "m7", label: "Companies", url: "/companies", type: "link", children: [] },
    { id: "m8", label: "Media", url: "/media", type: "link", children: [] },
  ],
  menuStyle: {
    hoverEffect: "red-underline",
    hoverColor: "#b30000",
    fontWeight: "700",
    fontSize: 12,
    uppercase: true,
    letterSpacing: 0.5,
  },
  topBar: {
    enabled: true,
    bg: "#111111",
    textColor: "#ffffff",
    dateFormat: "full",
    leftText: "",
    showSocialIcons: true,
    socialPlatforms: ["instagram", "twitter", "facebook", "linkedin", "youtube"],
    rightItems: ["socialIcons", "eEdition", "login", "subscribe"],
    rightItemColor: "#9ca3af",
    rightItemHoverColor: "#ffffff",
    subscribeBg: "#7f1d1d",
    subscribeHoverBg: "#c0392b",
    subscribeTextColor: "#ffffff",
    subscribeRadius: 6,
  },
  rightSide: {
    searchEnabled: true,
    loginButton: true,
    subscribeButton: true,
    socialIcons: false,
    eEditionLink: true,
  },
  breakingNews: {
    enabled: true,
    style: "red",
    bg: "#b30000",
    labelTextColor: "#ffffff",
    textColor: "#ffffff",
    tickerBg: "#111111",
    labelText: "BREAKING",
    speed: 80,
    items: [
      "Markets close mixed as trade data exceeds forecasts",
      "IMF revises global growth outlook citing persistent supply chain fragility",
      "Central banks signal coordinated pause on rate hikes",
    ],
  },
  mobile: {
    layout: "drawer",
    showSearch: true,
    showLogin: true,
    showSubscribe: true,
    showSocial: false,
  },
  behavior: {
    sticky: true,
    shadowOnScroll: true,
    hideOnScrollDown: false,
    transparent: false,
    megaMenu: false,
    dividerBelow: true,
  },
};

// ---------------------------------------------------------------------------
// DEFAULT FOOTER CONFIG
// ---------------------------------------------------------------------------
export const DEFAULT_FOOTER = {
  layout: "5-column",
  theme: {
    bg: "#111111",
    text: "#ffffff",
    link: "#8e8e8e",
    hover: "#f4f4f4",
    border: "#2a2a2a",
    accentLine: "#5c1111",
    taglineColor: "#6f665f",
  },
  branding: {
    text: "Futurism",
    type: "text",
    image: null,
    tagline: "Clarity, depth, and the courage to ask harder questions.",
    font: "sans",
    size: 56,
    color: "#ffffff",
    taglineFont: "cormorant",
  },
  columns: [
    {
      id: "c1", title: "News", type: "links", width: 20,
      links: [
        { id: "c1-1", label: "World", url: "/world" },
        { id: "c1-2", label: "Business", url: "/business" },
        { id: "c1-3", label: "Politics", url: "/politics" },
        { id: "c1-4", label: "Technology", url: "/technology" },
        { id: "c1-5", label: "Science", url: "/science" },
      ],
    },
    {
      id: "c2", title: "Opinion", type: "links", width: 20,
      links: [
        { id: "c2-1", label: "Editorials", url: "/editorials" },
        { id: "c2-2", label: "Columns", url: "/columns" },
        { id: "c2-3", label: "Letters", url: "/letters" },
        { id: "c2-4", label: "Contributors", url: "/contributors" },
      ],
    },
    {
      id: "c3", title: "Culture", type: "links", width: 20,
      links: [
        { id: "c3-1", label: "Arts", url: "/arts" },
        { id: "c3-2", label: "Books", url: "/books" },
        { id: "c3-3", label: "Film", url: "/film" },
        { id: "c3-4", label: "Music", url: "/music" },
      ],
    },
    {
      id: "c4", title: "About", type: "links", width: 20,
      links: [
        { id: "c4-1", label: "About Us", url: "/about" },
        { id: "c4-2", label: "Careers", url: "/careers" },
        { id: "c4-3", label: "Advertise", url: "/advertise" },
        { id: "c4-4", label: "Contact Us", url: "/contact" },
      ],
    },
    {
      id: "c5", title: "Subscribe", type: "links", width: 20,
      links: [
        { id: "c5-1", label: "Digital Edition", url: "/digital-edition" },
        { id: "c5-2", label: "Print Edition", url: "/print-edition" },
        { id: "c5-3", label: "Newsletters", url: "/newsletters" },
        { id: "c5-4", label: "Podcasts", url: "/podcasts" },
      ],
    },
  ],
  newsletter: {
    enabled: false,
    title: "Subscribe to our newsletter",
    placeholder: "Enter your email address",
    buttonText: "Subscribe",
    successMessage: "Thank you for subscribing!",
  },
  social: [
    { id: "s1", platform: "twitter", url: "#", label: "X (Twitter)" },
    { id: "s2", platform: "linkedin", url: "#", label: "LinkedIn" },
    { id: "s3", platform: "instagram", url: "#", label: "Instagram" },
    { id: "s4", platform: "youtube", url: "#", label: "YouTube" },
    { id: "s5", platform: "facebook", url: "#", label: "Facebook" },
  ],
  bottomBar: {
    copyright: "© 2026 Futurism Ltd. All rights reserved.",
    showCopyright: true,
    showMenu: true,
    autoYear: true,
    showPrivacy: true,
    showTerms: true,
    showCookie: true,
    showAccessibility: true,
    showLogoMark: true,
    logoMarkSource: "initial",
    logoMarkImage: null,
    links: [
      { id: "b1", label: "Privacy Policy", url: "/privacy-policy" },
      { id: "b2", label: "Terms of Service", url: "/terms-of-use" },
      { id: "b3", label: "Cookie Policy", url: "/cookie-policy" },
      { id: "b4", label: "Accessibility", url: "/accessibility" },
    ],
  },
  depth: { paddingTop: 80, paddingBottom: 32, columnGap: 60 },
  mobile: { layout: "accordion", defaultExpanded: false, showBorders: true, fontSize: 13, collapseAnimation: true },
};

export const DEFAULT_HOMEPAGE = {
  page: "home",
  blocks: [
    { id: "b1", type: "breakingNews", data: { limit: 5, bg: "#111111", labelBg: "#cc0000", textColor: "#ffffff", labelText: "BREAKING", speed: 80, enabled: true, labelStyle: "badge" } },
    { id: "b2", type: "heroStory", data: { articleId: "", title: "Global Markets Rally As Inflation Fears Ease", subheadline: "Central banks signal coordinated pause on rate hikes", category: "BUSINESS", ctaLabel: "Read More", ctaUrl: "#", bgImage: "", overlayOpacity: 50, fontFamily: "sans", titleSize: 28, titleWeight: "bold", titleColor: "#ffffff", alignment: "left", paddingTop: 48, paddingBottom: 48, showCategory: true, showCta: true } },
    {
      id: "b3",
      type: "threeColumnLayout",
      data: {
        leftTitle: "Most Read",
        leftItems: [
          { id: "l1", label: "Global Markets Rally As Inflation Fears Ease" },
          { id: "l2", label: "Power Brokers of the Year: The 50 Who Shape Our World" },
          { id: "l3", label: "Real Estate Outlook 2026: Buy, Sell, or Wait?" },
          { id: "l4", label: "Tech Giants Face New Antitrust Pressure in Brussels" },
          { id: "l5", label: "Opinion: Why Central Banks Are Losing the Plot" },
        ],
        leftShowNumbers: true,
        centerTitle: "Latest News",
        centerCategory: "All",
        centerLimit: 5,
        centerLayout: "list",
        rightTitle: "In Brief",
        rightShowAd: true,
        rightAdSize: "sidebar",
        rightShowNewsletter: true,
        rightNewsletterHeading: "Stay ahead of the story",
        bg: "#ffffff",
        border: "#e5e7eb",
        padding: 24,
        borderRadius: 12,
        widthMode: "equal",
      },
    },
    { id: "b4", type: "categorySection", data: { category: "Power", layout: "grid", limit: 6, title: "", bg: "#ffffff", textColor: "#111111", showImages: true } },
  ],
};

// Header
export async function getHeader() {
  return delay(readLocal(STORAGE_KEYS.header, DEFAULT_HEADER));
}
export async function saveHeader(data) {
  writeLocal(STORAGE_KEYS.header, data);
  return delay({ ok: true, data });
}

// Footer
export async function getFooter() {
  const saved = readLocal(STORAGE_KEYS.footer, null);
  if (!saved) return delay(DEFAULT_FOOTER);
  const merged = {
    ...DEFAULT_FOOTER,
    ...saved,
    theme: { ...DEFAULT_FOOTER.theme, ...(saved.theme || {}) },
    branding: { ...DEFAULT_FOOTER.branding, ...(saved.branding || {}) },
    newsletter: { ...DEFAULT_FOOTER.newsletter, ...(saved.newsletter || {}) },
    bottomBar: { ...DEFAULT_FOOTER.bottomBar, ...(saved.bottomBar || {}) },
    depth: { ...DEFAULT_FOOTER.depth, ...(saved.depth || {}) },
    mobile: { ...DEFAULT_FOOTER.mobile, ...(saved.mobile || {}) },
  };
  return delay(merged);
}
export async function saveFooter(data) {
  writeLocal(STORAGE_KEYS.footer, data);
  return delay({ ok: true, data });
}

// Homepage
export async function getHomepage() {
  return delay(readLocal(STORAGE_KEYS.homepage, DEFAULT_HOMEPAGE));
}
export async function saveHomepage(data) {
  writeLocal(STORAGE_KEYS.homepage, data);
  return delay({ ok: true, data });
}
