// lib/apiConfig.js
//
// Single source of truth for where the backend lives, now that the API is
// a separate Express server instead of Next.js route handlers on the same
// origin. Every fetch() call in the app should go through `apiFetch()`
// (or at least be prefixed with `API_BASE`) instead of using a bare
// relative path like fetch('/api/...'), which only worked when frontend
// and backend shared an origin.
//
// Set NEXT_PUBLIC_API_URL in your .env.local to your backend's URL, e.g.:
//   NEXT_PUBLIC_API_URL=http://localhost:5000
// (or your deployed backend URL in production).

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://futurism-backend.onrender.com';

/**
 * Thin wrapper around fetch() that:
 *  - Prepends API_BASE to relative paths (pass "/api/admin/articles", not a full URL)
 *  - Always sends credentials (cookies), required now that the API is on
 *    a different origin than the frontend -- without this, the admin_token
 *    cookie set by /api/admin/auth/login would never be sent back on
 *    subsequent admin requests.
 *
 * Usage is identical to fetch(): apiFetch('/api/header') returns the same
 * Response object fetch() would.
 */
export function apiFetch(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  return fetch(url, {
    credentials: 'include',
    ...options,
  });
}
