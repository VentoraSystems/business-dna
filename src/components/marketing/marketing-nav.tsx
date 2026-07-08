import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

export async function MarketingNav() {
  const t = await getTranslations("marketing.nav");

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
      <div className="container flex h-18 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary font-display text-sm text-primary-foreground">
            B
          </span>
          <span className="font-display text-lg">BusinessDNA</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <Link href="/#how-it-works" className="hover:text-foreground">
            {t("howItWorks")}
          </Link>
          <Link href="/#features" className="hover:text-foreground">
            {t("features")}
          </Link>
          <Link href="/#pricing" className="hover:text-foreground">
            {t("pricing")}
          </Link>
          <Link href="/#faq" className="hover:text-foreground">
            {t("faq")}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher compact />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/sign-in">{t("signIn")}</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/sign-up">{t("getStarted")}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
