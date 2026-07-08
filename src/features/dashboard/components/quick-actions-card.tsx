import { getTranslations } from "next-intl/server";
import { PlusCircle, FileText, Map } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export async function QuickActionsCard() {
  const t = await getTranslations("dashboard.quickActions");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Button variant="secondary" className="justify-start" asChild>
          <Link href="/assessment">
            <PlusCircle className="h-4 w-4" />
            {t("newAssessment")}
          </Link>
        </Button>
        <Button variant="secondary" className="justify-start" asChild>
          <Link href="/blueprint">
            <FileText className="h-4 w-4" />
            {t("generatePlan")}
          </Link>
        </Button>
        <Button variant="secondary" className="justify-start" asChild>
          <Link href="/roadmap">
            <Map className="h-4 w-4" />
            {t("viewRoadmap")}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
