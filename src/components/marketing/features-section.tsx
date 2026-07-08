import { getTranslations } from "next-intl/server";
import { Sparkles, FileText, Bot, Map } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const icons = [FileText, Sparkles, Bot, Map];

export async function FeaturesSection() {
  const t = await getTranslations("marketing.features");
  const items = [1, 2, 3, 4] as const;

  return (
    <section id="features" className="container py-20">
      <h2 className="max-w-xl text-3xl">{t("title")}</h2>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {items.map((item, i) => {
          const Icon = icons[i]!;
          return (
            <Card key={item}>
              <CardContent className="flex gap-4 pt-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent/15 text-accent-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold">{t(`item${item}Title` as "item1Title")}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t(`item${item}Desc` as "item1Desc")}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
