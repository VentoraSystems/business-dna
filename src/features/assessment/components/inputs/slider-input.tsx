"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SliderInputProps {
  value: number | undefined;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  formatValue: (value: number) => string;
}

export function SliderInput({ value, onChange, min, max, step, formatValue }: SliderInputProps) {
  const current = value ?? min;
  const percent = ((current - min) / (max - min)) * 100;

  return (
    <div className="w-full">
      <motion.div
        key={current}
        initial={{ opacity: 0.5, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className="mb-6 text-center font-display text-4xl"
      >
        {formatValue(current)}
      </motion.div>

      <div className="relative flex h-2 items-center rounded-full bg-muted">
        <div
          className="absolute h-2 rounded-full bg-accent"
          style={{ width: `${percent}%` }}
          aria-hidden
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={current}
          onChange={(e) => onChange(Number(e.target.value))}
          className={cn(
            "relative h-2 w-full cursor-pointer appearance-none bg-transparent",
            "[&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none",
            "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-surface",
            "[&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:shadow-soft",
            "[&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full",
            "[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-surface [&::-moz-range-thumb]:bg-accent"
          )}
        />
      </div>
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
    </div>
  );
}
