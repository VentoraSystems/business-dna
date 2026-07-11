import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { Link } from "@/i18n/navigation";
import { db } from "@/lib/db";
import { requireCurrentUser } from "@/lib/auth";

function formatEuros(value: number | null) {
  return value === null ? "—" : `€${value.toLocaleString("en-US")}`;
}

export default async function BusinessDetailPage({
  params,
}: {
  params: Promise<{ locale: string; businessId: string }>;
}) {
  const { locale, businessId } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("businesses");
  const tButtons = await getTranslations("buttons");

  const user = await requireCurrentUser();
  const business = await db.business.findUnique({
    where: { id: businessId },
    include: { businessType: { include: { timeline: true } } },
  });
  if (!business || business.userId !== user.id) notFound();

  const timeToFirstCustomerWeeks = business.businessType?.timeline?.timeToFirstCustomerWeeks;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          {business.compatibility !== null && (
            <Badge variant="accent" className="mb-3">
              {business.compatibility}% {t("compatibility")}
            </Badge>
          )}
          <PageHeader title={business.name} subtitle={business.summary ?? undefined} />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" asChild>
            <Link href={`/businesses/${businessId}/blueprint`}>{tButtons("generatePlan")}</Link>
          </Button>
          <Button variant="secondary" size="sm">{tButtons("generateBranding")}</Button>
          <Button variant="secondary" size="sm">{tButtons("generateWebsite")}</Button>
          <Button variant="secondary" size="sm">{tButtons("generateFinancialModel")}</Button>
          <Button size="sm">{tButtons("generateLaunchPlan")}</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[
          { label: t("difficulty"), value: business.difficulty },
          {
            label: t("investment"),
            value: `${formatEuros(business.investmentMin)} – ${formatEuros(business.investmentMax)}`,
          },
          {
            label: t("timeToFirstCustomer"),
            value: timeToFirstCustomerWeeks ? `${timeToFirstCustomerWeeks}w` : "—",
          },
          { label: t("scalability"), value: business.businessType?.scalabilityLevel ?? "—" },
          { label: t("automation"), value: business.businessType?.automationLevel ?? "—" },
        ].map(({ label, value }) => (
          <Card key={label}>
            <CardContent className="py-5">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="mt-1 text-sm font-semibold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
