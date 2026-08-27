"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Copy, ExternalLink, KeyRound, SmartphoneNfc, UserRound } from "lucide-react";

export default function NewMerchantPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    googleReviewUrl: "",
    logoUrl: "",
    primaryColor: "#14141c",
  });
  const [created, setCreated] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState("");

  function set(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function copy(value: string, key: string) {
    await navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(""), 1600);
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

    if (!res.ok) {
      setError(data.error || "Erreur lors de la création.");
      return;
    }

    setCreated(data);
  }

  if (created) {
    const publicUrl = `${window.location.origin}${created.publicPath}`;
    const loginUrl = `${window.location.origin}/login`;
    const credentials = `Connexion commerçant\nEmail : ${form.email}\nMot de passe temporaire : ${created.temporaryPassword}\nLien : ${loginUrl}`;

    return (
      <div className="max-w-2xl">
        <div className="mb-6">
          <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <Check size={14} /> Création terminée
          </p>
          <h1 className="font-display text-[28px] font-medium text-ink-900">{form.name} est prêt</h1>
          <p className="mt-2 text-sm text-slate-450">
            Le compte commerçant, sa page d&apos;avis et sa première carte NFC virtuelle ont été créés automatiquement.
          </p>
        </div>

        <div className="space-y-5">
          <section className="card-surface p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-900 text-white">
                <SmartphoneNfc size={19} />
              </div>
              <div>
                <h2 className="font-display text-xl font-medium text-ink-900">Lien à mettre dans NFC Tools</h2>
                <p className="text-sm text-slate-450">C&apos;est ce lien que tu écris sur la carte NFC physique.</p>
              </div>
            </div>

            <div className="rounded-xl border border-black/5 bg-black/[0.02] p-4">
              <p className="break-all font-mono text-sm text-ink-900">{publicUrl}</p>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button onClick={() => copy(publicUrl, "nfc")} className="btn-primary">
                {copied === "nfc" ? <Check size={16} /> : <Copy size={16} />}
                {copied === "nfc" ? "Copié" : "Copier le lien NFC"}
              </button>
              <a href={publicUrl} target="_blank" rel="noreferrer" className="btn-ghost">
                <ExternalLink size={15} /> Tester le formulaire
              </a>
            </div>

            <div className="mt-5 rounded-xl bg-brass-50 p-4 text-sm leading-6 text-ink-800">
              <strong>Dans NFC Tools :</strong> Écrire → Ajouter un enregistrement → URL/URI → colle ce lien → Écrire → approche la carte du téléphone.
            </div>
          </section>

          <section className="card-surface p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/[0.04] text-ink-900">
                <UserRound size={19} />
              </div>
              <div>
                <h2 className="font-display text-xl font-medium text-ink-900">Accès du commerçant</h2>
                <p className="text-sm text-slate-450">À lui transmettre pour qu&apos;il consulte ses retours et ses statistiques.</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-slate-450">Email de connexion</p>
                <p className="mt-1 break-all font-mono text-sm text-ink-900">{form.email}</p>
              </div>
              <div>
                <p className="text-xs text-slate-450">Mot de passe temporaire</p>
                <div className="mt-1 flex items-center gap-2">
                  <p className="font-mono text-sm font-semibold text-ink-900">{created.temporaryPassword}</p>
                  <button onClick={() => copy(created.temporaryPassword, "password")} className="rounded-lg p-1.5 hover:bg-black/[0.04]">
                    {copied === "password" ? <Check size={15} /> : <Copy size={15} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs text-slate-450">Page de connexion commerçant</p>
              <p className="mt-1 break-all font-mono text-sm text-ink-900">{loginUrl}</p>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button onClick={() => copy(credentials, "credentials")} className="btn-ghost">
                {copied === "credentials" ? <Check size={15} /> : <KeyRound size={15} />}
                {copied === "credentials" ? "Identifiants copiés" : "Copier les identifiants"}
              </button>
              <a href={loginUrl} target="_blank" rel="noreferrer" className="btn-ghost">
                <ExternalLink size={15} /> Ouvrir la connexion
              </a>
            </div>
          </section>

          <section className="card-surface p-6">
            <h2 className="font-display text-xl font-medium text-ink-900">Ce qui se passe quand la carte est scannée</h2>
            <div className="mt-4 grid gap-3 text-sm text-ink-800 sm:grid-cols-3">
              <div className="rounded-xl bg-black/[0.025] p-4"><strong>1.</strong> Le client arrive sur la page avec les étoiles.</div>
              <div className="rounded-xl bg-black/[0.025] p-4"><strong>2.</strong> 4–5★ : bouton puis redirection vers Google Avis.</div>
              <div className="rounded-xl bg-black/[0.025] p-4"><strong>3.</strong> 1–3★ : formulaire privé enregistré dans le dashboard commerçant.</div>
            </div>
          </section>

          <div className="flex flex-wrap gap-3">
            <Link href={`/admin/merchants/${created.merchant.id}`} className="btn-primary">Ouvrir le commerce</Link>
            <Link href="/admin" className="btn-ghost">Retour aux commerces</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <Link href="/admin" className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-450">
        <ArrowLeft size={15} /> Retour
      </Link>
      <h1 className="mb-1 font-display text-[26px] font-medium text-ink-900">Nouveau commerce</h1>
      <p className="mb-7 text-sm text-slate-450">
        Entre les informations du client. Le compte commerçant et le lien à programmer sur la carte NFC seront générés automatiquement.
      </p>

      <form onSubmit={handleSubmit} className="card-surface space-y-5 p-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Nom du commerce</label>
          <input value={form.name} onChange={(e) => set("name", e.target.value)} className="input-field" required />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Email du commerçant</label>
          <input value={form.email} onChange={(e) => set("email", e.target.value)} type="email" className="input-field" required />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Numéro / WhatsApp</label>
          <input value={form.phone} onChange={(e) => set("phone", e.target.value)} className="input-field" placeholder="+32 ..." />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Lien Google Avis</label>
          <input value={form.googleReviewUrl} onChange={(e) => set("googleReviewUrl", e.target.value)} className="input-field" placeholder="https://g.page/r/.../review" required />
          <p className="mt-1.5 text-xs text-slate-450">Ce lien sera utilisé après une note de 4 ou 5 étoiles.</p>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Logo (facultatif)</label>
          <input value={form.logoUrl} onChange={(e) => set("logoUrl", e.target.value)} className="input-field" placeholder="https://..." />
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <button disabled={loading} className="btn-primary w-full">
          {loading ? "Création..." : "Créer le commerce et générer le lien NFC"}
        </button>
      </form>
    </div>
  );
}
