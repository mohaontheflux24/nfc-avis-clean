"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Copy, Plus, Trash2 } from "lucide-react";
import SettingsForm from "@/components/SettingsForm";
import StatCard from "@/components/StatCard";
import ReviewsTable from "@/components/ReviewsTable";

export default function AdminMerchantDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [merchant, setMerchant] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [baseUrl, setBaseUrl] = useState("");
  const [newCardLabel, setNewCardLabel] = useState("");
  const [newCardId, setNewCardId] = useState("");
  const [cardError, setCardError] = useState("");

  function load() {
    fetch(`/api/admin/merchants/${params.id}`)
      .then((r) => r.json())
      .then((d) => {
        setMerchant(d.merchant);
        setStats(d.stats);
      });
  }

  useEffect(() => {
    setBaseUrl(window.location.origin);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function handleAddCard(e: React.FormEvent) {
    e.preventDefault();
    setCardError("");
    const res = await fetch("/api/admin/cards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchantId: params.id,
        cardId: newCardId,
        label: newCardLabel || "Carte NFC",
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setCardError(data.error || "Erreur");
      return;
    }
    setNewCardLabel("");
    setNewCardId("");
    load();
  }

  async function handleDeleteCard(id: string) {
    if (!confirm("Supprimer cette carte NFC ?")) return;
    await fetch(`/api/admin/cards/${id}`, { method: "DELETE" });
    load();
  }

  async function handleDeleteMerchant() {
    if (!confirm("Supprimer définitivement ce commerce et toutes ses données ?")) return;
    await fetch(`/api/admin/merchants/${params.id}`, { method: "DELETE" });
    router.push("/admin");
  }

  if (!merchant) return <div className="card-surface h-96 animate-pulse" />;

  return (
    <div>
      <div className="mb-7 flex items-center justify-between">
        <div>
          <Link href="/admin" className="mb-2 inline-flex items-center gap-1.5 font-sans text-sm text-slate-450 hover:text-ink-900">
            <ArrowLeft size={15} /> Retour
          </Link>
          <h1 className="font-display text-[26px] font-medium text-ink-900">{merchant.name}</h1>
          <p className="font-mono text-xs text-slate-450">{merchant.user?.email}</p>
        </div>
        <button
          onClick={handleDeleteMerchant}
          className="inline-flex items-center gap-1.5 rounded-full border border-danger/20 px-4 py-2 font-sans text-sm font-medium text-danger hover:bg-danger/5"
        >
          <Trash2 size={15} />
          Supprimer
        </button>
      </div>

      {stats && (
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
          <StatCard label="Scans" value={stats.scans} />
          <StatCard label="Avis" value={stats.reviewsCount} />
          <StatCard label="Clics Google" value={stats.clicks} />
          <StatCard label="Conversion" value={stats.conversionRate} suffix="%" />
          <StatCard label="Note moy." value={stats.averageRating || "—"} suffix="/5" />
        </div>
      )}

      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SettingsForm
            initial={{
              name: merchant.name,
              logoUrl: merchant.logoUrl,
              googleReviewUrl: merchant.googleReviewUrl,
              whatsappNumber: merchant.whatsappNumber,
              contactEmail: merchant.contactEmail,
              primaryColor: merchant.primaryColor,
              accentColor: merchant.accentColor,
            }}
          />
        </div>

        <div className="card-surface p-6">
          <p className="mb-4 font-sans text-sm font-medium text-ink-800">Cartes NFC</p>
          <div className="mb-4 space-y-2">
            {merchant.cards.map((card: any) => {
              const url = `${baseUrl}/r/${card.cardId}`;
              return (
                <div key={card.id} className="rounded-xl border border-ink-800/[0.06] px-3 py-2.5">
                  <div className="flex items-center justify-between">
                    <p className="font-sans text-sm font-medium text-ink-900">{card.label}</p>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => navigator.clipboard.writeText(url)}
                        className="rounded-md p-1.5 text-slate-450 hover:bg-ink-800/5 hover:text-ink-900"
                        aria-label="Copier le lien"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteCard(card.id)}
                        className="rounded-md p-1.5 text-slate-450 hover:bg-danger/10 hover:text-danger"
                        aria-label="Supprimer la carte"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="mt-0.5 truncate font-mono text-xs text-slate-450">{url}</p>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleAddCard} className="space-y-2 border-t border-ink-800/[0.06] pt-4">
            <p className="font-sans text-xs font-medium text-slate-450">Ajouter une carte</p>
            <input
              value={newCardLabel}
              onChange={(e) => setNewCardLabel(e.target.value)}
              placeholder="Ex : Comptoir caisse"
              className="input-field !py-2 text-sm"
            />
            <input
              value={newCardId}
              onChange={(e) =>
                setNewCardId(
                  e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9-]+/g, "-")
                    .replace(/(^-|-$)/g, "")
                )
              }
              placeholder="identifiant-carte-unique"
              className="input-field !py-2 font-mono text-sm"
              required
            />
            {cardError && <p className="font-sans text-xs text-danger">{cardError}</p>}
            <button type="submit" className="btn-ghost w-full !py-2 text-sm">
              <Plus size={15} />
              Ajouter la carte
            </button>
          </form>
        </div>
      </div>

      {stats && (
        <div>
          <p className="mb-3 font-sans text-sm font-medium text-ink-800">Historique des avis</p>
          <ReviewsTable reviews={stats.recentReviews} />
        </div>
      )}
    </div>
  );
}
