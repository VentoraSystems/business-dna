import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";

// Entry point for "I already have a business idea" — captures the raw idea
// so it can be run through the same validation pipeline as a matched business.
export default async function NewBusinessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("onboarding.haveIdea");
  const tCommon = await getTranslations("common");

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-1.5">
            <Label htmlFor="ideaName">{t("businessNameLabel")}</Label>
            <Input id="ideaName" name="ideaName" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ideaDescription">{t("ideaDescriptionLabel")}</Label>
            <textarea
              id="ideaDescription"
              name="ideaDescription"
              rows={5}
              className="w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            />
          </div>
          <Button>{tCommon("continue")}</Button>
        </CardContent>
      </Card>
    </div>
  );
}
