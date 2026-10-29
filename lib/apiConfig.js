// lib/apiConfig.js
//
// Single source of truth for where the backend lives, now that the API is
// a separate Express server instead of Next.js route handlers on the same
// origin. Every fetch() call in the app should go through `apiFetch()`
// (or at least be prefixed with `API_BASE`) instead of using a bare
// relative path like fetch('/api/...'), which only worked when frontend
// and backend shared an origin.
//
// Set NEXT_PUBLIC_API_URL in your .env.local / Vercel env to your backend's
// URL, e.g.:
//   NEXT_PUBLIC_API_URL=http://localhost:5000
// (or your deployed backend URL in production).

export const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'https://futurism-backend.onrender.com').replace(/\/+$/, '');

// The frontend's own public URL -- used to build absolute links (e.g.
// social share URLs) that need to work outside this site, not just as
// relative Next.js routes. Falls back to the production Vercel URL (instead
// of localhost) when NEXT_PUBLIC_SITE_URL isn't set on the deployment, so
// share links never point at localhost in production.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === 'production' ? 'https://futurism-five.vercel.app' : 'http://localhost:3000')
).replace(/\/+$/, '');

/**
 * Thin wrapper around fetch() that:
 *  - Prepends API_BASE to relative paths (pass "/api/admin/articles", not a full URL)
 *  - Always sends credentials (cookies), required now that the API is on
 *    a different origin than the frontend -- without this, the admin_token
 *    cookie set by /api/admin/auth/login would never be sent back on
 *    subsequent admin requests.
 *  - Optionally aborts after `timeoutMs` (pass it in options). Without a
 *    timeout a plain fetch() waits forever, which is what left the admin
 *    stuck on "Checking session..." whenever the Render backend was asleep
 *    or unreachable. No timeout is applied unless you ask for one, so
 *    existing callers behave exactly as before.
 *
 * Usage is identical to fetch(): apiFetch('/api/header') returns the same
 * Response object fetch() would.
 */
export function apiFetch(path, options = {}) {
  const { timeoutMs, signal, ...rest } = options;
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;

  if (!timeoutMs) {
    return fetch(url, { credentials: 'include', ...rest, ...(signal ? { signal } : {}) });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener('abort', () => controller.abort(), { once: true });
  }
  return fetch(url, { credentials: 'include', ...rest, signal: controller.signal }).finally(() =>
    clearTimeout(timer)
  );
}

/**
 * Fire-and-forget ping to wake a sleeping backend (Render's free tier
 * spins down after ~15 min idle and takes 30-60s to come back). Call it
 * from pages a person is about to need the API on (e.g. the login page) so
 * the backend is warming up while they type.
 */
export function warmBackend() {
  try {
    fetch(`${API_BASE}/health`, { mode: 'cors', cache: 'no-store' }).catch(() => {});
  } catch {
    // ignore -- purely an optimisation
  }
}
