"use client";

import { useState } from "react";

export default function SettingsForm({ initial }: { initial: any }) {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Enregistrement…");
    try {
      const res = await fetch("/api/dashboard/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "Enregistré" : "Erreur lors de l’enregistrement");
    } catch {
      setStatus("Erreur lors de l’enregistrement");
    }
  }

  const fields = [
    ["name", "Nom du commerce"],
    ["logoUrl", "URL du logo"],
    ["googleReviewUrl", "Lien Google Avis"],
    ["whatsappNumber", "WhatsApp"],
    ["contactEmail", "E-mail"],
    ["primaryColor", "Couleur principale"],
    ["accentColor", "Couleur accent"],
  ] as const;

  return (
    <form onSubmit={submit} className="card-surface space-y-4 p-6">
      <div>
        <h2 className="font-display text-xl font-medium text-ink-900">Paramètres du commerce</h2>
        <p className="text-sm text-slate-450">Modifiez les informations affichées sur la page d’avis.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map(([key, label]) => (
          <label key={key} className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-800">{label}</span>
            <input
              className="input-field"
              value={form?.[key] ?? ""}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          </label>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" className="btn-primary">Enregistrer</button>
        {status && <span className="text-sm text-slate-450">{status}</span>}
      </div>
    </form>
  );
}
