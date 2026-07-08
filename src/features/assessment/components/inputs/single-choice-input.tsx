"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SingleChoiceInputProps {
  value: string | undefined;
  onChange: (value: string) => void;
  options: readonly string[];
  getOptionLabel: (option: string) => string;
  name: string;
}

export function SingleChoiceInput({
  value,
  onChange,
  options,
  getOptionLabel,
  name,
}: SingleChoiceInputProps) {
  return (
    <div role="radiogroup" aria-label={name} className="flex flex-col gap-3">
      {options.map((option) => {
        const selected = value === option;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option)}
            className={cn(
              "flex items-center justify-between rounded-lg border-[1.5px] border-border bg-surface px-5 py-4 text-left text-[15px] font-medium transition-colors hover:border-accent",
              selected && "border-accent bg-accent/10"
            )}
          >
            {getOptionLabel(option)}
            <span
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[1.5px] border-border",
                selected && "border-accent bg-accent text-accent-foreground"
              )}
            >
              {selected && <Check className="h-3 w-3" />}
            </span>
          </button>
        );
      })}
    </div>
  );
}
