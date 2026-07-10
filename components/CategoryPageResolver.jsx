// components/CategoryPageResolver.jsx
// Server Component: picks the active category page template and renders it
// with the config fetched by the page itself (see app/category/[slug]/page.jsx).
// No client-side fetch/loading state -- avoids the header/footer-then-content
// flash the old client-fetching version had.
import CategoryTemplate1 from "./category-templates/CategoryTemplate1";
import CategoryTemplate2 from "./category-templates/CategoryTemplate2";
import CategoryTemplate3 from "./category-templates/CategoryTemplate3";
import CategoryTemplate4 from "./category-templates/CategoryTemplate4";
import { DEFAULT_CATEGORY_PAGE_CONFIG } from "@/lib/categoryPageDefaults";

const TEMPLATES = {
  "template-1": CategoryTemplate1,
  "template-2": CategoryTemplate2,
  "template-3": CategoryTemplate3,
  "template-4": CategoryTemplate4,
};

export default function CategoryPageResolver({ config }) {
  const safeConfig = config || DEFAULT_CATEGORY_PAGE_CONFIG;
  const ActiveTemplate = TEMPLATES[safeConfig.activeTemplate] || CategoryTemplate4;
  return <ActiveTemplate data={safeConfig.content || DEFAULT_CATEGORY_PAGE_CONFIG.content} />;
}
