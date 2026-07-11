import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { db } from "@/lib/db";
import { requireCurrentUser } from "@/lib/auth";
import { getBlueprintStatus } from "@/features/business-engine/actions/blueprint-status";
import { BlueprintView } from "@/features/business-engine/components/blueprint-view";

const sectionKeys = [
  "executiveSummary",
  "businessDescription",
  "targetAudience",
  "marketAnalysis",
  "competitorAnalysis",
  "swot",
  "businessModelCanvas",
  "marketingPlan",
  "salesStrategy",
  "financialForecast",
  "operations",
  "launchPlan",
  "growthPlan",
  "riskAnalysis",
  "exitStrategy",
] as const;

export default async function BusinessBlueprintPage({
  params,
}: {
  params: Promise<{ locale: string; businessId: string }>;
}) {
  const { locale, businessId } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blueprint");
  const tButtons = await getTranslations("buttons");

  const user = await requireCurrentUser();
  const business = await db.business.findUnique({ where: { id: businessId } });
  if (!business || business.userId !== user.id) notFound();

  const statusResult = await getBlueprintStatus(businessId);

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[220px_1fr]">
      <nav className="hidden lg:block">
        <ul className="space-y-1 text-sm text-muted-foreground">
          {sectionKeys.map((key) => (
            <li key={key}>
              <a href={`#${key}`} className="block rounded-md px-3 py-1.5 hover:bg-muted hover:text-foreground">
                {t(`sections.${key}`)}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div>
        <div className="mb-4 flex items-center justify-between">
          <PageHeader title={t("title")} subtitle={business.name} />
          <Button variant="secondary" size="sm">
            {tButtons("exportPdf")}
          </Button>
        </div>
        <BlueprintView
          businessId={businessId}
          initialStatus={statusResult?.status ?? "none"}
          initialContent={statusResult?.content ?? null}
          initialError={statusResult?.error ?? null}
        />
      </div>
    </div>
  );
}
