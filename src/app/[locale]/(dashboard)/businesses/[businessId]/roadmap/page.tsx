import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ChevronLeft, Map } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { db } from "@/lib/db";
import { requireCurrentUser } from "@/lib/auth";
import { getRoadmapView } from "@/features/business-engine/actions/roadmap-view";
import { getTodaysDailyActions } from "@/features/business-engine/actions/daily-actions";
import { RoadmapPageView } from "@/features/business-engine/components/roadmap-page-view";

export default async function BusinessRoadmapPage({
  params,
}: {
  params: Promise<{ locale: string; businessId: string }>;
}) {
  const { locale, businessId } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("roadmap");

  const user = await requireCurrentUser();
  const business = await db.business.findUnique({ where: { id: businessId } });
  if (!business || business.userId !== user.id) notFound();

  const view = await getRoadmapView(businessId);
  const dailyActions = view ? await getTodaysDailyActions(view.roadmapId) : [];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href={`/businesses/${businessId}/blueprint`}
          className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("backToBlueprint")}
        </Link>
        <PageHeader title={t("title")} subtitle={business.name} />
      </div>
      {view ? (
        <RoadmapPageView initialView={view} initialDailyActions={dailyActions} />
      ) : (
        <EmptyState icon={Map} title={t("title")} description={t("emptyDescription")} />
      )}
    </div>
  );
}
