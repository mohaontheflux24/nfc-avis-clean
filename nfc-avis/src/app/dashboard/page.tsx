"use client";

import { useEffect, useState } from "react";
import PeriodTabs from "@/components/PeriodTabs";
import StatCard from "@/components/StatCard";
import TrendChart from "@/components/TrendChart";
import RatingDistribution from "@/components/RatingDistribution";

type Period = "7d" | "30d" | "all";

export default function DashboardOverview() {
  const [period, setPeriod] = useState<Period>("30d");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/dashboard/stats?period=${period}`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  }, [period]);

  return (
    <div>
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[26px] font-medium text-ink-900">Aperçu</h1>
          <p className="font-sans text-sm text-slate-450">
            Suivez vos scans, vos avis et vos conversions Google.
          </p>
        </div>
        <PeriodTabs value={period} onChange={setPeriod} />
      </div>

      {loading || !data ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card-surface h-28 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <StatCard label="Scans NFC" value={data.stats.scans} />
            <StatCard label="Notes reçues" value={data.stats.reviewsCount} />
            <StatCard label="Clics vers Google" value={data.stats.clicks} />
            <StatCard label="Taux de conversion" value={data.stats.conversionRate} suffix="%" />
            <StatCard label="Note moyenne" value={data.stats.averageRating || "—"} suffix="/5" />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <TrendChart data={data.series} />
            <RatingDistribution distribution={data.stats.distribution} />
          </div>
        </>
      )}
    </div>
  );
}
