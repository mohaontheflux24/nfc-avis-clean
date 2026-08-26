"use client";

import { useEffect, useState } from "react";
import ReviewsTable from "@/components/ReviewsTable";

export default function DashboardReviews() {
  const [reviews, setReviews] = useState<any[] | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/reviews")
      .then((r) => r.json())
      .then((d) => setReviews(d.reviews));
  }, []);

  return (
    <div>
      <div className="mb-7">
        <h1 className="font-display text-[26px] font-medium text-ink-900">Avis reçus</h1>
        <p className="font-sans text-sm text-slate-450">
          Historique complet, avis publics et retours privés confondus.
        </p>
      </div>

      {reviews === null ? (
        <div className="card-surface h-64 animate-pulse" />
      ) : (
        <ReviewsTable reviews={reviews} />
      )}
    </div>
  );
}
