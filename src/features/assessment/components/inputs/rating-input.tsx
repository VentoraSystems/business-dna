"use client";

import { cn } from "@/lib/utils";

interface RatingInputProps {
  value: number | undefined;
  onChange: (value: number) => void;
  min: number;
  max: number;
  lowLabel: string;
  highLabel: string;
  name: string;
}

export function RatingInput({ value, onChange, min, max, lowLabel, highLabel, name }: RatingInputProps) {
  const scale = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div>
      <div role="radiogroup" aria-label={name} className="flex items-center justify-center gap-3">
        {scale.map((n) => {
          const selected = value === n;
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(n)}
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-full border-[1.5px] border-border bg-surface text-lg font-semibold transition-colors hover:border-accent",
                selected && "border-accent bg-accent text-accent-foreground"
              )}
            >
              {n}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex justify-between text-xs text-muted-foreground">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}
