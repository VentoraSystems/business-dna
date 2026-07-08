import { FileText } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";

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

export default async function BlueprintPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blueprint");
  const tButtons = await getTranslations("buttons");

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[220px_1fr]">
      <nav className="hidden lg:block">
        <ul className="space-y-1 text-sm text-muted-foreground">
          {sectionKeys.map((key) => (
            <li key={key} className="rounded-md px-3 py-1.5 hover:bg-muted hover:text-foreground">
              {t(`sections.${key}` as "sections.executiveSummary")}
            </li>
          ))}
        </ul>
      </nav>
      <div>
        <div className="mb-4 flex items-center justify-between">
          <PageHeader title={t("title")} />
          <Button variant="secondary" size="sm">{tButtons("exportPdf")}</Button>
        </div>
        <EmptyState
          icon={FileText}
          title={t("title")}
          description={t("emptyDescription")}
        />
      </div>
    </div>
  );
}
