"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultipleChoiceInputProps {
  value: string[] | undefined;
  onChange: (value: string[]) => void;
  options: readonly string[];
  getOptionLabel: (option: string) => string;
  name: string;
}

export function MultipleChoiceInput({
  value = [],
  onChange,
  options,
  getOptionLabel,
  name,
}: MultipleChoiceInputProps) {
  function toggle(option: string) {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option));
    } else {
      onChange([...value, option]);
    }
  }

  return (
    <div aria-label={name} className="flex flex-wrap gap-2.5">
      {options.map((option) => {
        const selected = value.includes(option);
        return (
          <button
            key={option}
            type="button"
            aria-pressed={selected}
            onClick={() => toggle(option)}
            className={cn(
              "flex items-center gap-2 rounded-full border-[1.5px] border-border bg-surface px-4 py-2.5 text-sm font-medium transition-colors hover:border-accent",
              selected && "border-accent bg-accent/10"
            )}
          >
            {selected && <Check className="h-3.5 w-3.5 text-accent-foreground" />}
            {getOptionLabel(option)}
          </button>
        );
      })}
    </div>
  );
}
