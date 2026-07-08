import { getTranslations } from "next-intl/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Placeholder — replace with a query across Assessment/Business/Blueprint
// updatedAt timestamps for the signed-in user.
const activity: { id: string; label: string; timeAgo: string }[] = [];

export async function RecentActivityCard() {
  const t = await getTranslations("dashboard.recentActivity");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activity.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("empty")}</p>
        ) : (
          activity.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-sm">
              <span>{item.label}</span>
              <span className="text-xs text-muted-foreground">{item.timeAgo}</span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
