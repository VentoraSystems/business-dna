import { LayoutTemplate, Search } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";

const categoryKeys = [
  "all",
  "businessPlans",
  "pitchDecks",
  "financialModels",
  "marketingPlans",
  "contracts",
  "invoices",
] as const;

export default async function TemplatesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("templates");

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex w-full max-w-xs items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm text-muted-foreground">
          <Search className="h-4 w-4" />
          {t("searchPlaceholder")}
        </div>
        <div className="flex flex-wrap gap-2">
          {categoryKeys.map((key) => (
            <span
              key={key}
              className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground"
            >
              {t(`categories.${key}` as "categories.all")}
            </span>
          ))}
        </div>
      </div>
      <EmptyState icon={LayoutTemplate} title={t("title")} description={t("emptyDescription")} />
    </div>
  );
}
