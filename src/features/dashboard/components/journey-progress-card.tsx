import { getTranslations } from "next-intl/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export async function JourneyProgressCard() {
  const t = await getTranslations("dashboard.journeyProgress");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-display text-3xl">34%</p>
        <Progress value={34} className="mt-3" />
        <p className="mt-2 text-xs text-muted-foreground">Month 2 of 12</p>
      </CardContent>
    </Card>
  );
}
