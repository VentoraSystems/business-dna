import { getTranslations, setRequestLocale } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";

// This route resolves a single Business by id. Replace with:
// const business = await db.business.findUnique({ where: { id: params.businessId } });
export default async function BusinessDetailPage({
  params,
}: {
  params: Promise<{ locale: string; businessId: string }>;
}) {
  const { locale, businessId } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("businesses");
  const tButtons = await getTranslations("buttons");

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Badge variant="accent" className="mb-3">
            94% {t("compatibility")}
          </Badge>
          <PageHeader title={`Business ${businessId}`} />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm">{tButtons("generatePlan")}</Button>
          <Button variant="secondary" size="sm">{tButtons("generateBranding")}</Button>
          <Button variant="secondary" size="sm">{tButtons("generateWebsite")}</Button>
          <Button variant="secondary" size="sm">{tButtons("generateFinancialModel")}</Button>
          <Button size="sm">{tButtons("generateLaunchPlan")}</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[
          t("difficulty"),
          t("investment"),
          t("timeToFirstCustomer"),
          t("scalability"),
          t("automation"),
        ].map((label) => (
          <Card key={label}>
            <CardContent className="py-5">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="mt-1 text-sm font-semibold">—</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
