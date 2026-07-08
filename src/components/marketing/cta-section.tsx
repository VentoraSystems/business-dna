import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export async function CtaSection() {
  const t = await getTranslations("marketing.cta");

  return (
    <section className="container py-20">
      <div className="rounded-xl bg-primary px-8 py-16 text-center text-primary-foreground">
        <h2 className="text-3xl">{t("title")}</h2>
        <p className="mt-3 text-primary-foreground/80">{t("subtitle")}</p>
        <Button variant="accent" size="lg" className="mt-8" asChild>
          <Link href="/sign-up">{t("button")}</Link>
        </Button>
      </div>
    </section>
  );
}
