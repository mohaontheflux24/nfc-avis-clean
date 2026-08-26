"use client";

import { useEffect, useState } from "react";
import SettingsForm from "@/components/SettingsForm";
import { Copy } from "lucide-react";

export default function DashboardSettings() {
  const [merchant, setMerchant] = useState<any>(null);
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    setBaseUrl(window.location.origin);
    fetch("/api/dashboard/settings")
      .then((r) => r.json())
      .then((d) => setMerchant(d.merchant));
  }, []);

  return (
    <div>
      <div className="mb-7">
        <h1 className="font-display text-[26px] font-medium text-ink-900">Paramètres</h1>
        <p className="font-sans text-sm text-slate-450">
          Personnalisez votre page d&apos;avis et vos canaux de notification.
        </p>
      </div>

      {!merchant ? (
        <div className="card-surface h-96 animate-pulse" />
      ) : (
        <div className="space-y-6">
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

          <div className="card-surface p-6">
            <p className="mb-1 font-sans text-sm font-medium text-ink-800">Mes cartes NFC</p>
            <p className="mb-4 font-sans text-xs text-slate-450">
              Créées et attribuées par l&apos;administrateur. Chaque carte pointe vers votre page d&apos;avis.
            </p>
            <div className="space-y-2">
              {merchant.cards?.length ? (
                merchant.cards.map((card: any) => {
                  const url = `${baseUrl}/r/${card.cardId}`;
                  return (
                    <div
                      key={card.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-ink-800/[0.06] px-4 py-3"
                    >
                      <div>
                        <p className="font-sans text-sm font-medium text-ink-900">{card.label}</p>
                        <p className="font-mono text-xs text-slate-450">{url}</p>
                      </div>
                      <button
                        onClick={() => navigator.clipboard.writeText(url)}
                        className="rounded-lg p-2 text-slate-450 hover:bg-ink-800/5 hover:text-ink-900"
                        aria-label="Copier le lien"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  );
                })
              ) : (
                <p className="font-sans text-sm text-slate-450">
                  Aucune carte attribuée pour le moment.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
