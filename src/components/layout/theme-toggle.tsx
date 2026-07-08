"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const options = [
  { value: "light", icon: Sun, key: "light" },
  { value: "dark", icon: Moon, key: "dark" },
  { value: "system", icon: Monitor, key: "system" },
] as const;

export function ThemeToggle() {
  const t = useTranslations("settings.appearance");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-9 w-full" />;

  return (
    <div className="flex items-center gap-1 rounded-md border border-border bg-surface p-1">
      {options.map(({ value, icon: Icon, key }) => (
        <button
          key={value}
          type="button"
          aria-label={t(key)}
          onClick={() => setTheme(value)}
          className={cn(
            "flex flex-1 items-center justify-center rounded-sm py-1.5 text-muted-foreground transition-colors hover:text-foreground",
            theme === value && "bg-muted text-foreground"
          )}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}
