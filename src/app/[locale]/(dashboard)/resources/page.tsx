import { BookOpen } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";

const tabKeys = ["articles", "guides", "videos", "playbooks", "checklists"] as const;

export default async function ResourcesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("resources");

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <div className="mb-6 flex gap-6 border-b border-border text-sm text-muted-foreground">
        {tabKeys.map((key, i) => (
          <span
            key={key}
            className={`pb-3 ${i === 0 ? "border-b-2 border-accent font-semibold text-foreground" : ""}`}
          >
            {t(`tabs.${key}` as "tabs.articles")}
          </span>
        ))}
      </div>
      <EmptyState icon={BookOpen} title={t("title")} description={t("emptyDescription")} />
    </div>
  );
}
