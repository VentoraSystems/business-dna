import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ChevronLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { db } from "@/lib/db";
import { requireCurrentUser } from "@/lib/auth";
import { getSectionStatus } from "@/features/business-engine/actions/section-status";
import { SectionView } from "@/features/business-engine/components/section-view";
import { BLUEPRINT_SECTION_KEYS } from "@/ai/prompts/blueprint";
import type { BlueprintSectionKey } from "@/features/business-engine/actions/request-section-generation";

function isValidSectionKey(value: string): value is BlueprintSectionKey {
  return (BLUEPRINT_SECTION_KEYS as readonly string[]).includes(value);
}

export default async function BusinessBlueprintSectionPage({
  params,
}: {
  params: Promise<{ locale: string; businessId: string; section: string }>;
}) {
  const { locale, businessId, section } = await params;
  setRequestLocale(locale);
  if (!isValidSectionKey(section)) notFound();

  const t = await getTranslations("blueprint");

  const user = await requireCurrentUser();
  const business = await db.business.findUnique({ where: { id: businessId } });
  if (!business || business.userId !== user.id) notFound();

  const statusResult = await getSectionStatus(businessId, section);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href={`/businesses/${businessId}/blueprint`}
          className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("title")}
        </Link>
        <PageHeader title={t(`sections.${section}`)} subtitle={business.name} />
      </div>
      <SectionView
        businessId={businessId}
        sectionKey={section}
        initialStatus={statusResult?.status ?? "none"}
        initialContent={statusResult?.content ?? null}
        initialError={statusResult?.error ?? null}
      />
    </div>
  );
}
