'use client';

import Image from 'next/image';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiFetch, warmBackend } from '@/lib/apiConfig';
import { clearCachedSession } from '@/lib/adminSession';
import { firstAccessibleHref, PERMISSION_ITEMS, canAccess } from '@/lib/permissions';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm]     = useState({ username: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  // Landing here means any previous session is gone (logout / expired /
  // never logged in) -- drop the cached one, and ping the backend now so a
  // sleeping Render instance is already waking up while the person types.
  useEffect(() => {
    clearCachedSession();
    warmBackend();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res  = await apiFetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        timeoutMs: 60000, // covers a cold Render backend
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setError(data.error || 'Login failed'); return; }
      const requestedNext = searchParams.get('next');
      const permissions = data.permissions ?? null;
      // Editor/Stylist accounts don't have "dashboard" -- sending them there
      // would just bounce them straight back out via AdminShell's guard. An
      // explicit ?next= (set when a session expired mid-page) is honored
      // only if this account can actually reach it; otherwise go straight
      // to the first page their permissions do allow, rather than
      // flashing the requested page and immediately bouncing out of it.
      const matchedItem = PERMISSION_ITEMS.find((item) => requestedNext?.startsWith(item.href));
      const canReachNext = requestedNext && matchedItem && canAccess(permissions, matchedItem.key);
      router.push(canReachNext ? requestedNext : firstAccessibleHref(permissions));
    } catch (err) {
      setError(
        err?.name === 'AbortError'
          ? 'The server is taking too long to respond (it may be waking up). Please try again in a moment.'
          : 'Network error — could not reach the server.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-sm p-8 shadow-2xl">
<div className="mb-8 flex flex-col items-center">
  <Image
    src="/images/logo.webp"
    alt="Futurism Logo"
    width={260}
    height={70}
    priority
    className="h-auto w-auto"
  />
  <p className="mt-3 text-xs text-gray-700 uppercase tracking-widest">
    Admin Panel
  </p>
</div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">Username</label>
            <input
              type="text"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              className="w-full h-10 px-3 border border-gray-300 text-sm focus:outline-none focus:border-red-500"
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="w-full h-10 px-3 border border-gray-300 text-sm focus:outline-none focus:border-red-500"
              required
            />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 bg-red-600 hover:bg-red-700 text-white text-sm font-bold uppercase tracking-widest transition-colors disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

// useSearchParams() requires a Suspense boundary in the App Router --
// wrapping here so the ?next= redirect param (set by AdminShell's auth
// guard) can be read without a build-time error.
export default function AdminLogin() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
