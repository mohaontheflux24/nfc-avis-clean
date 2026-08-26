import { formatDate } from "@/lib/utils";

export default function ReviewsTable({ reviews }: { reviews: any[] }) {
  if (!reviews?.length) {
    return <div className="card-surface p-6 text-sm text-slate-450">Aucun avis pour le moment.</div>;
  }
  return (
    <div className="card-surface overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-black/5 text-xs uppercase text-slate-450">
          <tr>
            <th className="px-4 py-3">Date</th><th className="px-4 py-3">Note</th><th className="px-4 py-3">Client</th><th className="px-4 py-3">Commentaire</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review.id} className="border-b border-black/5 last:border-0">
              <td className="px-4 py-3 text-slate-450">{formatDate(review.createdAt)}</td>
              <td className="px-4 py-3 font-medium">{review.rating}/5</td>
              <td className="px-4 py-3">{review.firstName || "—"}</td>
              <td className="max-w-md px-4 py-3">{review.comment || (review.isPrivate ? "Retour privé" : "Avis positif")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
