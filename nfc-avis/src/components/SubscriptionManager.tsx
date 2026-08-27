"use client";

import { useMemo, useState } from "react";

const STATUS_LABELS: Record<string, string> = {
  TRIAL: "Essai",
  ACTIVE: "Actif",
  PAST_DUE: "Paiement en retard",
  CANCELED: "Annulé",
};

export default function SubscriptionManager({
  merchantId,
  initial,
  onUpdated,
}: {
  merchantId: string;
  initial: any;
  onUpdated?: (subscription: any) => void;
}) {
  const [plan, setPlan] = useState(initial?.plan || "starter");
  const [status, setStatus] = useState(initial?.status || "TRIAL");
  const [trialEndsAt, setTrialEndsAt] = useState(initial?.trialEndsAt ? String(initial.trialEndsAt).slice(0, 10) : "");
  const [endsAt, setEndsAt] = useState(initial?.endsAt ? String(initial.endsAt).slice(0, 10) : "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const statusLabel = useMemo(() => STATUS_LABELS[status] || status, [status]);

  async function save(next?: Partial<{ plan: string; status: string; trialEndsAt: string; endsAt: string }>) {
    setLoading(true);
    setMessage("");
    const payload = {
      plan: next?.plan ?? plan,
      status: next?.status ?? status,
      trialEndsAt: (next?.trialEndsAt ?? trialEndsAt) || null,
      endsAt: (next?.endsAt ?? endsAt) || null,
    };

    try {
      const res = await fetch(`/api/admin/merchants/${merchantId}/subscription`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setPlan(data.subscription.plan);
      setStatus(data.subscription.status);
      setTrialEndsAt(data.subscription.trialEndsAt ? String(data.subscription.trialEndsAt).slice(0, 10) : "");
      setEndsAt(data.subscription.endsAt ? String(data.subscription.endsAt).slice(0, 10) : "");
      setMessage("Abonnement mis à jour");
      onUpdated?.(data.subscription);
    } catch (e: any) {
      setMessage(e?.message || "Impossible de modifier l'abonnement");
    } finally {
      setLoading(false);
    }
  }

  function extendTrial(days: number) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    const value = d.toISOString().slice(0, 10);
    setStatus("TRIAL");
    setTrialEndsAt(value);
    setEndsAt("");
    save({ status: "TRIAL", trialEndsAt: value, endsAt: "" });
  }

  function activateMonths(months: number) {
    const d = new Date();
    d.setMonth(d.getMonth() + months);
    const value = d.toISOString().slice(0, 10);
    setStatus("ACTIVE");
    setEndsAt(value);
    setTrialEndsAt("");
    save({ status: "ACTIVE", endsAt: value, trialEndsAt: "" });
  }

  return (
    <section className="card-surface p-6">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-medium text-ink-900">Abonnement</h2>
          <p className="text-sm text-slate-450">Contrôle l'accès au dashboard et au lien NFC du commerçant.</p>
        </div>
        <span className="rounded-full bg-black/[0.04] px-3 py-1 text-xs font-semibold text-ink-800">{statusLabel}</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label>
          <span className="mb-1.5 block text-xs font-medium text-slate-450">Formule</span>
          <select value={plan} onChange={(e) => setPlan(e.target.value)} className="input-field">
            <option value="starter">Starter</option>
            <option value="pro">Pro</option>
            <option value="premium">Premium</option>
          </select>
        </label>
        <label>
          <span className="mb-1.5 block text-xs font-medium text-slate-450">Statut</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-field">
            <option value="TRIAL">Essai</option>
            <option value="ACTIVE">Actif</option>
            <option value="PAST_DUE">Paiement en retard</option>
            <option value="CANCELED">Annulé</option>
          </select>
        </label>
        <label>
          <span className="mb-1.5 block text-xs font-medium text-slate-450">Fin d'essai</span>
          <input type="date" value={trialEndsAt} onChange={(e) => setTrialEndsAt(e.target.value)} className="input-field" />
        </label>
        <label>
          <span className="mb-1.5 block text-xs font-medium text-slate-450">Fin d'abonnement</span>
          <input type="date" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} className="input-field" />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button onClick={() => extendTrial(14)} disabled={loading} className="btn-ghost">Essai +14 jours</button>
        <button onClick={() => activateMonths(1)} disabled={loading} className="btn-ghost">Activer 1 mois</button>
        <button onClick={() => activateMonths(12)} disabled={loading} className="btn-ghost">Activer 1 an</button>
        <button onClick={() => save({ status: "CANCELED", endsAt: "", trialEndsAt: "" })} disabled={loading} className="btn-ghost">Suspendre</button>
        <button onClick={() => save()} disabled={loading} className="btn-primary">{loading ? "Enregistrement..." : "Enregistrer"}</button>
      </div>

      {message && <p className="mt-3 text-sm text-slate-450">{message}</p>}
    </section>
  );
}
