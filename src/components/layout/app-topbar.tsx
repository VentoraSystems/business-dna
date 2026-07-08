import { Search, Bell, Sparkles } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./mobile-nav";

interface AppTopbarProps {
  greetingName?: string;
}

export async function AppTopbar({ greetingName }: AppTopbarProps) {
  const t = await getTranslations("topbar");
  const tDashboard = await getTranslations("dashboard");

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur lg:px-8">
      <div className="flex items-center gap-3">
        <MobileNav />
        {greetingName ? (
          <div>
            <p className="text-sm font-semibold leading-tight">
              {tDashboard("greeting", { name: greetingName })}
            </p>
            <p className="hidden text-xs text-muted-foreground sm:block">
              {tDashboard("greetingSub")}
            </p>
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm text-muted-foreground md:flex md:w-64">
          <Search className="h-4 w-4" />
          {t("searchPlaceholder")}
        </div>
        <Button variant="secondary" size="icon" aria-label={t("notifications")}>
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="accent" size="sm" className="hidden sm:inline-flex">
          <Sparkles className="h-4 w-4" />
          {t("askAi")}
        </Button>
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
}
