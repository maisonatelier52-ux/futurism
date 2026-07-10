# Futurism + HighTableNews Admin — Merged Project

This project combines:
- **Futurism** front-end (your newspaper site design — Header, Footer, FeaturedArticles, TopStories, TheFeed, article/category/author pages)
- **HighTableNews Admin v6** admin tooling (visual Header Builder, Footer Builder, Homepage Builder with drag-and-drop blocks, rich Articles/Categories editors)

The admin panel has been re-themed to Futurism branding (red primary `#ef4444`, dark sidebar) and rewired from localStorage to your existing MongoDB + JWT auth setup.

---

## What changed in the merge

| Area | Source | Change made |
|---|---|---|
| `tailwind.config.js` | hightable | Kept admin design tokens (`ink`, `surface`, `border`), swapped `primary` blue → Futurism red |
| `app/globals.css` | merged | Added Futurism's 4 custom font vars (`--font-owners-xnarrow` etc.) alongside hightable's admin utilities (ticker animation, toasts, skeleton) |
| `components/layout/Sidebar.jsx` | hightable, reskinned | Dark `#1a1a2e` background, red active state, Futurism logo, added Authors nav item, all links point to `/admin/*` |
| `components/layout/Topbar.jsx` | hightable, reskinned | Wired Sign Out to your existing `/api/admin/auth/logout` route |
| `app/admin/layout.jsx` | new | Wraps all `/admin/*` pages with `ToastProvider`; auth protection stays in `middleware.js` (unchanged from your version) |
| `lib/categoriesArticlesApi.js` | hightable, rewired | Same function names (`getCategories`, `saveArticle`, etc.) but now **async** and calls your MongoDB REST API instead of `localStorage` |
| `lib/models/Article.js` | merged | Combined your simple `body` blocks with hightable's richer `content` blocks (paragraph/subheading/pullquote/image/at_a_glance/faq), plus SEO fields, `keywords`, `tags`, `readTime` |
| `lib/models/Category.js` | merged | Added `seoTitle`, `seoDescription`, `bannerImage`, `position`, `showInTopNav` from hightable's category form |
| `app/admin/articles/page.jsx` | hightable | Full rich article editor (SEO fields, content blocks, image upload) — API calls converted from sync/localStorage to async/MongoDB |
| `app/admin/categories/page.jsx` | hightable | Full category editor with banner image, SEO fields — same async conversion |
| `app/admin/homepage-builder/`, `header-builder/`, `footer-builder/` | hightable, as-is | Drag-and-drop visual builders — currently save to `localStorage` (see "Known limitation" below) |
| `app/admin/authors/` | futurism, as-is | Your existing author editor, wrapped in the new `AdminShell` for consistent nav |
| `app/admin/dashboard/` | hightable, simplified | Removed fake stat numbers (1,284 articles etc.) since they weren't wired to real data — replaced with placeholders + quick links |

---

## Known limitation: 3 builders still use localStorage

The **Header Builder**, **Footer Builder**, and **Homepage Builder** (`lib/api.js` → `getHeader`/`saveHeader`/`getFooter`/`saveFooter`/`getHomepage`/`saveHomepage`) still read/write to `localStorage`, not MongoDB. This means:

- Changes only persist in the browser that made them
- They won't sync across devices or persist if the user clears browser data
- Your live site's actual `Header.jsx` / `Footer.jsx` components are NOT currently reading from these builders' output — they're still static

**To wire these to MongoDB** (recommended next step), you'd:
1. Create `HeaderConfig`, `FooterConfig` Mongoose models (similar structure to `HomepageConfig.js` which already exists)
2. Add `/api/admin/header` and `/api/admin/footer` routes (same pattern as `/api/admin/homepage/route.js`)
3. Replace the `localStorage` calls in `lib/api.js` with `fetch()` calls to those routes
4. Update your live `Header.jsx`/`Footer.jsx` to fetch the saved config on render instead of using hardcoded JSX

I left this as a clearly-scoped follow-up rather than guessing at your preferred API shape — happy to build it out if you want.

---

## Setup

### 1. Install dependencies
```bash
npm install
```
This now includes `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`, and `lucide-react` (added for the visual builders) alongside your existing `mongoose`, `jose`, FontAwesome packages.

### 2. Environment variables
```bash
cp .env.local.example .env.local
```
Fill in `MONGODB_URI`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_JWT_SECRET` as before.

### 3. Run
```bash
npm run dev
```

- Public site: `http://localhost:3000`
- Admin login: `http://localhost:3000/admin/login`
- Admin dashboard: `http://localhost:3000/admin/dashboard`

---

## Admin navigation map

| Sidebar item | Route | Data source |
|---|---|---|
| Dashboard | `/admin/dashboard` | static (placeholder stats) |
| Articles | `/admin/articles` | MongoDB via `/api/admin/articles` |
| Categories | `/admin/categories` | MongoDB via `/api/admin/categories` |
| Authors | `/admin/authors` | MongoDB via `/api/admin/authors` |
| Homepage Builder | `/admin/homepage-builder` | localStorage (see limitation above) |
| Header Builder | `/admin/header-builder` | localStorage |
| Footer Builder | `/admin/footer-builder` | localStorage |
| Media Library | `/admin/media-library` | empty state placeholder |
| Users | `/admin/users` | empty state placeholder |
| Settings | `/admin/settings` | MongoDB via `/api/admin/settings` (your original tabs: branding, colors, nav, footer, social) |

---

## Article schema note

The merged `Article` model supports **both** content formats:
- `content[]` — hightable's rich blocks: `paragraph`, `subheading`, `pullquote`, `image`, `at_a_glance`, `faq`
- `body` — your original simpler block format

New articles created via `/admin/articles` will populate `content[]`. Your existing article detail page (`app/articles/[slug]/page.jsx`) currently renders from `body` — you'll want to update that render logic to also handle `content[]` blocks (subheading, pullquote, at_a_glance, faq) if you start using the richer editor. I didn't change that file since it touches your live page design, and wanted to flag the decision rather than make it silently.
