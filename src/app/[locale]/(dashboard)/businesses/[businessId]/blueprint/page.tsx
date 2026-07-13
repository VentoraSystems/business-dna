import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { db } from "@/lib/db";
import { requireCurrentUser } from "@/lib/auth";
import { listSectionStatuses } from "@/features/business-engine/actions/section-status";
import type { BlueprintStatus } from "@prisma/client";

const STATUS_BADGE_VARIANT: Record<BlueprintStatus | "none", BadgeProps["variant"]> = {
  none: "neutral",
  pending: "neutral",
  generating: "accent",
  ready: "success",
  failed: "error",
};

export default async function BusinessBlueprintLandingPage({
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

  const sections = await listSectionStatuses(businessId);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <PageHeader title={t("title")} subtitle={business.name} />
        <Button variant="secondary" size="sm">
          {tButtons("exportPdf")}
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map(({ sectionKey, status }) => (
          <Link key={sectionKey} href={`/businesses/${businessId}/blueprint/${sectionKey}`}>
            <Card className="h-full transition-colors hover:border-accent">
              <CardContent className="flex h-full flex-col gap-3 py-5">
                <p className="font-display text-lg">{t(`sections.${sectionKey}`)}</p>
                <Badge variant={STATUS_BADGE_VARIANT[status]} className="w-fit">
                  {t(`status.${status}`)}
                </Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
