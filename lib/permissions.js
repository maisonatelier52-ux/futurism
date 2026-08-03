// lib/permissions.js
// Single source of truth for every admin sidebar section that can be
// individually granted to an Editor or Stylist account. Mirrors
// backend/models/TeamUser.js's PERMISSION_KEYS -- if a new admin page is
// added later, add its entry here AND there.
//
// `key` matches the permission string stored in TeamUser.permissions.
// `href`/`label`/`icon` match components/layout/Sidebar.jsx's NAV_ITEMS so
// the same list can drive both the sidebar (filtered by permission) and
// the Users page's checkbox list (all items, regardless of permission).
import {
  LayoutDashboard, Newspaper, FolderTree, LayoutTemplate,
  PanelTop, PanelBottom, ImageIcon, Users2, Settings as SettingsIcon,
  UserCircle, History, Mail,
} from "lucide-react";

export const PERMISSION_ITEMS = [
  { key: "dashboard",              href: "/admin/dashboard",              label: "Dashboard",              icon: LayoutDashboard },
  { key: "articles",                href: "/admin/articles",               label: "Articles",               icon: Newspaper },
  { key: "categories",              href: "/admin/categories",             label: "Categories",             icon: FolderTree },
  { key: "category-page-builder",   href: "/admin/category-page-builder",  label: "Category Page Builder",  icon: LayoutTemplate },
  { key: "authors",                 href: "/admin/authors",                label: "Authors",                icon: UserCircle },
  { key: "homepage-builder",        href: "/admin/homepage-builder",       label: "Homepage Builder",       icon: LayoutTemplate },
  { key: "header-builder",          href: "/admin/header-builder",         label: "Header Builder",         icon: PanelTop },
  { key: "footer-builder",          href: "/admin/footer-builder",         label: "Footer Builder",         icon: PanelBottom },
  { key: "media-library",           href: "/admin/media-library",          label: "Media Library",          icon: ImageIcon },
  { key: "subscribers",             href: "/admin/subscribers",            label: "Subscribers",            icon: Mail },
  { key: "activity-log",            href: "/admin/activity-log",           label: "Activity Log",           icon: History },
  { key: "users",                   href: "/admin/users",                  label: "Users",                  icon: Users2 },
  { key: "settings",                href: "/admin/settings",               label: "Settings",               icon: SettingsIcon },
];

// Sensible starting point shown when first creating each account (mirrors
// DEFAULT_PERMISSIONS in backend/controllers/teamUsersController.js) --
// editable afterward, so this is just what the checkboxes start pre-ticked
// with, not an enforced restriction.
export const DEFAULT_PERMISSIONS = {
  editor: ["articles", "categories", "authors"],
  stylist: ["category-page-builder", "homepage-builder", "header-builder", "footer-builder"],
};

// `null` permissions (the value Admin's session carries) means "sees
// everything" -- every other role is restricted to exactly what's listed.
export function canAccess(permissions, key) {
  if (permissions == null) return true;
  return permissions.includes(key);
}

// Where to send someone right after login, based on what they can access --
// Editor/Stylist don't have "dashboard", so landing them there would just
// bounce immediately; send them to their first available page instead.
export function firstAccessibleHref(permissions) {
  if (permissions == null) return "/admin/dashboard";
  const first = PERMISSION_ITEMS.find((item) => permissions.includes(item.key));
  return first ? first.href : "/admin/login";
}
