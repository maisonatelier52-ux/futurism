"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Save, ExternalLink, Eye, Monitor, Smartphone, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { apiFetch, API_BASE } from "@/lib/apiConfig";
import { getCategories } from "@/lib/categoriesArticlesApi";
import {
  DEFAULT_CATEGORY_PAGE_CONFIG,
  CATEGORY_TEMPLATE_OPTIONS,
  defaultQuery,
} from "@/lib/categoryPageDefaults";
import { resolveCategoryPageContent } from "@/lib/resolveArticleQuery";

import CategoryTemplate1 from "@/components/category-templates/CategoryTemplate1";
import CategoryTemplate2 from "@/components/category-templates/CategoryTemplate2";
import CategoryTemplate3 from "@/components/category-templates/CategoryTemplate3";
import CategoryTemplate4 from "@/components/category-templates/CategoryTemplate4";

const TEMPLATES = {
  "template-1": CategoryTemplate1,
  "template-2": CategoryTemplate2,
  "template-3": CategoryTemplate3,
  "template-4": CategoryTemplate4,
};

function uid() {
  return `new-${Math.random().toString(36).slice(2, 9)}`;
}

// ── Scaled preview (same pattern as HomepageBuilder) ─────────────────────────
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

// ── Small field helpers ───────────────────────────────────────────────────────
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

function CollapsibleSection({ title, defaultOpen = true, children }) {
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

// ── Query editor: this category page is already scoped to one category, so
// there's no category picker here -- just auto (newest in this category)
// vs. pin specific articles. ──────────────────────────────────────────────
function QueryEditor({ query, onChange, label = "articles", allowPinned = true }) {
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
          Auto (newest in category)
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
        <Field label={`How many ${label}`}>
          <input type="number" min={1} max={40} className={inputCls} value={q.limit || 1}
            onChange={(e) => set({ limit: Math.max(1, parseInt(e.target.value, 10) || 1) })} />
        </Field>
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

// ── Tag list editor (subcategory tabs, unchanged -- manual) ──────────────────
function TagListEditor({ items, onChange }) {
  function update(idx, value) {
    const next = [...items];
    next[idx] = value;
    onChange(next);
  }
  function remove(idx) {
    onChange(items.filter((_, i) => i !== idx));
  }
  function add() {
    onChange([...items, "NEW TAB"]);
  }
  return (
    <div className="space-y-2">
      {items.map((tag, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <input className={inputCls} value={tag} onChange={(e) => update(idx, e.target.value)} />
          <button type="button" onClick={() => remove(idx)} className="text-red-500 hover:text-red-600 p-1.5 shrink-0">
            <Trash2 size={13} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="w-full flex items-center justify-center gap-1.5 border border-dashed border-border rounded-lg py-2 text-[12px] font-semibold text-ink-500 hover:text-primary hover:border-primary transition-colors"
      >
        <Plus size={13} /> Add tab
      </button>
    </div>
  );
}

// ── Deep Dive items editor (curatorial, manual, unchanged) ───────────────────
function DeepDiveListEditor({ items, onChange }) {
  function update(idx, patch) {
    onChange(items.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }
  function remove(idx) {
    onChange(items.filter((_, i) => i !== idx));
  }
  function add() {
    onChange([...items, { id: uid(), category: "CATEGORY", title: "New article title", author: "Author Name", image: "/images/img1.webp", href: "#" }]);
  }

  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div key={item.id ?? idx} className="border border-border rounded-lg p-3 space-y-2 bg-surface-soft/40">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wide text-ink-400">Item {idx + 1}</span>
            <button type="button" onClick={() => remove(idx)} className="text-red-500 hover:text-red-600 p-1" title="Remove">
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
          <div className="grid grid-cols-2 gap-2">
            <Field label="Image path/URL">
              <input className={inputCls} value={item.image || ""} onChange={(e) => update(idx, { image: e.target.value })} />
            </Field>
            <Field label="Link (href)">
              <input className={inputCls} value={item.href || ""} onChange={(e) => update(idx, { href: e.target.value })} />
            </Field>
          </div>
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

// ── Main builder ──────────────────────────────────────────────────────────────
export default function CategoryPageBuilder() {
  const { showToast } = useToast();

  const [categories, setCategories] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [config, setConfig] = useState(null);
  const [resolvedPreview, setResolvedPreview] = useState(null);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState("desktop");

  // Load categories list once
  useEffect(() => {
    getCategories()
      .then((cats) => {
        setCategories(cats);
        if (cats.length > 0) setSelectedSlug(cats[0].slug);
      })
      .finally(() => setLoadingCats(false));
  }, []);

  // Load config whenever selected category changes
  useEffect(() => {
    if (!selectedSlug) return;
    setLoadingConfig(true);
    apiFetch(`/api/admin/category-page-template?slug=${encodeURIComponent(selectedSlug)}`, { cache: "no-store" })
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || `Error ${r.status}`);
        setConfig(d.config || { ...DEFAULT_CATEGORY_PAGE_CONFIG });
      })
      .catch(() => setConfig({ ...DEFAULT_CATEGORY_PAGE_CONFIG }))
      .finally(() => setLoadingConfig(false));
  }, [selectedSlug]);

  // Re-resolve the live preview (real articles from this category) whenever
  // the content config or selected category changes.
  useEffect(() => {
    if (!config || !selectedSlug) return;
    let active = true;
    const category = categories.find((c) => c.slug === selectedSlug);
    resolveCategoryPageContent(config.content, category, API_BASE, 1, {}).then((resolved) => {
      if (active) setResolvedPreview(resolved);
    });
    return () => { active = false; };
  }, [config, selectedSlug, categories]);

  function setTemplate(value) {
    setConfig((c) => ({ ...c, activeTemplate: value }));
  }

  function setContent(field, value) {
    setConfig((c) => ({ ...c, content: { ...c.content, [field]: value } }));
  }

  function setContentPath(field, subfield, value) {
    setConfig((c) => ({
      ...c,
      content: { ...c.content, [field]: { ...c.content[field], [subfield]: value } },
    }));
  }

  async function handleSave() {
    if (!selectedSlug || !config) return;
    setSaving(true);
    try {
      const res = await apiFetch("/api/admin/category-page-template", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: selectedSlug, config }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setConfig(d.config);
      showToast(`Category page saved — live on /category/${selectedSlug}`, { type: "success" });
    } catch {
      showToast("Couldn't save category page", { type: "error" });
    } finally {
      setSaving(false);
    }
  }

  if (loadingCats) return <div className="p-8 text-ink-400 text-sm">Loading categories…</div>;

  if (categories.length === 0) {
    return (
      <div className="p-8 text-ink-400 text-sm">
        No categories found yet. Create a category first under <strong className="text-ink-600">Admin → Categories</strong>, then come back here to design its page.
      </div>
    );
  }

  const activeKey = config?.activeTemplate || "template-4";
  const PreviewTemplate = TEMPLATES[activeKey] || CategoryTemplate4;
  const content = config?.content || DEFAULT_CATEGORY_PAGE_CONFIG.content;

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Topbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 lg:px-8 py-4 border-b border-border bg-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-[15px] font-bold text-ink-900">Category Page Builder</h2>
          <select
            value={selectedSlug}
            onChange={(e) => setSelectedSlug(e.target.value)}
            className="rounded-lg border border-border px-3 py-1.5 text-[12.5px] text-ink-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {categories.map((c) => (
              <option key={c._id || c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
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
          <a href={`/category/${selectedSlug}`} target="_blank" rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-[13px] text-ink-600 hover:bg-surface-soft transition-colors">
            <ExternalLink size={14} /> View live
          </a>
          <button onClick={handleSave} disabled={saving || loadingConfig}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-[13px] font-semibold text-black hover:bg-primary-600 disabled:opacity-50 transition-colors">
            <Save size={14} /> {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {loadingConfig || !config ? (
        <div className="p-8 text-ink-400 text-sm">Loading category page…</div>
      ) : (
        <div className="flex flex-1 min-h-0 overflow-hidden flex-col lg:flex-row">
          {/* Left: Template + content editor */}
          <div className="w-full lg:w-[400px] flex-shrink-0 border-r border-border bg-white overflow-y-auto">
            <div className="p-5 space-y-5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-ink-400 mb-3">1. Choose a template</p>
                <div className="space-y-2">
                  {CATEGORY_TEMPLATE_OPTIONS.map((t) => (
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
                  <CollapsibleSection title="Hero (title & description)">
                    <p className="text-[11px] text-ink-400 mb-1">Leave blank to use this category's real name/description.</p>
                    <Field label="Category title override">
                      <input className={inputCls} value={content.hero.title}
                        onChange={(e) => setContentPath("hero", "title", e.target.value)} />
                    </Field>
                    <Field label="Description override">
                      <textarea rows={4} className={inputCls} value={content.hero.description}
                        onChange={(e) => setContentPath("hero", "description", e.target.value)} />
                    </Field>
                  </CollapsibleSection>

                  <CollapsibleSection title="Subcategory tabs" defaultOpen={false}>
                    <TagListEditor
                      items={content.tabs.subcategories}
                      onChange={(v) => setContentPath("tabs", "subcategories", v)}
                    />
                    <Field label='"See X more" count'>
                      <input type="number" className={inputCls} value={content.tabs.extraCount}
                        onChange={(e) => setContentPath("tabs", "extraCount", Number(e.target.value) || 0)} />
                    </Field>
                  </CollapsibleSection>

                  <CollapsibleSection title="Featured / top story" defaultOpen={false}>
                    <QueryEditor query={content.featuredQuery} onChange={(q) => setContent("featuredQuery", q)} label="top story" />
                  </CollapsibleSection>

                  <CollapsibleSection title="Latest / trending rail" defaultOpen={false}>
                    <QueryEditor query={content.latestQuery} onChange={(q) => setContent("latestQuery", q)} label="latest items" />
                  </CollapsibleSection>

                  <CollapsibleSection title="Main articles grid" defaultOpen={false}>
                    <QueryEditor query={content.articlesQuery} onChange={(q) => setContent("articlesQuery", q)} label="articles" allowPinned={false} />
                    <p className="text-[10.5px] text-ink-400">This grid is paginated on the live page, so it always auto-shows this category's newest articles page by page.</p>
                  </CollapsibleSection>

                  <CollapsibleSection title="Deep dive section (curated, manual)" defaultOpen={false}>
                    <Field label="Section title">
                      <input className={inputCls} value={content.deepDive.title}
                        onChange={(e) => setContentPath("deepDive", "title", e.target.value)} />
                    </Field>
                    <Field label="Section description">
                      <textarea rows={2} className={inputCls} value={content.deepDive.description}
                        onChange={(e) => setContentPath("deepDive", "description", e.target.value)} />
                    </Field>
                    <DeepDiveListEditor
                      items={content.deepDive.items}
                      onChange={(v) => setContentPath("deepDive", "items", v)}
                    />
                  </CollapsibleSection>

                  <CollapsibleSection title="Newsletter banner" defaultOpen={false}>
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
                </div>
              </div>

              <div className="p-4 rounded-card bg-surface-soft border border-border">
                <p className="text-[11.5px] text-ink-500 leading-relaxed">
                  <strong className="text-ink-700">Note:</strong> Featured, Latest, and the main grid now pull real, newest-first articles from this category automatically. Changes apply after you click Save.
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
      )}
    </div>
  );
}
