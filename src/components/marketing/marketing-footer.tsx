import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function MarketingFooter() {
  const t = await getTranslations("marketing.footer");
  const tNav = await getTranslations("marketing.nav");

  return (
    <footer className="border-t border-border">
      <div className="container grid grid-cols-2 gap-8 py-16 md:grid-cols-4">
        <div className="col-span-2">
          <span className="font-display text-lg">BusinessDNA</span>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">{t("tagline")}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("product")}
          </p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/#features" className="hover:text-foreground">{tNav("features")}</Link></li>
            <li><Link href="/#pricing" className="hover:text-foreground">{tNav("pricing")}</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("company")}
          </p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/">{t("legal")}</Link></li>
          </ul>
        </div>
      </div>
      <div className="container border-t border-border py-6 text-xs text-muted-foreground">
        © {new Date().getFullYear()} BusinessDNA. {t("rights")}
      </div>
    </footer>
  );
}
