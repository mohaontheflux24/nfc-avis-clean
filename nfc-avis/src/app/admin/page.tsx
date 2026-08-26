"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, QrCode } from "lucide-react";
import StatCard from "@/components/StatCard";

export default function AdminMerchantsPage() {
  const [merchants, setMerchants] = useState<any[] | null>(null);

  useEffect(() => {
    fetch("/api/admin/merchants")
      .then((r) => r.json())
      .then((d) => setMerchants(d.merchants));
  }, []);

  const totals = merchants?.reduce(
    (acc, m) => ({
      scans: acc.scans + m._count.scans,
      reviews: acc.reviews + m._count.reviews,
      clicks: acc.clicks + m._count.clicks,
    }),
    { scans: 0, reviews: 0, clicks: 0 }
  );

  return (
    <div>
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[26px] font-medium text-ink-900">Commerces</h1>
          <p className="font-sans text-sm text-slate-450">
            Gérez tous les commerces et leurs cartes NFC.
          </p>
        </div>
        <Link href="/admin/merchants/new" className="btn-primary">
          <Plus size={17} />
          Nouveau commerce
        </Link>
      </div>

      {!merchants ? (
        <div className="card-surface h-40 animate-pulse" />
      ) : (
        <>
          <div className="mb-6 grid grid-cols-3 gap-4">
            <StatCard label="Commerces" value={merchants.length} />
            <StatCard label="Scans totaux" value={totals?.scans ?? 0} />
            <StatCard label="Clics Google totaux" value={totals?.clicks ?? 0} />
          </div>

          <div className="card-surface overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-ink-800/[0.06] font-sans text-xs font-medium uppercase tracking-wide text-slate-450">
                  <th className="px-5 py-3.5">Commerce</th>
                  <th className="px-5 py-3.5">Cartes</th>
                  <th className="px-5 py-3.5">Scans</th>
                  <th className="px-5 py-3.5">Avis</th>
                  <th className="px-5 py-3.5">Note moy.</th>
                  <th className="px-5 py-3.5">Clics Google</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-800/[0.06]">
                {merchants.map((m) => (
                  <tr
                    key={m.id}
                    className="cursor-pointer hover:bg-ink-800/[0.02]"
                    onClick={() => (window.location.href = `/admin/merchants/${m.id}`)}
                  >
                    <td className="px-5 py-4">
                      <p className="font-sans text-sm font-medium text-ink-900">{m.name}</p>
                      <p className="font-mono text-xs text-slate-450">{m.user?.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 font-sans text-sm text-ink-800">
                        <QrCode size={14} className="text-slate-450" />
                        {m._count.cards}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono text-sm text-ink-900">{m._count.scans}</td>
                    <td className="px-5 py-4 font-mono text-sm text-ink-900">{m._count.reviews}</td>
                    <td className="px-5 py-4 font-mono text-sm text-brass-600">
                      {m.averageRating || "—"}
                    </td>
                    <td className="px-5 py-4 font-mono text-sm text-ink-900">{m._count.clicks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
