"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/layout/AdminShell";
import { useToast } from "@/components/ui/Toast";
import { apiFetch } from "@/lib/apiConfig";
import { ShieldCheck, KeyRound, User } from "lucide-react";

export default function UsersPage() {
  const [account, setAccount] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    apiFetch("/api/admin/account/me")
      .then((r) => r.json())
      .then((d) => setAccount(d.account))
      .catch(() => showToast("Failed to load account", { type: "error" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    if (!currentPassword) {
      showToast("Enter your current password to save changes", { type: "error" });
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      showToast("New password and confirmation don't match", { type: "error" });
      return;
    }
    if (!newUsername && !newPassword) {
      showToast("Enter a new username or new password to update", { type: "error" });
      return;
    }

    setSaving(true);
    try {
      const res = await apiFetch("/api/admin/account/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          ...(newUsername ? { newUsername } : {}),
          ...(newPassword ? { newPassword } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Failed to update account", { type: "error" });
        return;
      }
      setAccount(data.account);
      setCurrentPassword("");
      setNewUsername("");
      setNewPassword("");
      setConfirmPassword("");
      showToast("Account updated");
    } catch {
      showToast("Network error", { type: "error" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell title="Users">
      <div className="p-5 lg:p-8 max-w-xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-ink-900">My Account</h2>
          <p className="text-sm text-ink-500 mt-1">Manage your admin login credentials.</p>
        </div>

        {!account ? (
          <p className="text-sm text-ink-400">Loading account…</p>
        ) : (
          <>
            <div className="rounded-card border border-border bg-white shadow-soft p-5 mb-6 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary-50 flex items-center justify-center text-primary">
                <User size={18} />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-ink-900">{account.username}</p>
                <p className="text-[12.5px] text-ink-500 flex items-center gap-1.5 mt-0.5">
                  {account.hasCustomPassword ? (
                    <><ShieldCheck size={12} className="text-emerald-500" /> Custom password set</>
                  ) : (
                    <><KeyRound size={12} className="text-amber-500" /> Using default .env credentials — set a password below to secure this account</>
                  )}
                </p>
              </div>
            </div>

            <form onSubmit={handleSave} className="rounded-card border border-border bg-white shadow-soft p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">
                  Current Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Required to make any change"
                  className="w-full h-10 px-3 border border-gray-300 text-sm focus:outline-none focus:border-red-500 rounded-lg"
                />
              </div>

              <div className="h-px bg-border" />

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">New Username</label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder={account.username}
                  className="w-full h-10 px-3 border border-gray-300 text-sm focus:outline-none focus:border-red-500 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full h-10 px-3 border border-gray-300 text-sm focus:outline-none focus:border-red-500 rounded-lg"
                />
              </div>

              {newPassword && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-10 px-3 border border-gray-300 text-sm focus:outline-none focus:border-red-500 rounded-lg"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="text-xs bg-red-600 text-white px-5 py-2.5 font-semibold uppercase tracking-widest hover:bg-red-700 disabled:opacity-60 rounded-lg w-full sm:w-auto"
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </form>
          </>
        )}
      </div>
    </AdminShell>
  );
}
