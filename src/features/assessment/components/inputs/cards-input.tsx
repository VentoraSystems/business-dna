"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardsInputProps {
  value: string[] | undefined;
  onChange: (value: string[]) => void;
  options: readonly string[];
  getOptionLabel: (option: string) => string;
  name: string;
}

export function CardsInput({ value = [], onChange, options, getOptionLabel, name }: CardsInputProps) {
  function toggle(option: string) {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option));
    } else {
      onChange([...value, option]);
    }
  }

  return (
    <div aria-label={name} className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {options.map((option) => {
        const selected = value.includes(option);
        return (
          <button
            key={option}
            type="button"
            aria-pressed={selected}
            onClick={() => toggle(option)}
            className={cn(
              "relative flex h-24 flex-col items-center justify-center rounded-lg border-[1.5px] border-border bg-surface px-3 text-center text-sm font-semibold transition-colors hover:border-accent",
              selected && "border-accent bg-accent/10"
            )}
          >
            {selected && (
              <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Check className="h-3 w-3" />
              </span>
            )}
            {getOptionLabel(option)}
          </button>
        );
      })}
    </div>
  );
}
