import { getTranslations } from "next-intl/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export async function BusinessHealthCard() {
  const t = await getTranslations("dashboard.businessHealth");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={72} />
        <Badge variant="success" className="mt-3">
          {t("onTrack")}
        </Badge>
      </CardContent>
    </Card>
  );
}
