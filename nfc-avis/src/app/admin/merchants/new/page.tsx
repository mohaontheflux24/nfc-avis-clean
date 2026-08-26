"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewMerchantPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    slug: "",
    email: "",
    password: "",
    googleReviewUrl: "",
    whatsappNumber: "",
    contactEmail: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function slugify(v: string) {
    return v
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/merchants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur lors de la création.");
        setLoading(false);
        return;
      }
      router.push(`/admin/merchants/${data.merchant.id}`);
    } catch {
      setError("Erreur lors de la création.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl">
      <Link href="/admin" className="mb-4 inline-flex items-center gap-1.5 font-sans text-sm text-slate-450 hover:text-ink-900">
        <ArrowLeft size={15} /> Retour
      </Link>
      <h1 className="mb-1 font-display text-[26px] font-medium text-ink-900">Nouveau commerce</h1>
      <p className="mb-7 font-sans text-sm text-slate-450">
        Un identifiant de connexion et une première carte NFC seront créés automatiquement.
      </p>

      <form onSubmit={handleSubmit} className="card-surface space-y-5 p-6">
        <div>
          <label className="mb-1.5 block font-sans text-sm font-medium text-ink-800">Nom du commerce</label>
          <input
            value={form.name}
            onChange={(e) => {
              set("name", e.target.value);
              if (!form.slug) set("slug", slugify(e.target.value));
            }}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block font-sans text-sm font-medium text-ink-800">
            Identifiant unique (utilisé dans l&apos;URL de la carte)
          </label>
          <div className="flex items-center gap-2 font-mono text-sm text-slate-450">
            <span>monsite.com/r/</span>
            <input
              value={form.slug}
              onChange={(e) => set("slug", slugify(e.target.value))}
              className="input-field flex-1 font-mono"
              placeholder="le-petit-cafe"
              required
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block font-sans text-sm font-medium text-ink-800">
              E-mail de connexion
            </label>
            <input
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              type="email"
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block font-sans text-sm font-medium text-ink-800">
              Mot de passe temporaire
            </label>
            <input
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              type="text"
              className="input-field"
              placeholder="8 caractères minimum"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block font-sans text-sm font-medium text-ink-800">
            Lien Google Avis
          </label>
          <input
            value={form.googleReviewUrl}
            onChange={(e) => set("googleReviewUrl", e.target.value)}
            className="input-field"
            placeholder="https://g.page/r/…/review"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block font-sans text-sm font-medium text-ink-800">
              Numéro WhatsApp
            </label>
            <input
              value={form.whatsappNumber}
              onChange={(e) => set("whatsappNumber", e.target.value)}
              className="input-field"
              placeholder="+33612345678"
            />
          </div>
          <div>
            <label className="mb-1.5 block font-sans text-sm font-medium text-ink-800">
              E-mail de notification
            </label>
            <input
              value={form.contactEmail}
              onChange={(e) => set("contactEmail", e.target.value)}
              type="email"
              className="input-field"
              placeholder="contact@commerce.fr"
            />
          </div>
        </div>

        {error && <p className="font-sans text-sm text-danger">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Création…" : "Créer le commerce"}
        </button>
      </form>
    </div>
  );
}
