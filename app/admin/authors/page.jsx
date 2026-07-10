'use client';
import AdminShell from '@/components/layout/AdminShell';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AUTHOR_LAYOUT_OPTIONS } from '@/lib/authorTemplateDefaults';
import { apiFetch } from '@/lib/apiConfig';

export default function AuthorsPage() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/admin/authors').then(r => r.json()).then(d => {
      setAuthors(d.authors || []);
      setLoading(false);
    });
  }, []);

  async function handleDelete(id, name) {
    if (!confirm(`Delete author "${name}"? This won't delete their articles.`)) return;
    await apiFetch(`/api/admin/authors/${id}`, { method: 'DELETE' });
    setAuthors(prev => prev.filter(a => a._id !== id));
  }

  return (
    <AdminShell title="Authors">
    <div className="p-5 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wide text-gray-900">Authors</h1>
          <p className="text-sm text-gray-400 mt-1">{authors.length} contributors</p>
        </div>
        <Link href="/admin/authors/new" className="text-xs bg-red-600 text-white px-5 py-2.5 font-semibold uppercase tracking-widest hover:bg-red-700 transition-colors">
          + New Author
        </Link>
      </div>

      <div className="bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-400 uppercase tracking-widest">
            <tr>
              <th className="text-left px-6 py-3">Name</th>
              <th className="text-left px-6 py-3 hidden md:table-cell">Role</th>
              <th className="text-left px-6 py-3 hidden xl:table-cell">Layout</th>
              <th className="text-left px-6 py-3 hidden lg:table-cell">Slug</th>
              <th className="text-left px-6 py-3">Articles</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading && <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">Loading...</td></tr>}
            {!loading && authors.map(a => (
              <tr key={a._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                  {a.avatar && <img src={a.avatar} alt={a.name} className="w-8 h-8 rounded-full object-cover" />}
                  {a.name}
                </td>
                <td className="px-6 py-4 text-gray-500 hidden md:table-cell">{a.role || '—'}</td>
                <td className="px-6 py-4 hidden xl:table-cell">
                  <span className="text-[11px] px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full font-medium">
                    {AUTHOR_LAYOUT_OPTIONS.find((t) => t.value === a.layoutVariation)?.label || 'Variation 4 (Default)'}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-400 font-mono text-xs hidden lg:table-cell">{a.slug}</td>
                <td className="px-6 py-4 text-gray-500">{a.articleCount ?? 0}</td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <Link href={`/admin/authors/${a._id}`} className="text-xs text-red-600 hover:underline font-semibold mr-4">Edit</Link>
                  <button onClick={() => handleDelete(a._id, a.name)} className="text-xs text-gray-400 hover:text-red-600 font-semibold">Delete</button>
                </td>
              </tr>
            ))}
            {!loading && authors.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-400">No authors yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </AdminShell>
  );
}
