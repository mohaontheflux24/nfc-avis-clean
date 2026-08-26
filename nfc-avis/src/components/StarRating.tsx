"use client";

export default function StarRating({ value, onChange, accentColor }: { value: number; onChange: (value: number) => void; accentColor: string }) {
  return (
    <div className="flex items-center gap-2" role="radiogroup" aria-label="Note">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="text-4xl leading-none transition-transform hover:scale-110"
          style={{ color: star <= value ? accentColor : "#d6d3d1" }}
          aria-label={`${star} étoile${star > 1 ? "s" : ""}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
