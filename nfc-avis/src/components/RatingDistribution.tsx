export default function RatingDistribution({ distribution }: { distribution: any }) {
  const rows = [5, 4, 3, 2, 1];
  const total = rows.reduce((sum, rating) => sum + Number(distribution?.[rating] ?? 0), 0) || 1;
  return (
    <div className="card-surface p-5">
      <p className="mb-4 text-sm font-medium text-ink-800">Répartition des notes</p>
      <div className="space-y-3">
        {rows.map((rating) => {
          const count = Number(distribution?.[rating] ?? 0);
          const width = Math.round((count / total) * 100);
          return (
            <div key={rating} className="flex items-center gap-3 text-sm">
              <span className="w-8">{rating}★</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/5">
                <div className="h-full bg-ink-900" style={{ width: `${width}%` }} />
              </div>
              <span className="w-8 text-right text-slate-450">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
