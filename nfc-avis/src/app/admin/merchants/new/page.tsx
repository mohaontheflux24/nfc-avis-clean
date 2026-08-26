"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, ExternalLink } from "lucide-react";

export default function NewMerchantPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", googleReviewUrl: "", logoUrl: "", primaryColor: "#14141c" });
  const [created, setCreated] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/merchants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error || "Erreur lors de la création.");
    setCreated(data);
  }

  if (created) {
    const publicUrl = `${window.location.origin}${created.publicPath}`;
    return (
      <div className="max-w-xl">
        <h1 className="mb-2 font-display text-[28px] font-medium text-ink-900">Commerce créé</h1>
        <p className="mb-6 text-sm text-slate-450">Le compte, le lien public et la première carte NFC ont été générés automatiquement.</p>
        <div className="card-surface space-y-4 p-6">
          <div><p className="text-xs text-slate-450">Email de connexion</p><p className="font-mono text-sm">{form.email}</p></div>
          <div><p className="text-xs text-slate-450">Mot de passe temporaire</p><div className="flex items-center gap-2"><p className="font-mono text-sm font-semibold">{created.temporaryPassword}</p><button onClick={() => navigator.clipboard.writeText(created.temporaryPassword)}><Copy size={15}/></button></div></div>
          <div><p className="text-xs text-slate-450">Page d'avis</p><div className="flex items-center gap-2"><p className="truncate font-mono text-xs">{publicUrl}</p><button onClick={() => navigator.clipboard.writeText(publicUrl)}><Copy size={15}/></button></div></div>
          <div className="flex gap-3 pt-2">
            <a href={publicUrl} target="_blank" className="btn-ghost"><ExternalLink size={15}/> Tester la page</a>
            <Link href={`/admin/merchants/${created.merchant.id}`} className="btn-primary">Ouvrir le commerce</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <Link href="/admin" className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-450"><ArrowLeft size={15}/> Retour</Link>
      <h1 className="mb-1 font-display text-[26px] font-medium text-ink-900">Nouveau commerce</h1>
      <p className="mb-7 text-sm text-slate-450">Tu remplis 4 informations, le reste est créé automatiquement.</p>
      <form onSubmit={handleSubmit} className="card-surface space-y-5 p-6">
        <div><label className="mb-1.5 block text-sm font-medium">Nom du commerce</label><input value={form.name} onChange={(e)=>set("name",e.target.value)} className="input-field" required/></div>
        <div><label className="mb-1.5 block text-sm font-medium">Email du commerçant</label><input value={form.email} onChange={(e)=>set("email",e.target.value)} type="email" className="input-field" required/></div>
        <div><label className="mb-1.5 block text-sm font-medium">Numéro / WhatsApp</label><input value={form.phone} onChange={(e)=>set("phone",e.target.value)} className="input-field" placeholder="+32 ..."/></div>
        <div><label className="mb-1.5 block text-sm font-medium">Lien Google Avis</label><input value={form.googleReviewUrl} onChange={(e)=>set("googleReviewUrl",e.target.value)} className="input-field" placeholder="https://g.page/r/.../review" required/></div>
        <div><label className="mb-1.5 block text-sm font-medium">Logo (facultatif)</label><input value={form.logoUrl} onChange={(e)=>set("logoUrl",e.target.value)} className="input-field" placeholder="https://..."/></div>
        {error && <p className="text-sm text-danger">{error}</p>}
        <button disabled={loading} className="btn-primary w-full">{loading ? "Création..." : "Créer automatiquement le commerce"}</button>
      </form>
    </div>
  );
}
