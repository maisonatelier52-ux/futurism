'use client';
import { useEffect, useState } from 'react';
import { apiFetch, API_BASE } from '@/lib/apiConfig';

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [error, setError]       = useState('');
  const [tab, setTab]           = useState('branding');

  useEffect(() => {
    apiFetch('/api/admin/settings').then(r => r.json()).then(d => setSettings(d.settings || {}));
  }, []);

  function set(k, v) { setSettings(s => ({ ...s, [k]: v })); }

  // Nav items
  function setNav(i, field, val) {
    const arr = (settings.navItems || []).map((n, idx) => idx === i ? { ...n, [field]: val } : n);
    set('navItems', arr);
  }
  function addNav()    { set('navItems', [...(settings.navItems || []), { label: '', href: '#', hasDropdown: false }]); }
  function removeNav(i) { set('navItems', settings.navItems.filter((_, idx) => idx !== i)); }
  function moveNav(i, dir) {
    const arr  = [...(settings.navItems || [])];
    const swap = i + dir;
    if (swap < 0 || swap >= arr.length) return;
    [arr[i], arr[swap]] = [arr[swap], arr[i]];
    set('navItems', arr);
  }

  // Footer categories
  function setFooterCat(i, field, val) {
    const arr = (settings.footerCategories || []).map((c, idx) => idx === i ? { ...c, [field]: val } : c);
    set('footerCategories', arr);
  }
  function addFooterCat()    { set('footerCategories', [...(settings.footerCategories || []), { label: '', href: '#' }]); }
  function removeFooterCat(i) { set('footerCategories', settings.footerCategories.filter((_, idx) => idx !== i)); }

  async function handleSave() {
    setSaving(true); setError('');
    try {
      const res = await apiFetch('/api/admin/settings', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings),
      });
      if (!res.ok) { setError('Save failed'); return; }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch { setError('Network error'); } finally { setSaving(false); }
  }

  if (!settings) return <p className="text-gray-400 text-sm">Loading settings...</p>;

  const inp = (label, key, placeholder = '') => (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">{label}</label>
      <input type="text" value={settings[key] || ''} onChange={e => set(key, e.target.value)} placeholder={placeholder}
        className="w-full h-10 px-3 border border-gray-300 text-sm focus:outline-none focus:border-red-500" />
    </div>
  );

  const tabs = ['branding', 'colors', 'navigation', 'footer', 'social', 'seo'];

return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wide text-gray-900">Settings</h1>
        <button onClick={handleSave} disabled={saving}
          className="text-xs bg-red-600 text-white px-5 py-2.5 font-semibold uppercase tracking-widest hover:bg-red-700 disabled:opacity-60 w-full sm:w-auto">
          {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save All'}
        </button>
      </div>
      {error && <p className="text-xs text-red-600 mb-4">{error}</p>}

      {/* Tabs */}
      <div className="flex gap-0 mb-6 border-b border-gray-200 overflow-x-auto scrollbar-hide">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 sm:px-5 py-3 text-xs font-semibold uppercase tracking-widest transition-colors whitespace-nowrap flex-shrink-0 ${tab === t ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-400 hover:text-gray-700'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Branding */}
      {tab === 'branding' && (
        <div className="bg-white p-6 shadow-sm space-y-4">
          {inp('Site Name', 'siteName', 'Futurism')}
          {inp('Logo Path', 'logo', '/images/logo.webp')}
          {inp('Favicon Path', 'favicon', '/favicon.ico')}
          {inp('Copyright Text', 'copyright', '© 2026 RECURRENT. ALL RIGHTS RESERVED.')}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">Footer Disclaimer</label>
            <textarea value={settings.footerDisclaimer || ''} onChange={e => set('footerDisclaimer', e.target.value)} rows={3}
              className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-red-500 resize-none" />
          </div>
        </div>
      )}

      {/* Colors */}
      {tab === 'colors' && (
        <div className="bg-white p-6 shadow-sm space-y-6">
{[
  ['Primary Color (red)', 'primaryColor', '#ef4444'],
  ['Accent / Dark Color', 'accentColor',  '#1f2326'],
  ['Background Color',    'bgColor',       '#f8f8f8'],
].map(([label, key, def]) => (
  <div key={key}>
    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">{label}</label>
    <div className="flex flex-wrap gap-3 items-center">
      <input type="color" value={settings[key] || def} onChange={e => set(key, e.target.value)}
        className="h-12 w-16 border border-gray-300 cursor-pointer rounded flex-shrink-0" />
      <input type="text"  value={settings[key] || def} onChange={e => set(key, e.target.value)}
        className="flex-1 min-w-[140px] h-10 px-3 border border-gray-300 text-sm focus:outline-none focus:border-red-500 font-mono" />
      <div className="w-10 h-10 border border-gray-200 rounded flex-shrink-0" style={{ backgroundColor: settings[key] || def }} />
    </div>
  </div>
))}
          <p className="text-xs text-gray-400">After saving colors, update your <code className="bg-gray-100 px-1">globals.css</code> or Tailwind config to apply them site-wide.</p>
        </div>
      )}

      {/* Navigation */}
      {tab === 'navigation' && (
        <div className="bg-white p-6 shadow-sm space-y-3">
          <p className="text-xs text-gray-400 mb-4">These are the header navigation items.</p>
{(settings.navItems || []).map((nav, i) => (
  <div key={i} className="flex flex-wrap sm:flex-nowrap gap-2 items-center border border-gray-200 p-3 bg-gray-50">
    <div className="flex sm:flex-col gap-1 order-1">
      <button type="button" onClick={() => moveNav(i, -1)} className="text-xs text-gray-300 hover:text-gray-600 leading-none">▲</button>
      <button type="button" onClick={() => moveNav(i, 1)}  className="text-xs text-gray-300 hover:text-gray-600 leading-none">▼</button>
    </div>
    <input value={nav.label} onChange={e => setNav(i, 'label', e.target.value)} placeholder="Label"
      className="flex-1 min-w-[100px] h-9 px-3 border border-gray-300 text-sm focus:outline-none focus:border-red-500 order-2" />
    <input value={nav.href}  onChange={e => setNav(i, 'href', e.target.value)}  placeholder="/path"
      className="flex-1 min-w-[100px] h-9 px-3 border border-gray-300 text-sm focus:outline-none focus:border-red-500 order-3" />
    <label className="flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap order-4">
      <input type="checkbox" checked={nav.hasDropdown} onChange={e => setNav(i, 'hasDropdown', e.target.checked)} className="accent-red-600" />
      Dropdown
    </label>
    <button onClick={() => removeNav(i)} className="text-red-400 hover:text-red-600 px-2 text-sm order-5">✕</button>
  </div>
))}
          <button onClick={addNav} className="text-xs px-3 py-2 border border-gray-300 hover:border-red-500 text-gray-600 hover:text-red-600">+ Add Nav Item</button>
        </div>
      )}

      {/* Footer */}
      {tab === 'footer' && (
        <div className="bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Footer Category Links</h3>
          {(settings.footerCategories || []).map((c, i) => (
            <div key={i} className="flex gap-2">
              <input value={c.label} onChange={e => setFooterCat(i, 'label', e.target.value)} placeholder="Label"
                className="flex-1 h-9 px-3 border border-gray-300 text-sm focus:outline-none focus:border-red-500" />
              <input value={c.href}  onChange={e => setFooterCat(i, 'href', e.target.value)}  placeholder="/category/slug"
                className="flex-1 h-9 px-3 border border-gray-300 text-sm focus:outline-none focus:border-red-500" />
              <button onClick={() => removeFooterCat(i)} className="text-red-400 hover:text-red-600 px-2">✕</button>
            </div>
          ))}
          <button onClick={addFooterCat} className="text-xs px-3 py-2 border border-gray-300 hover:border-red-500 text-gray-600 hover:text-red-600">+ Add Category</button>
        </div>
      )}

      {/* Social */}
      {tab === 'social' && (
        <div className="bg-white p-6 shadow-sm space-y-4">
          {inp('Instagram Handle', 'socialInstagram', '@futurism')}
          {inp('Twitter / X Handle', 'socialTwitter', '@futurism')}
          {inp('Substack URL', 'socialSubstack', 'https://futurism.substack.com')}
        </div>
      )}

      {/* SEO / Sitemap & Robots */}
      {tab === 'seo' && (
        <div className="bg-white p-6 shadow-sm space-y-5">
          {inp('Site URL', 'seoSiteUrl', 'https://futurism.com')}
          <p className="text-xs text-gray-400 -mt-3">
            Used as the base URL for <code className="bg-gray-100 px-1">/sitemap.xml</code> and{' '}
            <code className="bg-gray-100 px-1">/robots.txt</code>. Leave blank to use the backend&apos;s
            <code className="bg-gray-100 px-1 ml-1">SITE_URL</code> environment variable.
          </p>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500">
              Include in Sitemap
            </label>
            {[
              ['Articles', 'seoSitemapIncludeArticles'],
              ['Authors', 'seoSitemapIncludeAuthors'],
              ['Categories', 'seoSitemapIncludeCategories'],
            ].map(([label, key]) => (
              <label key={key} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={settings[key] !== false}
                  onChange={(e) => set(key, e.target.checked)}
                  className="accent-red-600"
                />
                {label}
              </label>
            ))}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">
              Extra robots.txt Rules
            </label>
            <textarea
              value={settings.seoRobotsExtraRules || ''}
              onChange={(e) => set('seoRobotsExtraRules', e.target.value)}
              rows={4}
              placeholder={'Disallow: /drafts\nDisallow: /preview'}
              className="w-full px-3 py-2 border border-gray-300 text-sm font-mono focus:outline-none focus:border-red-500 resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              Raw lines appended to the generated robots.txt, after the default Allow/Disallow rules.
            </p>
          </div>

          <div className="pt-2 border-t border-gray-100 flex flex-wrap gap-4 text-xs">
            <a href={`${API_BASE}/sitemap.xml`} target="_blank" rel="noreferrer" className="text-red-600 hover:underline">
              Preview sitemap.xml ↗
            </a>
            <a href={`${API_BASE}/robots.txt`} target="_blank" rel="noreferrer" className="text-red-600 hover:underline">
              Preview robots.txt ↗
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
