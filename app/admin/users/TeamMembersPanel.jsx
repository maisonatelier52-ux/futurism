"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import Toggle from "@/components/ui/Toggle";
import { apiFetch } from "@/lib/apiConfig";
import { PERMISSION_ITEMS, DEFAULT_PERMISSIONS } from "@/lib/permissions";
import { ShieldCheck, SquarePen, Palette } from "lucide-react";

const ROLE_META = {
  editor: { label: "Editor", icon: SquarePen, blurb: "Adds and manages content — articles, categories, and authors." },
  stylist: { label: "Stylist", icon: Palette, blurb: "Controls page design and layout via the visual builders." },
};

function RoleCard({ role, existing, onSaved }) {
  const meta = ROLE_META[role];
  const Icon = meta.icon;
  const [username, setUsername] = useState(existing?.username || "");
  const [password, setPassword] = useState("");
  const [permissions, setPermissions] = useState(existing?.permissions || DEFAULT_PERMISSIONS[role]);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  function togglePermission(key) {
    setPermissions((prev) => (prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]));
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!existing && (!username || !password)) {
      showToast("Username and password are required to create this account", { type: "error" });
      return;
    }
    if (password && password.length < 8) {
      showToast("Password must be at least 8 characters", { type: "error" });
      return;
    }

    setSaving(true);
    try {
      const res = existing
        ? await apiFetch(`/api/admin/team-users/${role}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...(username !== existing.username ? { username } : {}),
              ...(password ? { password } : {}),
              permissions,
            }),
          })
        : await apiFetch("/api/admin/team-users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role, username, password, permissions }),
          });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || `Failed to save ${meta.label} account`, { type: "error" });
        return;
      }
      setPassword("");
      onSaved(data.user);
      showToast(`${meta.label} account saved`);
    } catch {
      showToast("Network error", { type: "error" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="rounded-card border border-border bg-white shadow-soft p-5 space-y-5">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary-50 flex items-center justify-center text-primary shrink-0">
          <Icon size={18} />
        </div>
        <div>
          <p className="text-[14px] font-semibold text-ink-900">{meta.label}</p>
          <p className="text-[12.5px] text-ink-500">{meta.blurb}</p>
        </div>
        {existing && (
          <span className="ml-auto flex items-center gap-1 text-[11.5px] text-emerald-600 font-medium">
            <ShieldCheck size={12} /> Active
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={`e.g. ${role}1`}
            className="w-full h-10 px-3 border border-gray-300 text-sm focus:outline-none focus:border-red-500 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">
            {existing ? "New Password" : "Password"}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={existing ? "Leave blank to keep current" : "At least 8 characters"}
            className="w-full h-10 px-3 border border-gray-300 text-sm focus:outline-none focus:border-red-500 rounded-lg"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
          Sidebar Access
        </label>
        <div className="divide-y divide-border rounded-lg border border-border overflow-hidden">
          {PERMISSION_ITEMS.map((item) => {
            const ItemIcon = item.icon;
            const checked = permissions.includes(item.key);
            return (
              <div key={item.key} className="flex items-center justify-between px-3.5 py-2.5">
                <span className="flex items-center gap-2.5 text-[13px] text-ink-700">
                  <ItemIcon size={14} className="text-ink-400" />
                  {item.label}
                </span>
                <Toggle checked={checked} onChange={() => togglePermission(item.key)} label={`${item.label} access`} />
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="text-xs bg-red-600 text-white px-5 py-2.5 font-semibold uppercase tracking-widest hover:bg-red-700 disabled:opacity-60 rounded-lg w-full sm:w-auto"
      >
        {saving ? "Saving…" : existing ? "Save Changes" : `Create ${meta.label} Account`}
      </button>
    </form>
  );
}

export default function TeamMembersPanel() {
  const [data, setData] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    apiFetch("/api/admin/team-users")
      .then((r) => r.json())
      .then(setData)
      .catch(() => showToast("Failed to load team accounts", { type: "error" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!data) {
    return <p className="text-sm text-ink-400">Loading team accounts…</p>;
  }

  return (
    <div className="space-y-6">
      <RoleCard role="editor" existing={data.editor} onSaved={(user) => setData((d) => ({ ...d, editor: user }))} />
      <RoleCard role="stylist" existing={data.stylist} onSaved={(user) => setData((d) => ({ ...d, stylist: user }))} />
    </div>
  );
}
