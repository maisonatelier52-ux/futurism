// lib/store/memoryStore.js
//
// Temporary in-memory data layer used while MongoDB is not configured.
// All admin API routes read/write through this instead of connectDB().
//
// LIMITATION: data resets every time the dev server restarts (it's just a
// JS object living in process memory, not a real database). This is
// intentional — it lets every admin page work with zero setup. When you're
// ready to persist data for real, reconnect lib/mongodb.js and swap these
// functions back to the mongoose-model versions (the originals are kept
// commented in each route.js file for reference).

import { randomUUID } from 'crypto';

// `global` survives Hot Module Reload in Next.js dev mode, so data doesn't
// vanish on every file save — only on a full server restart.
const g = globalThis;

if (!g.__memoryStore) {
  g.__memoryStore = {
    articles: [],
    authors: [],
    categories: [],
    headerConfig: null,
    footerConfig: null,
    homepageConfig: null,
    siteSettings: null,
  };
}

export const store = g.__memoryStore;

export function newId() {
  return randomUUID();
}

// ─── Default configs (same shape/defaults as the old Mongoose models) ──────

// DEFAULT_HEADER_CONFIG is imported from lib/headerDefaults.js
export { DEFAULT_HEADER_CONFIG } from '../headerDefaults.js';
export const DEFAULT_FOOTER_CONFIG = {
  _id: 'footer-config',
  activeTemplate: 'template-1',
  logo: '/images/logo.webp',
  newsletter: {
    heading: "Sign up to see the future,\ntoday",
    subtext: "Can't-miss innovations from the bleeding edge of science and tech",
    buttonLabel: 'SIGN UP',
    bgColor: '#1f2326',
  },
  centerLinks: [
    { name: 'ABOUT US', href: '#' },
    { name: 'EDITORIAL STANDARDS', href: '#' },
    { name: 'CONTACTS', href: '#' },
  ],
  legalLinks: [
    { name: 'PRIVACY POLICY', href: '#' },
    { name: 'TERMS & CONDITIONS', href: '#' },
    { name: 'DMCA POLICY', href: '#' },
    { name: 'SITEMAP', href: '#' },
  ],
  socialLinks: [
    { platform: 'instagram', href: '#' },
    { platform: 'twitter', href: '#' },
    { platform: 'substack', href: '#' },
  ],
  disclaimer: 'ARTICLES MAY CONTAIN AFFILIATE LINKS WHICH ENABLE US TO SHARE IN THE REVENUE OF ANY PURCHASES MADE. REGISTRATION ON OR USE OF THIS SITE CONSTITUTES ACCEPTANCE OF OUR TERMS OF SERVICE.',
  copyright: '© 2026 ALL RIGHTS RESERVED.',
  categoryLinks: [
    { name: 'ADVANCED TRANSPORT', href: '#' },
    { name: 'ARTIFICIAL INTELLIGENCE', href: '#' },
    { name: 'FUTURE SOCIETY', href: '#' },
    { name: 'HEALTH & MEDICINE', href: '#' },
    { name: 'ROBOTS AND MACHINES', href: '#' },
    { name: 'SCIENCE & ENERGY', href: '#' },
    { name: 'SPACE', href: '#' },
  ],
};

export const DEFAULT_HOMEPAGE_CONFIG = {
  _id: 'homepage-config',
  sections: [
    { key: 'featured',         label: 'Featured Articles',    visible: true, order: 0 },
    { key: 'topStories',       label: 'Top Stories',          visible: true, order: 1 },
    { key: 'categorySections', label: 'Category Sections',    visible: true, order: 2 },
    { key: 'theFeed',          label: 'The Feed + Originals', visible: true, order: 3 },
  ],
};

export const DEFAULT_SITE_SETTINGS = {
  _id: 'site-settings',
  siteName: 'Futurism',
  logo: '/images/logo.webp',
  favicon: '/favicon.ico',
  primaryColor: '#ef4444',
  accentColor: '#1f2326',
  bgColor: '#f8f8f8',
  navItems: [],
  footerLinks: [],
  footerCategories: [],
  footerDisclaimer: '',
  copyright: '',
  socialInstagram: '',
  socialTwitter: '',
  socialSubstack: '',
};
