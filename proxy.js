// proxy.js
//
// Admin route protection used to happen here, by checking the admin_token
// cookie server-side before Next.js even rendered an /admin page. That no
// longer works: the backend (Express, on its own origin/port) sets
// admin_token on ITS origin, and browsers never send a cookie set by one
// origin to a different origin's server -- so this middleware could never
// see the token no matter how a person logged in.
//
// Auth is now checked client-side instead, in components/layout/AdminShell.jsx,
// which calls the backend's GET /api/admin/auth/me on mount and redirects to
// /admin/login if that call fails. Every admin page already renders through
// AdminShell, so this covers the same pages this middleware used to guard.
//
// This file is kept as a harmless passthrough (rather than deleted) in case
// you later deploy the frontend and backend on the same parent domain
// (e.g. app.example.com + api.example.com with a shared cookie domain) --
// at that point a server-side check here becomes possible again, and you
// can restore the previous cookie-verification logic.

import { NextResponse } from 'next/server';

export async function proxy(request) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
