"use client";

import { Input } from "@/components/ui/input";

interface ShortTextInputProps {
  value: string | undefined;
  onChange: (value: string) => void;
  maxLength: number;
  name: string;
}

export function ShortTextInput({ value, onChange, maxLength, name }: ShortTextInputProps) {
  return (
    <Input
      name={name}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      maxLength={maxLength}
      autoFocus
      className="h-14 text-lg"
    />
  );
}
