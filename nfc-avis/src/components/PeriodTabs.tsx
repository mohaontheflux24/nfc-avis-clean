"use client";

import { cn } from "@/lib/utils";

type Period = "7d" | "30d" | "all";

export default function PeriodTabs({ value, onChange }: { value: Period; onChange: (value: Period) => void }) {
  const options: Array<{ value: Period; label: string }> = [
    { value: "7d", label: "7 jours" },
    { value: "30d", label: "30 jours" },
    { value: "all", label: "Tout" },
  ];
  return (
    <div className="inline-flex rounded-full border border-black/10 bg-white p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-full px-3 py-1.5 text-sm transition",
            value === option.value ? "bg-ink-900 text-white" : "text-slate-450 hover:text-ink-900"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
