import { Building2 } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export default async function BusinessesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("businesses");
  const tButtons = await getTranslations("buttons");

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <EmptyState
        icon={Building2}
        title={t("title")}
        description={t("empty")}
        action={
          <Button asChild>
            <Link href="/assessment">{tButtons("startAssessment")}</Link>
          </Button>
        }
      />
    </div>
  );
}

