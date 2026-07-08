"use client";

interface LongTextInputProps {
  value: string | undefined;
  onChange: (value: string) => void;
  maxLength: number;
  name: string;
}

export function LongTextInput({ value, onChange, maxLength, name }: LongTextInputProps) {
  const current = value ?? "";
  return (
    <div>
      <textarea
        name={name}
        value={current}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        rows={5}
        autoFocus
        className="w-full resize-none rounded-lg border-[1.5px] border-border bg-surface px-4 py-3.5 text-[15px] leading-relaxed placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      />
      <p className="mt-1.5 text-right text-xs text-muted-foreground">
        {current.length} / {maxLength}
      </p>
    </div>
  );
}
