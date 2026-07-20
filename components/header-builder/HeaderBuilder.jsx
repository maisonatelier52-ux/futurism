"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Plus, Trash2, Save, ExternalLink, Eye, Settings2, Monitor, Smartphone } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { apiFetch } from "@/lib/apiConfig";
import { DEFAULT_HEADER_CONFIG } from "@/lib/headerDefaults";
import { getCategories } from "@/lib/categoriesArticlesApi";

// Import all templates for live preview
import HeaderTemplate1 from "@/components/header-templates/HeaderTemplate1";
import HeaderTemplate2 from "@/components/header-templates/HeaderTemplate2";
import HeaderTemplate3 from "@/components/header-templates/HeaderTemplate3";
import HeaderTemplate4 from "@/components/header-templates/HeaderTemplate4";
import HeaderTemplate5 from "@/components/header-templates/HeaderTemplate5";
import HeaderTemplate6 from "@/components/header-templates/HeaderTemplate6";
import HeaderTemplate7 from "@/components/header-templates/HeaderTemplate7";

const TEMPLATES = {
  "template-1": HeaderTemplate1,
  "template-2": HeaderTemplate2,
  "template-3": HeaderTemplate3,
  "template-4": HeaderTemplate4,
  "template-5": HeaderTemplate5,
  "template-6": HeaderTemplate6,
  "template-7": HeaderTemplate7,
};

const TEMPLATE_OPTIONS = [
  { value: "template-1", label: "Variation 1", desc: "Original — logo left, 2-row nav" },
  { value: "template-2", label: "Variation 2", desc: "Inline nav + breaking news ticker" },
  { value: "template-3", label: "Variation 3", desc: "Large logo + search bar + weather + nav row" },
  { value: "template-4", label: "Variation 4", desc: "Dark theme + breaking news" },
  { value: "template-5", label: "Variation 5", desc: "Centered logo + split nav + utility bar" },
  { value: "template-6", label: "Variation 6", desc: "Logo with accent underline + trending bar" },
  { value: "template-7", label: "Variation 7", desc: "Diagonal logo block + breaking news" },
];

const SOCIAL_PLATFORMS = ["instagram", "twitter", "substack", "facebook", "youtube", "linkedin", "tiktok"];

// ── Reusable link list editor ────────────────────────────────────────────────
function LinkListEditor({ label, links = [], onChange, hint, addLabel = "Add Link", categories = [] }) {
  function update(i, field, value) { onChange(links.map((l, idx) => idx === i ? { ...l, [field]: value } : l)); }
  function add() { onChange([...links, { name: "", href: "#" }]); }
  function remove(i) { onChange(links.filter((_, idx) => idx !== i)); }
  function move(i, dir) {
    const arr = [...links]; const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]]; onChange(arr);
  }
  function addFromCategory(e) {
    const slug = e.target.value;
    if (!slug) return;
    const cat = categories.find((c) => c.slug === slug);
    if (cat) onChange([...links, { name: cat.name.toUpperCase(), href: `/category/${cat.slug}` }]);
    e.target.value = "";
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
        <div>
          <p className="text-[13px] font-semibold text-ink-900">{label}</p>
          {hint && <p className="text-[11px] text-ink-400 mt-0.5">{hint}</p>}
        </div>
        <div className="flex items-center gap-3">
          {categories.length > 0 && (
            <select
              onChange={addFromCategory}
              defaultValue=""
              className="text-[11.5px] rounded-lg border border-border bg-white px-2 py-1.5 text-ink-600 focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="" disabled>+ From category…</option>
              {categories.map((c) => (
                <option key={c._id || c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          )}
          <button type="button" onClick={add} className="flex items-center gap-1 text-[12px] text-primary hover:underline font-medium">
            <Plus size={12} /> {addLabel}
          </button>
        </div>
      </div>
      <div className="space-y-1.5">
        {links.map((link, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="flex flex-col gap-0.5">
              <button type="button" onClick={() => move(i, -1)} className="text-ink-300 hover:text-ink-600 text-[10px] leading-none">▲</button>
              <button type="button" onClick={() => move(i, 1)}  className="text-ink-300 hover:text-ink-600 text-[10px] leading-none">▼</button>
            </div>
            <input type="text" value={link.name || ""} onChange={e => update(i, "name", e.target.value)} placeholder="Label (e.g. AI)"
              className="flex-1 rounded-lg border border-border bg-surface-soft px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <input type="text" value={link.href || ""} onChange={e => update(i, "href", e.target.value)} placeholder="/path or #"
              className="flex-1 rounded-lg border border-border bg-surface-soft px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <button type="button" onClick={() => remove(i)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg flex-shrink-0">
              <Trash2 size={13} />
            </button>
          </div>
        ))}
        {links.length === 0 && <p className="text-[12px] text-ink-400 italic py-2">No links yet — click {addLabel}.</p>}
      </div>
    </div>
  );
}

// ── Social icon list editor ──────────────────────────────────────────────────
function SocialListEditor({ links = [], onChange }) {
  function update(i, field, value) { onChange(links.map((l, idx) => idx === i ? { ...l, [field]: value } : l)); }
  function add() { onChange([...links, { platform: "instagram", href: "#" }]); }
  function remove(i) { onChange(links.filter((_, idx) => idx !== i)); }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[13px] font-semibold text-ink-900">Social Icons</p>
        <button type="button" onClick={add} className="flex items-center gap-1 text-[12px] text-primary hover:underline font-medium">
          <Plus size={12} /> Add Icon
        </button>
      </div>
      <div className="space-y-1.5">
        {links.map((link, i) => (
          <div key={i} className="flex items-center gap-2">
            <select value={link.platform || "instagram"} onChange={e => update(i, "platform", e.target.value)}
              className="rounded-lg border border-border bg-surface-soft px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/30 capitalize">
              {SOCIAL_PLATFORMS.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
            </select>
            <input type="text" value={link.href || ""} onChange={e => update(i, "href", e.target.value)} placeholder="https://..."
              className="flex-1 rounded-lg border border-border bg-surface-soft px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <button type="button" onClick={() => remove(i)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Breaking news editor ─────────────────────────────────────────────────────
function BreakingNewsEditor({ items = [], onChange }) {
  function update(i, field, value) { onChange(items.map((it, idx) => idx === i ? { ...it, [field]: value } : it)); }
  function add() { onChange([...items, { text: "", time: "", href: "#" }]); }
  function remove(i) { onChange(items.filter((_, idx) => idx !== i)); }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[13px] font-semibold text-ink-900">Breaking News Items</p>
        <button type="button" onClick={add} className="flex items-center gap-1 text-[12px] text-primary hover:underline font-medium">
          <Plus size={12} /> Add Item
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="rounded-lg border border-border bg-surface-soft p-3 space-y-2">
            <div className="flex items-center gap-2">
              <input type="text" value={item.text || ""} onChange={e => update(i, "text", e.target.value)} placeholder="Headline text"
                className="flex-1 rounded-lg border border-border bg-white px-3 py-1.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <button type="button" onClick={() => remove(i)} className="p-1.5 text-red-400 hover:text-red-600"><Trash2 size={13} /></button>
            </div>
            <div className="flex gap-2">
              <input type="text" value={item.time || ""} onChange={e => update(i, "time", e.target.value)} placeholder="Time (e.g. 5m ago)"
                className="w-28 rounded-lg border border-border bg-white px-3 py-1.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <input type="text" value={item.href || ""} onChange={e => update(i, "href", e.target.value)} placeholder="Link URL"
                className="flex-1 rounded-lg border border-border bg-white px-3 py-1.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Trending topics editor ───────────────────────────────────────────────────
function TrendingEditor({ topics = [], onChange }) {
  function update(i, field, value) { onChange(topics.map((t, idx) => idx === i ? { ...t, [field]: value } : t)); }
  function add() { onChange([...topics, { label: "", href: "#" }]); }
  function remove(i) { onChange(topics.filter((_, idx) => idx !== i)); }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[13px] font-semibold text-ink-900">Trending Topics</p>
        <button type="button" onClick={add} className="flex items-center gap-1 text-[12px] text-primary hover:underline font-medium">
          <Plus size={12} /> Add Topic
        </button>
      </div>
      <div className="space-y-1.5">
        {topics.map((topic, i) => (
          <div key={i} className="flex items-center gap-2">
            <input type="text" value={topic.label || ""} onChange={e => update(i, "label", e.target.value)} placeholder="Topic"
              className="flex-1 rounded-lg border border-border bg-surface-soft px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <input type="text" value={topic.href || ""} onChange={e => update(i, "href", e.target.value)} placeholder="/tag/slug"
              className="flex-1 rounded-lg border border-border bg-surface-soft px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <button type="button" onClick={() => remove(i)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Color picker row ─────────────────────────────────────────────────────────
function ColorField({ label, value, onChange }) {
  return (
    <div>
      <p className="text-[12px] font-medium text-ink-500 mb-1.5">{label}</p>
      <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-soft px-2 py-1.5">
        <input type="color" value={value || "#000000"} onChange={e => onChange(e.target.value)} className="h-6 w-6 rounded cursor-pointer border-0" />
        <input type="text" value={value || ""} onChange={e => onChange(e.target.value)} className="flex-1 bg-transparent text-[12.5px] text-ink-700 focus:outline-none font-mono" />
        <div className="w-6 h-6 rounded border border-border flex-shrink-0" style={{ backgroundColor: value }} />
      </div>
    </div>
  );
}

// ── Toggle row ───────────────────────────────────────────────────────────────
function ToggleField({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer py-1">
      <span className="text-[13px] text-ink-700">{label}</span>
      <div
        onClick={() => onChange(!checked)}
        className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${checked ? "bg-primary" : "bg-ink-300"}`}
      >
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
      </div>
    </label>
  );
}

// ── Scaled Preview wrapper ───────────────────────────────────────────────────
// Renders the header at its natural 1280px width then CSS-scales it down to
// fit the preview panel, so it looks exactly like the real site would at desktop.
function ScaledPreview({ previewMode, children }) {
  const outerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const RENDER_WIDTH = 1280;

  const updateScale = useCallback(() => {
    if (!outerRef.current) return;
    const available = outerRef.current.offsetWidth;
    setScale(available / RENDER_WIDTH);
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
        {children}
        <PreviewPageContent />
      </div>
    );
  }

  // Desktop: render at 1280px then scale down to fill the container
  const scaledHeight = scale < 1 ? `${Math.round(scale * 200)}px` : "auto";

  return (
    <div ref={outerRef} className="w-full bg-white shadow-lift rounded-lg overflow-hidden">
      {/* Outer div has scaled height to prevent collapsing */}
      <div style={{ height: scaledHeight, overflow: "hidden", position: "relative" }}>
        <div
          style={{
            width: `${RENDER_WIDTH}px`,
            transformOrigin: "top left",
            transform: `scale(${scale})`,
          }}
        >
          {children}
        </div>
      </div>
      <PreviewPageContent />
    </div>
  );
}

function PreviewPageContent() {
  return (
    <div className="px-8 py-5 border-t border-gray-100 space-y-2">
      <div className="h-3 bg-gray-100 rounded w-2/3" />
      <div className="h-2 bg-gray-50 rounded w-full" />
      <div className="h-2 bg-gray-50 rounded w-5/6" />
      <div className="h-2 bg-gray-50 rounded w-3/4" />
    </div>
  );
}

// ── Main HeaderBuilder ───────────────────────────────────────────────────────
export default function HeaderBuilder() {
  const { showToast } = useToast();
  const [config, setConfig]     = useState(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [previewMode, setPreviewMode] = useState("desktop"); // desktop | mobile
  const [activeTab, setActiveTab] = useState("template");   // template | nav | social | colors | extras
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    apiFetch("/api/admin/header")
      .then(async r => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || `Error ${r.status}`);
        setConfig(d.config || { ...DEFAULT_HEADER_CONFIG });
      })
      .catch(err => { setLoadError(err.message); setConfig({ ...DEFAULT_HEADER_CONFIG }); })
      .finally(() => setLoading(false));
  }, []);

  function set(field, value) { setConfig(c => ({ ...c, [field]: value })); }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await apiFetch("/api/admin/header", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error();
      showToast("Header saved — live on your site", { type: "success" });
    } catch {
      showToast("Couldn't save header", { type: "error" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-8 text-ink-400 text-sm">Loading header config…</div>;

  // Computed inside render so it re-evaluates every time config changes
  const activeTemplateKey = config?.activeTemplate || 'template-1';
  const PreviewTemplate = TEMPLATES[activeTemplateKey] || HeaderTemplate1;

  const TABS = [
    { key: "template", label: "Template" },
    { key: "nav",      label: "Navigation" },
    { key: "social",   label: "Social" },
    { key: "colors",   label: "Colors" },
    { key: "extras",   label: "Extras" },
  ];

  return (
    <div className="flex flex-col h-full min-h-0">

      {/* ── Topbar ── */}
      <div className="flex items-center justify-between px-5 lg:px-8 py-4 border-b border-border bg-white flex-shrink-0">
        <div>
          <h2 className="text-[15px] font-bold text-ink-900">Header Builder</h2>
          {loadError && <p className="text-[11px] text-amber-600 mt-0.5">⚠ Running offline — {loadError}</p>}
        </div>
        <div className="flex items-center gap-3">
          {/* Preview toggle */}
          <div className="flex items-center gap-1 rounded-lg border border-border bg-surface-soft p-1">
            <button onClick={() => setPreviewMode("desktop")} title="Desktop preview"
              className={`p-1.5 rounded-md transition-colors ${previewMode === "desktop" ? "bg-white shadow-soft text-ink-900" : "text-ink-400 hover:text-ink-700"}`}>
              <Monitor size={15} />
            </button>
            <button onClick={() => setPreviewMode("mobile")} title="Mobile preview"
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

        {/* ── Left editor panel ── */}
        <div className="w-full lg:w-[380px] flex-shrink-0 border-r border-border bg-white overflow-y-auto">

          {/* Tabs */}
          <div className="flex border-b border-border overflow-x-auto scrollbar-hide">
            {TABS.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 text-[12.5px] font-semibold uppercase tracking-wide whitespace-nowrap flex-shrink-0 transition-colors ${
                  activeTab === tab.key ? "border-b-2 border-primary text-primary" : "text-ink-400 hover:text-ink-700"
                }`}>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-5 space-y-6">

            {/* ── TEMPLATE TAB ── */}
            {activeTab === "template" && (
              <div className="space-y-3">
                <p className="text-[12px] text-ink-400">Click a variation to switch — the preview updates instantly.</p>
                {TEMPLATE_OPTIONS.map(t => (
                  <button key={t.value} type="button" onClick={() => set("activeTemplate", t.value)}
                    className={`w-full text-left rounded-card border p-4 transition-all ${
                      config.activeTemplate === t.value
                        ? "border-primary bg-primary-50 shadow-soft"
                        : "border-border bg-white hover:border-ink-300"
                    }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-semibold text-ink-900">{t.label}</span>
                      {config.activeTemplate === t.value && (
                        <span className="text-[11px] font-bold uppercase tracking-wide text-primary">Active</span>
                      )}
                    </div>
                    <p className="text-[12px] text-ink-400 mt-0.5">{t.desc}</p>
                  </button>
                ))}
              </div>
            )}

            {/* ── NAV TAB ── */}
            {activeTab === "nav" && (
              <div className="space-y-6">
                <LinkListEditor
                  label="Main Navigation Links"
                  hint="Row 1 — AI, SOCIETY, HEALTH… (pick from a real category, or type your own label/path)"
                  links={config.mainLinks || []}
                  onChange={links => set("mainLinks", links)}
                  categories={categories}
                />
                <div className="h-px bg-border" />
                <LinkListEditor
                  label="Secondary Links"
                  hint="Row 2 — LATEST, NEWSLETTER…"
                  links={config.secondaryLinks || []}
                  onChange={links => set("secondaryLinks", links)}
                />
              </div>
            )}

            {/* ── SOCIAL TAB ── */}
            {activeTab === "social" && (
              <SocialListEditor
                links={config.socialLinks || []}
                onChange={links => set("socialLinks", links)}
              />
            )}

            {/* ── COLORS TAB ── */}
            {activeTab === "colors" && (
              <div className="space-y-4">
                <ColorField label="Background Color" value={config.bgColor} onChange={v => set("bgColor", v)} />
                <ColorField label="Text Color"       value={config.textColor} onChange={v => set("textColor", v)} />
                <ColorField label="Accent Color (red / breaking news / underlines)" value={config.accentColor} onChange={v => set("accentColor", v)} />
                <p className="text-[11px] text-ink-400">Note: Template 4 always uses a dark background (#111) regardless of the background color setting above — it's part of that variation's design.</p>
              </div>
            )}

            {/* ── EXTRAS TAB ── */}
            {activeTab === "extras" && (
              <div className="space-y-6">
                {/* Logo */}
                <div>
                  <p className="text-[13px] font-semibold text-ink-900 mb-2">Logo</p>
                  <input type="text" value={config.logo || ""} onChange={e => set("logo", e.target.value)}
                    placeholder="/images/logo.webp"
                    className="w-full rounded-lg border border-border bg-surface-soft px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>

                <div className="h-px bg-border" />

                {/* Breaking news */}
                <BreakingNewsEditor
                  items={config.breakingNews || []}
                  onChange={items => set("breakingNews", items)}
                />

                <div className="h-px bg-border" />

                {/* Trending topics (V6) */}
                <TrendingEditor
                  topics={config.trendingTopics || []}
                  onChange={topics => set("trendingTopics", topics)}
                />

                <div className="h-px bg-border" />

                {/* Utility bar toggles (V5) */}
                <div>
                  <p className="text-[13px] font-semibold text-ink-900 mb-3">Utility Bar (Variation 5)</p>
                  <div className="space-y-1">
                    <ToggleField label="Show weather" checked={config.showWeather} onChange={v => set("showWeather", v)} />
                    <ToggleField label="Show date"    checked={config.showDate}    onChange={v => set("showDate", v)} />
                    <ToggleField label="Show podcast" checked={config.showPodcast}  onChange={v => set("showPodcast", v)} />
                    <ToggleField label="Show subscribe button" checked={config.showSubscribeButton} onChange={v => set("showSubscribeButton", v)} />
                  </div>
                  {config.showWeather && (
                    <input type="text" value={config.weatherText || ""} onChange={e => set("weatherText", e.target.value)}
                      placeholder="24°C New York, US"
                      className="mt-2 w-full rounded-lg border border-border bg-surface-soft px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  )}
                  {config.showSubscribeButton && (
                    <div className="mt-2 flex gap-2">
                      <input type="text" value={config.subscribeLabel || ""} onChange={e => set("subscribeLabel", e.target.value)}
                        placeholder="Button label"
                        className="flex-1 rounded-lg border border-border bg-surface-soft px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/30" />
                      <input type="text" value={config.subscribeHref || ""} onChange={e => set("subscribeHref", e.target.value)}
                        placeholder="URL"
                        className="flex-1 rounded-lg border border-border bg-surface-soft px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </div>
                  )}
                </div>

                <div className="h-px bg-border" />

                {/* Newsletter button (V3) */}
                <div>
                  <p className="text-[13px] font-semibold text-ink-900 mb-2">Newsletter Button (Variation 3)</p>
                  <div className="flex gap-2">
                    <input type="text" value={config.newsletterLabel || ""} onChange={e => set("newsletterLabel", e.target.value)}
                      placeholder="Button label"
                      className="flex-1 rounded-lg border border-border bg-surface-soft px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    <input type="text" value={config.newsletterHref || ""} onChange={e => set("newsletterHref", e.target.value)}
                      placeholder="URL"
                      className="flex-1 rounded-lg border border-border bg-surface-soft px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ── Right live preview panel ── */}
        <div className="flex-1 bg-surface-soft overflow-auto flex flex-col">
          <div className="flex items-center gap-3 px-5 py-3 border-b border-border bg-white flex-shrink-0">
            <Eye size={14} className="text-ink-400" />
            <span className="text-[12.5px] font-semibold text-ink-600">Live Preview</span>
            <span className="text-[11px] text-ink-400">— updates as you edit</span>
            <div className="ml-auto">
              <span className="text-[11px] text-ink-400 capitalize">{previewMode} view</span>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4">
            <ScaledPreview previewMode={previewMode}>
              <PreviewTemplate key={activeTemplateKey} config={config} />
            </ScaledPreview>
          </div>
        </div>

      </div>
    </div>
  );
}
