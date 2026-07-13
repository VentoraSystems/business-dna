"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

/**
 * No Radix checkbox primitive is installed in this project (only
 * dialog/dropdown/avatar/progress/separator/switch/tooltip are) — a plain
 * button with role="checkbox" is enough for a single-purpose task toggle
 * and avoids adding a new dependency for one component.
 */
export function Checkbox({ checked, onCheckedChange, disabled, className, ...props }: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
        checked ? "border-accent bg-accent text-accent-foreground" : "border-border bg-surface text-transparent",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        className
      )}
      {...props}
    >
      <Check className="h-3.5 w-3.5" strokeWidth={3} />
    </button>
  );
}
