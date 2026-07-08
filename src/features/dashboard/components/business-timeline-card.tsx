import { getTranslations } from "next-intl/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const milestones = [1, 2, 3, 6, 12] as const;

export async function BusinessTimelineCard() {
  const t = await getTranslations("dashboard.businessTimeline");
  const tRoadmap = await getTranslations("roadmap");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          {milestones.map((month, i) => (
            <div key={month} className="flex flex-1 flex-col items-center">
              <div
                className={
                  i === 0
                    ? "flex h-3 w-3 rounded-full bg-primary"
                    : "flex h-3 w-3 rounded-full border border-border bg-surface"
                }
              />
              <span className="mt-2 text-xs text-muted-foreground">
                {tRoadmap("month", { number: month })}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
