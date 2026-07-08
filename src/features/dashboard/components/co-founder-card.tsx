import { getTranslations } from "next-intl/server";
import { Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export async function CoFounderCard() {
  const t = await getTranslations("dashboard.coFounder");

  return (
    <Card className="bg-primary text-primary-foreground">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base text-primary-foreground">
          <Sparkles className="h-4 w-4" />
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="accent" size="sm" asChild>
          <Link href="/co-founder">{t("cta")}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
