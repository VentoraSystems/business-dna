import { getTranslations } from "next-intl/server";
import { CheckCircle2, Circle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Placeholder data — replace with a query against RoadmapTask once a
// business + roadmap exist for the signed-in user.
const tasks = [
  { id: "1", title: "Confirm equipment delivery date", done: false },
  { id: "2", title: "Post the first coach job listing", done: false },
  { id: "3", title: "Draft founding-member pricing page", done: false },
];

export async function TodaysMissionCard() {
  const t = await getTranslations("dashboard.todaysMission");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("empty")}</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-3 text-sm">
              {task.done ? (
                <CheckCircle2 className="h-4 w-4 text-success" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground" />
              )}
              <span className={task.done ? "text-muted-foreground line-through" : ""}>
                {task.title}
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
