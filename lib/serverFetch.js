// lib/serverFetch.js
//
// fetch() wrapper for talking to the Express backend from server-rendered
// pages (and the shared resolve helpers in lib/resolveArticleQuery.js).
//
// WHY THIS EXISTS
// Every public page (/, /category/*, /articles/*, /authors/*, /search) is
// rendered on demand and calls the backend on Render. On Render's free tier
// the backend goes to sleep after ~15 minutes without traffic and takes
// 30-60+ seconds to wake up. A plain fetch() has NO timeout, so the Vercel
// function just waits... until Vercel kills it, and the visitor sees a page
// that never loads. With a timeout, the request is abandoned after a few
// seconds, every caller's existing `catch` / `!res.ok` fallback kicks in
// (default header/footer/homepage config), and the page renders instead of
// hanging. The abandoned request still wakes the backend up, so the next
// visit gets real data.

export const DEFAULT_TIMEOUT_MS = 5000;

/**
 * Same as fetch(), but:
 *  - defaults to cache: 'no-store' (matches how every page already called it)
 *  - aborts after `timeoutMs` (default 5s) instead of waiting forever
 *  - if the caller passes its own `signal` (e.g. a shared deadline covering
 *    many requests), that signal is used as-is and no per-request timer is added
 */
export function serverFetch(url, options = {}) {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, signal, ...rest } = options;
  return fetch(url, {
    cache: 'no-store',
    ...rest,
    signal: signal || AbortSignal.timeout(timeoutMs),
  });
}

/**
 * A single deadline shared by a group of requests. Once it fires, every
 * remaining fetch() using it rejects immediately, so a page that needs 10
 * backend calls waits at most `ms` in total instead of 10 x timeout.
 */
export function sharedDeadline(ms) {
  return AbortSignal.timeout(ms);
}

/** A signal that is already aborted -- makes every fetch using it fail instantly. */
export function abortedSignal() {
  return AbortSignal.abort();
}
