"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Save, ExternalLink, Eye, Monitor, Smartphone, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { apiFetch } from "@/lib/apiConfig";
import { API_BASE } from "@/lib/apiConfig";
import { DEFAULT_HOMEPAGE_CONFIG, HOMEPAGE_TEMPLATE_OPTIONS, defaultQuery } from "@/lib/homepageDefaults";
import { resolveHomepageContent } from "@/lib/resolveArticleQuery";
import { getCategories } from "@/lib/categoriesArticlesApi";

import HomepageTemplate1 from "@/components/homepage-templates/HomepageTemplate1";
import HomepageTemplate2 from "@/components/homepage-templates/HomepageTemplate2";
import HomepageTemplate3 from "@/components/homepage-templates/HomepageTemplate3";
import HomepageTemplate4 from "@/components/homepage-templates/HomepageTemplate4";

const TEMPLATES = {
  "template-1": HomepageTemplate1,
  "template-2": HomepageTemplate2,
  "template-3": HomepageTemplate3,
  "template-4": HomepageTemplate4,
};

function uid() {
  return `new-${Math.random().toString(36).slice(2, 9)}`;
}

// ── Scaled preview ────────────────────────────────────────────────────────────
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

  if (previewMode === "mobile") {
    return (
      <div className="mx-auto max-w-[390px] bg-white shadow-lift rounded-lg overflow-hidden">
        <div style={{ maxHeight: "70vh", overflowY: "auto" }}>{children}</div>
      </div>
    );
  }

  return (
    <div ref={outerRef} className="w-full bg-white shadow-lift rounded-lg overflow-hidden">
      <div style={{ height: `${Math.round(scale * 900)}px`, overflow: "hidden", position: "relative" }}>
        <div
          style={{
            width: `${RENDER_WIDTH}px`,
            transformOrigin: "top left",
            transform: `scale(${scale})`,
            overflowY: "hidden",
            pointerEvents: "none",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Small field helpers ────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[11.5px] font-medium text-ink-700 mb-1">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-border px-3 py-2 text-[12.5px] text-ink-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

function CollapsibleSection({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-border rounded-xl bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-surface-soft hover:bg-surface-soft/70 transition-colors"
      >
        <span className="text-[12.5px] font-bold text-ink-900">{title}</span>
        {open ? <ChevronUp size={14} className="text-ink-400" /> : <ChevronDown size={14} className="text-ink-400" />}
      </button>
      {open && <div className="p-4 space-y-3">{children}</div>}
    </div>
  );
}

// ── Query editor: replaces the old ArticleListEditor. Lets the admin pick
// auto (sitewide or one category, newest-first, N articles) or pinned
// (specific hand-picked articles) for one article-driven section. ────────
function QueryEditor({ query, onChange, categories, label = "articles", allowPinned = true }) {
  const q = query || defaultQuery();

  function set(patch) {
    onChange({ ...q, ...patch });
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => set({ mode: "auto" })}
          className={`flex-1 py-2 rounded-lg text-[12px] font-semibold border transition-colors ${
            q.mode === "auto" ? "border-primary bg-primary-50 text-primary" : "border-border text-ink-500 hover:border-ink-300"
          }`}
        >
          Auto (newest first)
        </button>
        {allowPinned && (
          <button
            type="button"
            onClick={() => set({ mode: "pinned" })}
            className={`flex-1 py-2 rounded-lg text-[12px] font-semibold border transition-colors ${
              q.mode === "pinned" ? "border-primary bg-primary-50 text-primary" : "border-border text-ink-500 hover:border-ink-300"
            }`}
          >
            Pin specific {label}
          </button>
        )}
      </div>

      {q.mode === "auto" ? (
        <>
          <Field label="Category filter">
            <select className={inputCls} value={q.category || ""} onChange={(e) => set({ category: e.target.value })}>
              <option value="">Sitewide (all categories)</option>
              {categories.map((c) => (
                <option key={c._id} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </Field>
          <Field label={`How many ${label}`}>
            <input type="number" min={1} max={20} className={inputCls} value={q.limit || 1}
              onChange={(e) => set({ limit: Math.max(1, parseInt(e.target.value, 10) || 1) })} />
          </Field>
        </>
      ) : (
        <PinnedArticlePicker pinnedIds={q.pinnedIds || []} onChange={(ids) => set({ pinnedIds: ids })} />
      )}
    </div>
  );
}

// Lets the admin search/select specific articles by title to pin, in order.
function PinnedArticlePicker({ pinnedIds, onChange }) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [pinnedArticles, setPinnedArticles] = useState([]);

  // Resolve pinned ids to titles for display.
  useEffect(() => {
    if (!pinnedIds.length) { setPinnedArticles([]); return; }
    apiFetch(`/api/admin/articles?limit=200`)
      .then((r) => r.json())
      .then((d) => {
        const byId = new Map((d.articles || []).map((a) => [a._id, a]));
        setPinnedArticles(pinnedIds.map((id) => byId.get(id)).filter(Boolean));
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pinnedIds.join(",")]);

  useEffect(() => {
    if (!search.trim()) { setResults([]); return; }
    const t = setTimeout(() => {
      apiFetch(`/api/admin/articles?search=${encodeURIComponent(search)}&limit=8`)
        .then((r) => r.json())
        .then((d) => setResults(d.articles || []))
        .catch(() => {});
    }, 250);
    return () => clearTimeout(t);
  }, [search]);

  function addArticle(article) {
    if (pinnedIds.includes(article._id)) return;
    onChange([...pinnedIds, article._id]);
    setSearch("");
    setResults([]);
  }
  function removeArticle(id) {
    onChange(pinnedIds.filter((pid) => pid !== id));
  }

  return (
    <div className="space-y-2">
      {pinnedArticles.length > 0 && (
        <div className="space-y-1.5">
          {pinnedArticles.map((a) => (
            <div key={a._id} className="flex items-center justify-between gap-2 border border-border rounded-lg px-3 py-2 bg-surface-soft/40">
              <span className="text-[12px] text-ink-800 truncate">{a.title}</span>
              <button type="button" onClick={() => removeArticle(a._id)} className="text-red-500 hover:text-red-600 shrink-0">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
      <input
        className={inputCls}
        placeholder="Search articles by title…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {results.length > 0 && (
        <div className="border border-border rounded-lg overflow-hidden divide-y divide-border">
          {results.map((a) => (
            <button
              key={a._id}
              type="button"
              onClick={() => addArticle(a)}
              className="w-full text-left px-3 py-2 text-[12px] text-ink-700 hover:bg-primary-50 transition-colors"
            >
              {a.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Category sections editor: title stays manual, articles are a query ──
function CategorySectionsEditor({ sections, onChange, categories }) {
  function updateSection(idx, patch) {
    onChange(sections.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  }
  function removeSection(idx) {
    onChange(sections.filter((_, i) => i !== idx));
  }
  function addSection() {
    onChange([...sections, { id: uid(), title: "New Category Section", query: defaultQuery({ limit: 3 }) }]);
  }

  return (
    <div className="space-y-4">
      {sections.map((section, idx) => (
        <div key={section.id ?? idx} className="border border-border rounded-lg p-3 space-y-3 bg-surface-soft/40">
          <div className="flex items-center justify-between gap-2">
            <input
              className={inputCls}
              value={section.title}
              onChange={(e) => updateSection(idx, { title: e.target.value })}
              placeholder="Section title"
            />
            <button type="button" onClick={() => removeSection(idx)} className="text-red-500 hover:text-red-600 p-1.5 shrink-0" title="Remove section">
              <Trash2 size={14} />
            </button>
          </div>
          <QueryEditor
            query={section.query}
            onChange={(q) => updateSection(idx, { query: q })}
            categories={categories}
            label="articles"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={addSection}
        className="w-full flex items-center justify-center gap-1.5 border border-dashed border-border rounded-lg py-2 text-[12px] font-semibold text-ink-500 hover:text-primary hover:border-primary transition-colors"
      >
        <Plus size={13} /> Add category section
      </button>
    </div>
  );
}

// ── Originals items editor (manual/curatorial, unchanged from before) ────
function OriginalsListEditor({ items, onChange }) {
  function update(idx, patch) {
    onChange(items.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }
  function remove(idx) {
    onChange(items.filter((_, i) => i !== idx));
  }
  function add() {
    onChange([...items, { id: uid(), category: "CATEGORY", title: "New original", author: "Author Name", href: "#" }]);
  }
  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div key={item.id ?? idx} className="border border-border rounded-lg p-3 space-y-2 bg-surface-soft/40">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wide text-ink-400">Item {idx + 1}</span>
            <button type="button" onClick={() => remove(idx)} className="text-red-500 hover:text-red-600 p-1">
              <Trash2 size={13} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Category tag">
              <input className={inputCls} value={item.category || ""} onChange={(e) => update(idx, { category: e.target.value })} />
            </Field>
            <Field label="Author">
              <input className={inputCls} value={item.author || ""} onChange={(e) => update(idx, { author: e.target.value })} />
            </Field>
          </div>
          <Field label="Title">
            <textarea rows={2} className={inputCls} value={item.title || ""} onChange={(e) => update(idx, { title: e.target.value })} />
          </Field>
          <Field label="Link (href)">
            <input className={inputCls} value={item.href || ""} onChange={(e) => update(idx, { href: e.target.value })} />
          </Field>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="w-full flex items-center justify-center gap-1.5 border border-dashed border-border rounded-lg py-2 text-[12px] font-semibold text-ink-500 hover:text-primary hover:border-primary transition-colors"
      >
        <Plus size={13} /> Add item
      </button>
    </div>
  );
}

// ── Main HomepageBuilder ──────────────────────────────────────────────────────
export default function HomepageBuilder() {
  const { showToast } = useToast();
  const [config, setConfig] = useState(null);
  const [categories, setCategories] = useState([]);
  const [resolvedPreview, setResolvedPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [previewMode, setPreviewMode] = useState("desktop");

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    apiFetch("/api/admin/homepage-template", { cache: "no-store" })
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || `Error ${r.status}`);
        const loaded = d.config || {};
        setConfig({
          ...DEFAULT_HOMEPAGE_CONFIG,
          ...loaded,
          content: {
            ...DEFAULT_HOMEPAGE_CONFIG.content,
            ...(loaded.content || {}),
          },
        });
      })
      .catch((err) => {
        setLoadError(err.message);
        setConfig({ ...DEFAULT_HOMEPAGE_CONFIG });
      })
      .finally(() => setLoading(false));
  }, []);

  // Re-resolve the live preview (real articles) whenever the content
  // config changes, so the preview always matches what the live site would show.
  useEffect(() => {
    if (!config) return;
    let active = true;
    resolveHomepageContent(config.content, API_BASE, {}).then((resolved) => {
      if (active) setResolvedPreview(resolved);
    });
    return () => { active = false; };
  }, [config]);

  function setTemplate(value) {
    setConfig((c) => ({ ...(c || DEFAULT_HOMEPAGE_CONFIG), activeTemplate: value }));
  }

  function setContent(field, value) {
    setConfig((c) => {
      const base = c || DEFAULT_HOMEPAGE_CONFIG;
      return { ...base, content: { ...base.content, [field]: value } };
    });
  }

  function setContentPath(field, subfield, value) {
    setConfig((c) => {
      const base = c || DEFAULT_HOMEPAGE_CONFIG;
      const baseContent = base.content || DEFAULT_HOMEPAGE_CONFIG.content;
      const baseField = baseContent[field] || DEFAULT_HOMEPAGE_CONFIG.content[field] || {};
      return {
        ...base,
        content: { ...baseContent, [field]: { ...baseField, [subfield]: value } },
      };
    });
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await apiFetch("/api/admin/homepage-template", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setConfig(d.config);
      showToast("Homepage saved — live on your site", { type: "success" });
    } catch {
      showToast("Couldn't save homepage", { type: "error" });
    } finally {
      setSaving(false);
    }
  }

  if (loading || !config) return <div className="p-8 text-ink-400 text-sm">Loading homepage config…</div>;

  const activeKey = config.activeTemplate || "template-1";
  const PreviewTemplate = TEMPLATES[activeKey] || HomepageTemplate1;
  const content = {
    ...DEFAULT_HOMEPAGE_CONFIG.content,
    ...(config.content || {}),
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Topbar */}
      <div className="flex items-center justify-between px-5 lg:px-8 py-4 border-b border-border bg-white flex-shrink-0">
        <div>
          <h2 className="text-[15px] font-bold text-ink-900">Homepage Builder</h2>
          {loadError && <p className="text-[11px] text-amber-600 mt-0.5">⚠ Running offline — {loadError}</p>}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-lg border border-border bg-surface-soft p-1">
            <button onClick={() => setPreviewMode("desktop")}
              className={`p-1.5 rounded-md transition-colors ${previewMode === "desktop" ? "bg-white shadow-soft text-ink-900" : "text-ink-400 hover:text-ink-700"}`}>
              <Monitor size={15} />
            </button>
            <button onClick={() => setPreviewMode("mobile")}
              className={`p-1.5 rounded-md transition-colors ${previewMode === "mobile" ? "bg-white shadow-soft text-ink-900" : "text-ink-400 hover:text-ink-700"}`}>
              <Smartphone size={15} />
            </button>
          </div>
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-[13px] text-ink-600 hover:bg-surface-soft transition-colors">
            <ExternalLink size={14} /> Live site
          </a>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-[13px] font-semibold text-black hover:bg-primary-600 disabled:opacity-50 transition-colors">
            <Save size={14} /> {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden flex-col lg:flex-row">
        {/* Left: Template selector + content editor */}
        <div className="w-full lg:w-[400px] flex-shrink-0 border-r border-border bg-white overflow-y-auto">
          <div className="p-5 space-y-5">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-ink-400 mb-3">1. Choose a layout</p>
              <div className="space-y-2">
                {HOMEPAGE_TEMPLATE_OPTIONS.map((t) => (
                  <button key={t.value} type="button"
                    onClick={() => setTemplate(t.value)}
                    className={`w-full text-left rounded-card border p-3 transition-all ${
                      activeKey === t.value
                        ? "border-primary bg-primary-50 shadow-soft"
                        : "border-border bg-white hover:border-ink-300 hover:shadow-soft"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-xl flex-shrink-0">{t.thumb}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[12.5px] font-bold text-ink-900">{t.label}</span>
                          {activeKey === t.value && (
                            <span className="text-[9.5px] font-bold uppercase tracking-wide text-primary flex-shrink-0">✓ Active</span>
                          )}
                        </div>
                        <p className="text-[11.5px] font-semibold text-ink-700 mt-0.5">{t.desc}</p>
                        <p className="text-[10.5px] text-ink-400 mt-1 leading-relaxed">{t.detail}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-ink-400 mb-3">2. Choose what shows in each section</p>
              <div className="space-y-3">
                <CollapsibleSection title="Hero (most recent article)" defaultOpen>
                  <QueryEditor query={content.heroQuery} onChange={(q) => setContent("heroQuery", q)} categories={categories} label="hero article" />
                </CollapsibleSection>

                <CollapsibleSection title="Secondary / featured articles">
                  <QueryEditor query={content.secondaryQuery} onChange={(q) => setContent("secondaryQuery", q)} categories={categories} label="featured articles" />
                </CollapsibleSection>

                <CollapsibleSection title="Latest stories rail">
                  <QueryEditor query={content.latestQuery} onChange={(q) => setContent("latestQuery", q)} categories={categories} label="latest items" />
                </CollapsibleSection>

                <CollapsibleSection title="Top stories grid">
                  <QueryEditor query={content.topStoriesQuery} onChange={(q) => setContent("topStoriesQuery", q)} categories={categories} label="top stories" />
                </CollapsibleSection>

                <CollapsibleSection title="Category sections">
                  <CategorySectionsEditor sections={content.categorySections} onChange={(v) => setContent("categorySections", v)} categories={categories} />
                </CollapsibleSection>

                <CollapsibleSection title="The Feed">
                  <QueryEditor query={content.feedQuery} onChange={(q) => setContent("feedQuery", q)} categories={categories} label="feed articles" />
                </CollapsibleSection>

                <CollapsibleSection title="Newsletter banner">
                  <Field label="Heading">
                    <input className={inputCls} value={content.newsletter.title}
                      onChange={(e) => setContentPath("newsletter", "title", e.target.value)} />
                  </Field>
                  <Field label="Description">
                    <textarea rows={2} className={inputCls} value={content.newsletter.description}
                      onChange={(e) => setContentPath("newsletter", "description", e.target.value)} />
                  </Field>
                  <Field label="Button label">
                    <input className={inputCls} value={content.newsletter.buttonLabel}
                      onChange={(e) => setContentPath("newsletter", "buttonLabel", e.target.value)} />
                  </Field>
                </CollapsibleSection>

                <CollapsibleSection title="Futurism Originals (curated, manual)">
                  <Field label="Section title">
                    <input className={inputCls} value={content.originals.sectionTitle}
                      onChange={(e) => setContentPath("originals", "sectionTitle", e.target.value)} />
                  </Field>
                  <Field label="Featured image path/URL">
                    <input className={inputCls} value={content.originals.featuredImage}
                      onChange={(e) => setContentPath("originals", "featuredImage", e.target.value)} />
                  </Field>
                  <OriginalsListEditor
                    items={content.originals.items}
                    onChange={(v) => setContentPath("originals", "items", v)}
                  />
                </CollapsibleSection>
              </div>
            </div>

            <div className="p-4 rounded-card bg-surface-soft border border-border">
              <p className="text-[11.5px] text-ink-500 leading-relaxed">
                <strong className="text-ink-700">Note:</strong> Article sections now pull real, newest-first articles from Admin → Articles automatically. Pick "Auto" to always show the latest (optionally filtered by category), or "Pin specific articles" to hand-pick exactly which ones appear. Changes apply after you click Save.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Live preview */}
        <div className="flex-1 bg-surface-soft overflow-auto flex flex-col">
          <div className="flex items-center gap-3 px-5 py-3 border-b border-border bg-white flex-shrink-0">
            <Eye size={14} className="text-ink-400" />
            <span className="text-[12.5px] font-semibold text-ink-600">Live Preview</span>
            <span className="text-[11px] text-ink-400">— shows real articles, updates as you edit</span>
            <div className="ml-auto">
              <span className="text-[11px] text-ink-400 capitalize">{previewMode} view</span>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4">
            {resolvedPreview ? (
              <ScaledPreview previewMode={previewMode}>
                <PreviewTemplate key={activeKey} data={resolvedPreview} />
              </ScaledPreview>
            ) : (
              <p className="text-ink-400 text-sm p-4">Loading preview…</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
