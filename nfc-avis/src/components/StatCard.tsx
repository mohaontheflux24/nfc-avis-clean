export default function StatCard({ label, value, suffix = "" }: { label: string; value: string | number; suffix?: string }) {
  return (
    <div className="card-surface p-5">
      <p className="font-sans text-xs uppercase tracking-wide text-slate-450">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold text-ink-900">{value}{suffix}</p>
    </div>
  );
}
