"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Plus, Trash2, Save, ExternalLink, Eye, Monitor, Smartphone } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { apiFetch } from "@/lib/apiConfig";
import { DEFAULT_FOOTER_CONFIG } from "@/lib/footerDefaults";
import { getCategories } from "@/lib/categoriesArticlesApi";

import FooterTemplate1 from "@/components/footer-templates/FooterTemplate1";
import FooterTemplate2 from "@/components/footer-templates/FooterTemplate2";
import FooterTemplate3 from "@/components/footer-templates/FooterTemplate3";
import FooterTemplate4 from "@/components/footer-templates/FooterTemplate4";
import FooterTemplate5 from "@/components/footer-templates/FooterTemplate5";
import FooterTemplate6 from "@/components/footer-templates/FooterTemplate6";

const TEMPLATES = {
  "template-1": FooterTemplate1,
  "template-2": FooterTemplate2,
  "template-3": FooterTemplate3,
  "template-4": FooterTemplate4,
  "template-5": FooterTemplate5,
  "template-6": FooterTemplate6,
};

const TEMPLATE_OPTIONS = [
  { value: "template-1", label: "Variation 1", desc: "Original — logo + newsletter box + dotted nav + categories" },
  { value: "template-2", label: "Variation 2", desc: "5-col horizontal row + full-width disclaimer bar" },
  { value: "template-3", label: "Variation 3", desc: "Top links row + 3-col: newsletter | disclaimer | categories" },
  { value: "template-4", label: "Variation 4", desc: "Dark theme — 4-col: logo | links | categories | newsletter" },
  { value: "template-5", label: "Variation 5", desc: "Magazine 5-col with icon section headers" },
  { value: "template-6", label: "Variation 6", desc: "Dark left logo panel + 3 light content columns" },
];

const SOCIAL_PLATFORMS = ["instagram", "twitter", "substack", "facebook", "youtube", "linkedin", "tiktok"];

// ── Reusable link list editor ────────────────────────────────────────────────
function LinkListEditor({ label, links = [], onChange, hint, categories = [] }) {
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
            <Plus size={12} /> Add
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
            <input type="text" value={link.name || ""} onChange={e => update(i, "name", e.target.value)} placeholder="Label"
              className="flex-1 rounded-lg border border-border bg-surface-soft px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <input type="text" value={link.href || ""} onChange={e => update(i, "href", e.target.value)} placeholder="/path or #"
              className="flex-1 rounded-lg border border-border bg-surface-soft px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <button type="button" onClick={() => remove(i)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg flex-shrink-0">
              <Trash2 size={13} />
            </button>
          </div>
        ))}
        {links.length === 0 && <p className="text-[12px] text-ink-400 italic py-1">No links — click Add.</p>}
      </div>
    </div>
  );
}

// ── Social editor ────────────────────────────────────────────────────────────
function SocialListEditor({ links = [], onChange }) {
  function update(i, field, value) { onChange(links.map((l, idx) => idx === i ? { ...l, [field]: value } : l)); }
  function add() { onChange([...links, { platform: "instagram", href: "#" }]); }
  function remove(i) { onChange(links.filter((_, idx) => idx !== i)); }
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[13px] font-semibold text-ink-900">Social Icons</p>
        <button type="button" onClick={add} className="flex items-center gap-1 text-[12px] text-primary hover:underline"><Plus size={12} /> Add</button>
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
            <button type="button" onClick={() => remove(i)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={13} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Scaled preview ───────────────────────────────────────────────────────────
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
        {children}
      </div>
    );
  }

  return (
    <div ref={outerRef} className="w-full bg-white shadow-lift rounded-lg overflow-hidden">
      <div style={{ height: `${Math.round(scale * 320)}px`, overflow: "hidden", position: "relative" }}>
        <div style={{ width: `${RENDER_WIDTH}px`, transformOrigin: "top left", transform: `scale(${scale})` }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Main FooterBuilder ───────────────────────────────────────────────────────
export default function FooterBuilder() {
  const { showToast } = useToast();
  const [config, setConfig]       = useState(null);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [previewMode, setPreviewMode] = useState("desktop");
  const [activeTab, setActiveTab]     = useState("template");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    apiFetch("/api/admin/footer")
      .then(async r => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || `Error ${r.status}`);
        setConfig(d.config || { ...DEFAULT_FOOTER_CONFIG });
      })
      .catch(err => { setLoadError(err.message); setConfig({ ...DEFAULT_FOOTER_CONFIG }); })
      .finally(() => setLoading(false));
  }, []);

  function set(field, value) { setConfig(c => ({ ...c, [field]: value })); }
  function setNewsletter(field, value) { setConfig(c => ({ ...c, newsletter: { ...c.newsletter, [field]: value } })); }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await apiFetch("/api/admin/footer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error();
      showToast("Footer saved — live on your site", { type: "success" });
    } catch {
      showToast("Couldn't save footer", { type: "error" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-8 text-ink-400 text-sm">Loading footer config…</div>;

  const activeKey = config?.activeTemplate || "template-1";
  const PreviewTemplate = TEMPLATES[activeKey] || FooterTemplate1;

  const TABS = [
    { key: "template", label: "Template" },
    { key: "links",    label: "Links" },
    { key: "social",   label: "Social" },
    { key: "newsletter", label: "Newsletter" },
    { key: "legal",    label: "Legal" },
  ];

  return (
    <div className="flex flex-col h-full min-h-0">

      {/* Topbar */}
      <div className="flex items-center justify-between px-5 lg:px-8 py-4 border-b border-border bg-white flex-shrink-0">
        <div>
          <h2 className="text-[15px] font-bold text-ink-900">Footer Builder</h2>
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

        {/* Editor panel */}
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

            {/* TEMPLATE TAB */}
            {activeTab === "template" && (
              <div className="space-y-3">
                <p className="text-[12px] text-ink-400">Click a variation to switch — preview updates instantly.</p>
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

            {/* LINKS TAB */}
            {activeTab === "links" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-[12px] font-medium text-ink-500 mb-1.5">Logo Path</label>
                  <input type="text" value={config.logo || ""} onChange={e => set("logo", e.target.value)}
                    className="w-full rounded-lg border border-border bg-surface-soft px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div className="h-px bg-border" />
                <LinkListEditor label="Center Navigation" hint="ABOUT US, EDITORIAL STANDARDS, CONTACTS"
                  links={config.centerLinks || []} onChange={links => set("centerLinks", links)} />
                <div className="h-px bg-border" />
                <LinkListEditor label="Legal Links" hint="PRIVACY POLICY, TERMS & CONDITIONS…"
                  links={config.legalLinks || []} onChange={links => set("legalLinks", links)} />
                <div className="h-px bg-border" />
                <LinkListEditor label="Category Links (Right Column)"
                  links={config.categoryLinks || []} onChange={links => set("categoryLinks", links)}
                  categories={categories} />
              </div>
            )}

            {/* SOCIAL TAB */}
            {activeTab === "social" && (
              <SocialListEditor links={config.socialLinks || []} onChange={links => set("socialLinks", links)} />
            )}

            {/* NEWSLETTER TAB */}
            {activeTab === "newsletter" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[12px] font-medium text-ink-500 mb-1.5">Heading</label>
                  <textarea value={config.newsletter?.heading || ""} onChange={e => setNewsletter("heading", e.target.value)} rows={2}
                    className="w-full rounded-lg border border-border bg-surface-soft px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-ink-500 mb-1.5">Subtext</label>
                  <textarea value={config.newsletter?.subtext || ""} onChange={e => setNewsletter("subtext", e.target.value)} rows={2}
                    className="w-full rounded-lg border border-border bg-surface-soft px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-ink-500 mb-1.5">Button Label</label>
                  <input type="text" value={config.newsletter?.buttonLabel || ""} onChange={e => setNewsletter("buttonLabel", e.target.value)}
                    className="w-full rounded-lg border border-border bg-surface-soft px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-ink-500 mb-1.5">Box Background (Variation 1)</label>
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-soft px-2 py-1.5">
                    <input type="color" value={config.newsletter?.bgColor || "#1f2326"} onChange={e => setNewsletter("bgColor", e.target.value)} className="h-6 w-6 rounded cursor-pointer border-0" />
                    <input type="text"  value={config.newsletter?.bgColor || "#1f2326"} onChange={e => setNewsletter("bgColor", e.target.value)} className="flex-1 bg-transparent text-[12.5px] text-ink-700 focus:outline-none font-mono" />
                  </div>
                </div>
              </div>
            )}

            {/* LEGAL TAB */}
            {activeTab === "legal" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[12px] font-medium text-ink-500 mb-1.5">Disclaimer</label>
                  <textarea value={config.disclaimer || ""} onChange={e => set("disclaimer", e.target.value)} rows={4}
                    className="w-full rounded-lg border border-border bg-surface-soft px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-ink-500 mb-1.5">Copyright</label>
                  <input type="text" value={config.copyright || ""} onChange={e => set("copyright", e.target.value)}
                    className="w-full rounded-lg border border-border bg-surface-soft px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Live preview panel */}
        <div className="flex-1 bg-surface-soft overflow-auto flex flex-col">
          <div className="flex items-center gap-3 px-5 py-3 border-b border-border bg-white flex-shrink-0">
            <Eye size={14} className="text-ink-400" />
            <span className="text-[12.5px] font-semibold text-ink-600">Live Preview</span>
            <span className="text-[11px] text-ink-400">— updates as you edit</span>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <ScaledPreview previewMode={previewMode}>
              <PreviewTemplate key={activeKey} config={config} />
            </ScaledPreview>
          </div>
        </div>

      </div>
    </div>
  );
}
