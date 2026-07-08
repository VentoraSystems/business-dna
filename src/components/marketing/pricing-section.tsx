import { getTranslations } from "next-intl/server";
import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export async function PricingSection() {
  const t = await getTranslations("marketing.pricing");

  return (
    <section id="pricing" className="container py-20">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="text-3xl">{t("title")}</h2>
        <p className="mt-3 text-muted-foreground">{t("subtitle")}</p>
      </div>
      <div className="mx-auto mt-12 grid max-w-3xl gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("freeTitle")}</CardTitle>
            <p className="text-sm text-muted-foreground">{t("freeDesc")}</p>
          </CardHeader>
          <CardContent>
            <p className="font-display text-4xl">€0</p>
            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-success" />{t("freeFeature1")}</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-success" />{t("freeFeature2")}</li>
            </ul>
            <Button variant="secondary" className="mt-6 w-full">{t("choosePlan")}</Button>
          </CardContent>
        </Card>
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>{t("proTitle")}</CardTitle>
            <p className="text-sm text-muted-foreground">{t("proDesc")}</p>
          </CardHeader>
          <CardContent>
            <p className="font-display text-4xl">
              €29<span className="text-base text-muted-foreground">{t("perMonth")}</span>
            </p>
            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-success" />{t("proFeature1")}</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-success" />{t("proFeature2")}</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-success" />{t("proFeature3")}</li>
            </ul>
            <Button className="mt-6 w-full">{t("choosePlan")}</Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
