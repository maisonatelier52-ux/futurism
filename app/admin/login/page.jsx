'use client';

import Image from 'next/image';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiFetch } from '@/lib/apiConfig';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm]     = useState({ username: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res  = await apiFetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Login failed'); return; }
      const next = searchParams.get('next') || '/admin/dashboard';
      router.push(next);
    } catch {
      setError('Network error');
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
