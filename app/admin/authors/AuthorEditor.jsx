'use client';

import AdminShell from '@/components/layout/AdminShell';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ExternalLink, Monitor, Smartphone, Plus, Trash2, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { apiFetch } from '@/lib/apiConfig';
import {
  AUTHOR_LAYOUT_OPTIONS,
  DEFAULT_AUTHOR_STATS,
  DEFAULT_AUTHOR_QUOTE,
  DEFAULT_AUTHOR_EXTRAS,
  DEFAULT_AUTHOR_ARTICLES,
} from '@/lib/authorTemplateDefaults';

import AuthorTemplate1 from '@/components/author-templates/AuthorTemplate1';
import AuthorTemplate2 from '@/components/author-templates/AuthorTemplate2';
import AuthorTemplate3 from '@/components/author-templates/AuthorTemplate3';
import AuthorTemplate4 from '@/components/author-templates/AuthorTemplate4';

const TEMPLATES = {
  'variation-1': AuthorTemplate1,
  'variation-2': AuthorTemplate2,
  'variation-3': AuthorTemplate3,
  'variation-4': AuthorTemplate4,
};

const EMPTY = {
  slug: '', name: '', role: '', avatar: '', bio: '', about: [''],
  education: '', bluesky: '', twitter: '', instagram: '',
  notableWorks: [], email: '', location: '', layoutVariation: 'variation-4',
  quote: '', stats: { ...DEFAULT_AUTHOR_STATS }, extras: { ...DEFAULT_AUTHOR_EXTRAS },
};

// ── Scaled preview (same pattern as HomepageBuilder / CategoryPageBuilder) ──
function ScaledPreview({ previewMode, children }) {
  const outerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const RENDER_WIDTH = 1280;

  const updateScale = useCallback(() => {
    if (!outerRef.current) return;
    setScale(outerRef.current.offsetWidth / RENDER_WIDTH);
  }, []);

  useEffect(() => {
    updateScale();
    const ro = new ResizeObserver(updateScale);
    if (outerRef.current) ro.observe(outerRef.current);
    return () => ro.disconnect();
  }, [updateScale]);

  if (previewMode === 'mobile') {
    return (
      <div className="mx-auto max-w-[390px] bg-white shadow-lift rounded-lg overflow-hidden">
        <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>{children}</div>
      </div>
    );
  }

  return (
    <div ref={outerRef} className="w-full bg-white shadow-lift rounded-lg overflow-hidden">
      <div style={{ height: `${Math.round(scale * 900)}px`, overflow: 'hidden', position: 'relative' }}>
        <div
          style={{
            width: `${RENDER_WIDTH}px`,
            transformOrigin: 'top left',
            transform: `scale(${scale})`,
            overflowY: 'hidden',
            pointerEvents: 'none',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function CollapsibleSection({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="text-[12.5px] font-bold text-gray-900">{title}</span>
        {open ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
      </button>
      {open && <div className="p-4 space-y-3">{children}</div>}
    </div>
  );
}

const inputCls = 'w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400';
const textareaCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 resize-none';

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[11.5px] font-semibold uppercase tracking-widest text-gray-500 mb-1">{label}</label>
      {children}
    </div>
  );
}

export default function AuthorEditor({ authorId }) {
  const router = useRouter();
  const isNew = !authorId;
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(!isNew);
  const [previewMode, setPreviewMode] = useState('desktop');

  useEffect(() => {
    if (!isNew) {
      apiFetch(`/api/admin/authors/${authorId}`, { cache: 'no-store' })
        .then((r) => r.json())
        .then((d) => {
          if (d.author) {
            setForm({
              ...EMPTY,
              ...d.author,
              about: d.author.about?.length ? d.author.about : [''],
              stats: { ...DEFAULT_AUTHOR_STATS, ...(d.author.stats || {}) },
              extras: { ...DEFAULT_AUTHOR_EXTRAS, ...(d.author.extras || {}) },
            });
          }
        })
        .finally(() => setLoading(false));
    }
  }, [authorId, isNew]);

  function set(field, value) { setForm((f) => ({ ...f, [field]: value })); }
  function setStat(field, value) { setForm((f) => ({ ...f, stats: { ...f.stats, [field]: value } })); }
  function setExtra(field, value) { setForm((f) => ({ ...f, extras: { ...f.extras, [field]: value } })); }

  function autoSlug(name) { return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }

  function setAbout(i, val) {
    const arr = [...form.about]; arr[i] = val; setForm((f) => ({ ...f, about: arr }));
  }
  function addAbout() { setForm((f) => ({ ...f, about: [...f.about, ''] })); }
  function removeAbout(i) { setForm((f) => ({ ...f, about: f.about.filter((_, idx) => idx !== i) })); }

  function setWork(i, field, val) {
    const arr = form.notableWorks.map((w, idx) => (idx === i ? { ...w, [field]: val } : w));
    setForm((f) => ({ ...f, notableWorks: arr }));
  }
  function addWork() { setForm((f) => ({ ...f, notableWorks: [...f.notableWorks, { title: '', publication: 'FUTURISM', href: '#' }] })); }
  function removeWork(i) { setForm((f) => ({ ...f, notableWorks: f.notableWorks.filter((_, idx) => idx !== i) })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const url = isNew ? '/api/admin/authors' : `/api/admin/authors/${authorId}`;
      const method = isNew ? 'POST' : 'PUT';
      const res = await apiFetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Save failed'); return; }
      router.push('/admin/authors');
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AdminShell title="Author Editor">
        <div className="p-8 text-gray-400 text-sm">Loading author…</div>
      </AdminShell>
    );
  }

  const ActiveTemplate = TEMPLATES[form.layoutVariation] || AuthorTemplate4;
  const previewAuthor = {
    ...form,
    quote: form.quote || DEFAULT_AUTHOR_QUOTE,
    stats: form.stats?.education ? form.stats : DEFAULT_AUTHOR_STATS,
    extras: form.extras?.background ? form.extras : DEFAULT_AUTHOR_EXTRAS,
    avatar: form.avatar || '/images/author1.webp',
  };

  return (
    <AdminShell title="Author Editor">
      <div className="flex flex-col h-full min-h-0">
        {/* Topbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 lg:px-8 py-4 border-b border-gray-200 bg-white flex-shrink-0">
          <div>
            <h1 className="text-lg font-black uppercase tracking-wide text-gray-900">{isNew ? 'New Author' : 'Edit Author'}</h1>
            {form.name && <p className="text-xs text-gray-400 mt-0.5">{form.name}</p>}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1">
              <button type="button" onClick={() => setPreviewMode('desktop')}
                className={`p-1.5 rounded-md transition-colors ${previewMode === 'desktop' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-700'}`}>
                <Monitor size={15} />
              </button>
              <button type="button" onClick={() => setPreviewMode('mobile')}
                className={`p-1.5 rounded-md transition-colors ${previewMode === 'mobile' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-700'}`}>
                <Smartphone size={15} />
              </button>
            </div>
            {!isNew && form.slug && (
              <a href={`/authors/${form.slug}`} target="_blank" rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-[13px] text-gray-600 hover:bg-gray-50 transition-colors">
                <ExternalLink size={14} /> View live
              </a>
            )}
            <button type="button" onClick={() => router.push('/admin/authors')} className="text-sm text-gray-400 hover:text-gray-700 px-2">
              ← Back
            </button>
            <button type="submit" form="author-form" disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-red-700 disabled:opacity-50 transition-colors">
              <Save size={14} /> {saving ? 'Saving…' : isNew ? 'Create Author' : 'Save'}
            </button>
          </div>
        </div>

        <form id="author-form" onSubmit={handleSubmit} className="flex flex-1 min-h-0 overflow-hidden flex-col lg:flex-row">
          {/* Left: form */}
          <div className="w-full lg:w-[420px] flex-shrink-0 border-r border-gray-200 bg-white overflow-y-auto">
            <div className="p-5 space-y-5">
              {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

              {/* Layout Variation */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">1. Choose a layout</p>
                <div className="space-y-2">
                  {AUTHOR_LAYOUT_OPTIONS.map((t) => (
                    <button key={t.value} type="button"
                      onClick={() => set('layoutVariation', t.value)}
                      className={`w-full text-left rounded-xl border p-3 transition-all ${
                        form.layoutVariation === t.value
                          ? 'border-red-500 bg-red-50 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="text-xl flex-shrink-0">{t.thumb}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[12.5px] font-bold text-gray-900">{t.label}</span>
                            {form.layoutVariation === t.value && (
                              <span className="text-[9.5px] font-bold uppercase tracking-wide text-red-600 flex-shrink-0">✓ Active</span>
                            )}
                          </div>
                          <p className="text-[11.5px] font-semibold text-gray-700 mt-0.5">{t.desc}</p>
                          <p className="text-[10.5px] text-gray-400 mt-1 leading-relaxed">{t.detail}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Basic Info */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">2. Edit content</p>
                <div className="space-y-3">
                  <CollapsibleSection title="Basic Info" defaultOpen>
                    <Field label="Name *">
                      <input type="text" value={form.name} required
                        onChange={(e) => { set('name', e.target.value); if (isNew) set('slug', autoSlug(e.target.value)); }}
                        className={inputCls} />
                    </Field>
                    <Field label="Slug *">
                      <input type="text" value={form.slug} onChange={(e) => set('slug', e.target.value)} className={inputCls} />
                    </Field>
                    <Field label="Role">
                      <input type="text" value={form.role} onChange={(e) => set('role', e.target.value)} placeholder="Senior Editor" className={inputCls} />
                    </Field>
                    <Field label="Avatar Path">
                      <input type="text" value={form.avatar} onChange={(e) => set('avatar', e.target.value)} placeholder="/images/author.webp" className={inputCls} />
                    </Field>
                    <Field label="Short Bio (used in hero variations)">
                      <textarea value={form.bio} onChange={(e) => set('bio', e.target.value)} rows={3} className={textareaCls} />
                    </Field>
                    <div className="grid grid-cols-2 gap-2">
                      <Field label="Email">
                        <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="name@futurism.com" className={inputCls} />
                      </Field>
                      <Field label="Location">
                        <input type="text" value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="Miami, FL" className={inputCls} />
                      </Field>
                    </div>
                  </CollapsibleSection>

                  <CollapsibleSection title="About Paragraphs">
                    {form.about.map((para, i) => (
                      <div key={i} className="flex gap-2">
                        <textarea value={para} onChange={(e) => setAbout(i, e.target.value)} rows={3} className={`flex-1 ${textareaCls}`} />
                        <button type="button" onClick={() => removeAbout(i)} className="text-red-400 hover:text-red-600 text-xs px-2 shrink-0"><Trash2 size={13} /></button>
                      </div>
                    ))}
                    <button type="button" onClick={addAbout}
                      className="w-full flex items-center justify-center gap-1.5 border border-dashed border-gray-300 rounded-lg py-2 text-[12px] font-semibold text-gray-500 hover:text-red-600 hover:border-red-400 transition-colors">
                      <Plus size={13} /> Add paragraph
                    </button>
                  </CollapsibleSection>

                  <CollapsibleSection title="Education">
                    <input type="text" value={form.education} onChange={(e) => set('education', e.target.value)} placeholder="McGill University" className={inputCls} />
                  </CollapsibleSection>

                  <CollapsibleSection title="Notable Works">
                    {form.notableWorks.map((w, i) => (
                      <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-2 bg-gray-50">
                        <div className="flex justify-end">
                          <button type="button" onClick={() => removeWork(i)} className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1"><Trash2 size={12} /> Remove</button>
                        </div>
                        <input value={w.title} onChange={(e) => setWork(i, 'title', e.target.value)} placeholder="Article title" className={inputCls} />
                        <div className="grid grid-cols-2 gap-2">
                          <input value={w.publication} onChange={(e) => setWork(i, 'publication', e.target.value)} placeholder="FUTURISM" className={inputCls} />
                          <input value={w.href} onChange={(e) => setWork(i, 'href', e.target.value)} placeholder="URL" className={inputCls} />
                        </div>
                        <input value={w.image || ''} onChange={(e) => setWork(i, 'image', e.target.value)} placeholder="Image path (used in Variation 2's Latest From strip)" className={inputCls} />
                      </div>
                    ))}
                    <button type="button" onClick={addWork}
                      className="w-full flex items-center justify-center gap-1.5 border border-dashed border-gray-300 rounded-lg py-2 text-[12px] font-semibold text-gray-500 hover:text-red-600 hover:border-red-400 transition-colors">
                      <Plus size={13} /> Add work
                    </button>
                  </CollapsibleSection>

                  {/* Pull-quote: used by Variation 1 and Variation 3 */}
                  {(form.layoutVariation === 'variation-1' || form.layoutVariation === 'variation-3') && (
                    <CollapsibleSection title="Pull Quote (Variation 1 & 3)" defaultOpen>
                      <textarea value={form.quote} onChange={(e) => set('quote', e.target.value)}
                        rows={3} placeholder={DEFAULT_AUTHOR_QUOTE} className={textareaCls} />
                    </CollapsibleSection>
                  )}

                  {/* Stat row: Variation 1 only */}
                  {form.layoutVariation === 'variation-1' && (
                    <CollapsibleSection title="Stat Row (Variation 1)" defaultOpen>
                      <Field label="Education (short)">
                        <input type="text" value={form.stats.education} onChange={(e) => setStat('education', e.target.value)} className={inputCls} />
                      </Field>
                      <Field label="Years at Futurism (since)">
                        <input type="text" value={form.stats.yearsSince} onChange={(e) => setStat('yearsSince', e.target.value)} placeholder="2017" className={inputCls} />
                      </Field>
                      <Field label="Focus Areas">
                        <input type="text" value={form.stats.focusAreas} onChange={(e) => setStat('focusAreas', e.target.value)} placeholder="AI, Space, Policy" className={inputCls} />
                      </Field>
                    </CollapsibleSection>
                  )}

                  {/* Background / Beyond Writing: Variation 2 only */}
                  {form.layoutVariation === 'variation-2' && (
                    <CollapsibleSection title="Background & Beyond Writing (Variation 2)" defaultOpen>
                      <Field label="Background">
                        <textarea value={form.extras.background} onChange={(e) => setExtra('background', e.target.value)} rows={3} className={textareaCls} />
                      </Field>
                      <Field label="Beyond Writing">
                        <textarea value={form.extras.beyondWriting} onChange={(e) => setExtra('beyondWriting', e.target.value)} rows={3} className={textareaCls} />
                      </Field>
                    </CollapsibleSection>
                  )}

                  <CollapsibleSection title="Social">
                    <Field label="Bluesky Handle">
                      <input type="text" value={form.bluesky} onChange={(e) => set('bluesky', e.target.value)} placeholder="@author" className={inputCls} />
                    </Field>
                    <Field label="Twitter Handle">
                      <input type="text" value={form.twitter} onChange={(e) => set('twitter', e.target.value)} placeholder="@author" className={inputCls} />
                    </Field>
                    <Field label="Instagram Handle">
                      <input type="text" value={form.instagram} onChange={(e) => set('instagram', e.target.value)} placeholder="@author" className={inputCls} />
                    </Field>
                  </CollapsibleSection>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <p className="text-[11.5px] text-gray-500 leading-relaxed">
                  <strong className="text-gray-700">Note:</strong> The preview on the right shows sample articles until this author has real published articles. Changes go live on <code className="text-[10.5px]">/authors/{form.slug || '…'}</code> after you click Save.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Live preview */}
          <div className="flex-1 bg-gray-50 overflow-auto flex flex-col">
            <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-200 bg-white flex-shrink-0">
              <Eye size={14} className="text-gray-400" />
              <span className="text-[12.5px] font-semibold text-gray-600">Live Preview</span>
              <span className="text-[11px] text-gray-400">— updates as you edit</span>
              <div className="ml-auto">
                <span className="text-[11px] text-gray-400 capitalize">{previewMode} view</span>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <ScaledPreview previewMode={previewMode}>
                <ActiveTemplate
                  key={form.layoutVariation}
                  author={previewAuthor}
                  articles={DEFAULT_AUTHOR_ARTICLES}
                  pagination={{ currentPage: 1, totalPages: 12 }}
                />
              </ScaledPreview>
            </div>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
