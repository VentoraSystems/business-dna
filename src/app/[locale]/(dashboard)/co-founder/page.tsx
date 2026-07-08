import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Sparkles } from "lucide-react";
import { QuickChat } from "@/features/co-founder/components/quick-chat";

export default async function CoFounderPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("coFounder");

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <PageHeader title={t("title")} subtitle={t("subtitle")} />
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("todaysFocus")}</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState icon={Sparkles} title={t("title")} description={t("emptyDescription")} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("quickChat")}</CardTitle>
          </CardHeader>
          <CardContent>
            <QuickChat />
          </CardContent>
        </Card>
      </div>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("weeklyGoals")}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">—</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("monthlyGoals")}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">—</CardContent>
        </Card>
      </div>
    </div>
  );
}
