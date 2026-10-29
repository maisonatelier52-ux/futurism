// lib/adminSession.js
//
// Tiny in-memory cache of the last verified admin session, shared across
// admin pages for the lifetime of the browser tab (it resets on a full
// reload). Every admin page mounts its own <AdminShell>, so without this
// each sidebar click re-ran the session check behind a full-screen
// "Checking session..." screen. With it, AdminShell renders instantly from
// the cache and re-validates against the backend silently in the background.

let cached = null; // { username, role, permissions }

export function getCachedSession() {
  return cached;
}

export function setCachedSession(session) {
  cached = session;
}

export function clearCachedSession() {
  cached = null;
}
