import { getTranslations } from "next-intl/server";
import { Card, CardContent } from "@/components/ui/card";

export async function HowItWorksSection() {
  const t = await getTranslations("marketing.howItWorks");
  const steps = [1, 2, 3, 4] as const;

  return (
    <section id="how-it-works" className="container py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl">{t("title")}</h2>
        <p className="mt-3 text-muted-foreground">{t("subtitle")}</p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-4">
        {steps.map((step) => (
          <Card key={step}>
            <CardContent className="pt-6">
              <span className="font-display text-2xl text-accent">0{step}</span>
              <h3 className="mt-3 text-base font-semibold">{t(`step${step}Title` as "step1Title")}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {t(`step${step}Desc` as "step1Desc")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
