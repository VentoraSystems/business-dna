import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { businessRepository } from "@/features/business-engine/repositories";
import { readBusinessDisplayContent } from "@/features/business-engine/utils/business-display-content";
import type { Locale } from "@/i18n/config";

/**
 * A single BusinessType's detail view — the real destination for the
 * Assessment results page's "Explore Business" button (Phase 3;
 * previously `disabled`, since nothing behind it existed). Distinct from
 * `/businesses/[businessId]`, which resolves a user's *saved* `Business`
 * instance (a different model) — this route resolves a catalog
 * `BusinessType` by slug, which is what a match result actually points at
 * before a user has "adopted" it into a saved Business.
 */
export default async function BusinessTypeDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("businesses");
  const tButtons = await getTranslations("buttons");
  const tOpportunities = await getTranslations("assessment.results.opportunities");

  const businessType = await businessRepository.findFullBySlug(slug);
  if (!businessType) notFound();

  const content = readBusinessDisplayContent(slug, locale as Locale);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Badge variant="accent" className="mb-3">
            {businessType.category.slug}
          </Badge>
          <PageHeader title={content.name} subtitle={content.tagline || content.longDescription || undefined} />
          {content.longDescription && content.tagline && (
            <p className="max-w-2xl text-sm text-muted-foreground">{content.longDescription}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm">{tButtons("generatePlan")}</Button>
          <Button variant="secondary" size="sm">{tButtons("generateBranding")}</Button>
          <Button variant="secondary" size="sm">{tButtons("generateWebsite")}</Button>
          <Button variant="secondary" size="sm">{tButtons("generateFinancialModel")}</Button>
          <Button size="sm">{tButtons("generateLaunchPlan")}</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="py-5">
            <p className="text-xs text-muted-foreground">{t("difficulty")}</p>
            <p className="mt-1 text-sm font-semibold">
              {tOpportunities(`difficulty.${businessType.difficulty === "moderate" ? "medium" : businessType.difficulty}`)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-5">
            <p className="text-xs text-muted-foreground">{t("investment")}</p>
            <p className="mt-1 text-sm font-semibold">
              {businessType.budget
                ? `€${businessType.budget.minInvestment.toLocaleString("en-US")} – €${businessType.budget.maxInvestment.toLocaleString("en-US")}`
                : "—"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-5">
            <p className="text-xs text-muted-foreground">{t("timeToFirstCustomer")}</p>
            <p className="mt-1 text-sm font-semibold">
              {businessType.timeline?.timeToFirstCustomerWeeks
                ? `${businessType.timeline.timeToFirstCustomerWeeks} wk`
                : "—"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-5">
            <p className="text-xs text-muted-foreground">{t("scalability")}</p>
            <p className="mt-1 text-sm font-semibold">
              {tOpportunities(`scalability.${businessType.scalabilityLevel === "moderate" ? "medium" : businessType.scalabilityLevel}`)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-5">
            <p className="text-xs text-muted-foreground">{t("automation")}</p>
            <p className="mt-1 text-sm font-semibold capitalize">{businessType.automationLevel}</p>
          </CardContent>
        </Card>
        {businessType.revenue && (
          <Card>
            <CardContent className="py-5">
              <p className="text-xs text-muted-foreground">{tOpportunities("monthlyRevenueLabel")}</p>
              <p className="mt-1 text-sm font-semibold">
                {businessType.revenue.targetMonthlyIncomeMin != null && businessType.revenue.targetMonthlyIncomeMax != null
                  ? `€${businessType.revenue.targetMonthlyIncomeMin.toLocaleString("en-US")} – €${businessType.revenue.targetMonthlyIncomeMax.toLocaleString("en-US")}`
                  : "—"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {businessType.skills.length > 0 && (
        <Card>
          <CardContent className="py-5">
            <p className="mb-3 text-xs text-muted-foreground">{t("requiredSkills")}</p>
            <div className="flex flex-wrap gap-2">
              {businessType.skills.map((businessSkill) => (
                <Badge key={businessSkill.id} variant="neutral">
                  {businessSkill.skill.key}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
