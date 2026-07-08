"use client";

import * as React from "react";
import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, localeNames, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  compact?: boolean;
}

export function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const t = useTranslations("settings.language");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  function selectLocale(next: Locale) {
    setOpen(false);
    router.replace(pathname, { locale: next });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground hover:bg-muted",
          compact && "px-2 py-1.5 text-xs"
        )}
      >
        <Globe className="h-4 w-4 text-muted-foreground" />
        {localeNames[locale]}
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute bottom-full left-0 z-20 mb-2 w-40 rounded-md border border-border bg-surface p-1 shadow-soft"
        >
          {locales.map((loc) => (
            <li key={loc}>
              <button
                type="button"
                role="option"
                aria-selected={loc === locale}
                onClick={() => selectLocale(loc)}
                className={cn(
                  "flex w-full items-center rounded-sm px-2 py-1.5 text-left text-sm hover:bg-muted",
                  loc === locale && "font-semibold text-accent-foreground"
                )}
              >
                {localeNames[loc]}
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="sr-only">{t("description")}</p>
    </div>
  );
}
