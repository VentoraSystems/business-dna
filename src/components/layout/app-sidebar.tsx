"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { navItems } from "./nav-items";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";

export function AppSidebar() {
  const t = useTranslations("nav");
  const tSidebar = useTranslations("sidebar");
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-surface px-4 py-6 lg:flex">
      <Link href="/dashboard" className="mb-8 flex items-center gap-2 px-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary font-display text-sm text-primary-foreground">
          B
        </span>
        <span className="font-display text-lg">BusinessDNA</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                isActive && "bg-accent/15 font-semibold text-foreground"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive && "text-accent-foreground")} />
              {t(item.key)}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-3 border-t border-border pt-4">
        <LanguageSwitcher compact />
        <ThemeToggle />
        <div className="rounded-md bg-primary p-4 text-primary-foreground">
          <p className="text-sm font-semibold">{t("upgrade")}</p>
          <p className="mt-1 text-xs text-primary-foreground/70">
            {tSidebar("upgradeDescription")}
          </p>
        </div>
      </div>
    </aside>
  );
}
