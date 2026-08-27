"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("");
    if (newPassword !== confirmPassword) {
      setStatus("Les deux nouveaux mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Impossible de changer le mot de passe.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setStatus("Mot de passe modifié avec succès.");
    } catch (error: any) {
      setStatus(error?.message || "Impossible de changer le mot de passe.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="card-surface space-y-4 p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/[0.04] text-ink-900">
          <KeyRound size={18} />
        </div>
        <div>
          <h2 className="font-display text-xl font-medium text-ink-900">Sécurité du compte</h2>
          <p className="text-sm text-slate-450">Changez votre mot de passe de connexion.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label>
          <span className="mb-1.5 block text-sm font-medium text-ink-800">Mot de passe actuel</span>
          <input type="password" className="input-field" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
        </label>
        <label>
          <span className="mb-1.5 block text-sm font-medium text-ink-800">Nouveau mot de passe</span>
          <input type="password" className="input-field" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={10} required />
        </label>
        <label>
          <span className="mb-1.5 block text-sm font-medium text-ink-800">Confirmer</span>
          <input type="password" className="input-field" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} minLength={10} required />
        </label>
      </div>

      <p className="text-xs text-slate-450">Minimum 10 caractères avec une majuscule, une minuscule et un chiffre.</p>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={loading} className="btn-primary">{loading ? "Modification…" : "Changer mon mot de passe"}</button>
        {status && <span className="text-sm text-slate-450">{status}</span>}
      </div>
    </form>
  );
}
