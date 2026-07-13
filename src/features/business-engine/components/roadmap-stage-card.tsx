"use client";

import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { RoadmapStageView, RoadmapTaskView } from "@/features/business-engine/actions/roadmap-view";

const STAGE_STATUS_BADGE_VARIANT = {
  completed: "success",
  inProgress: "accent",
  upcoming: "neutral",
} as const;

interface RoadmapStageCardProps {
  stageView: RoadmapStageView;
  onToggleTask: (taskId: string) => void;
  pendingTaskIds: Set<string>;
}

export function RoadmapStageCard({ stageView, onToggleTask, pendingTaskIds }: RoadmapStageCardProps) {
  const t = useTranslations("roadmap");
  const tStages = useTranslations("roadmap.stages");

  return (
    <Card id={`stage-${stageView.stage}`} className="scroll-mt-4">
      <CardHeader className="flex-row items-center justify-between gap-3">
        <CardTitle>{tStages(stageView.stage)}</CardTitle>
        <Badge variant={STAGE_STATUS_BADGE_VARIANT[stageView.status]}>{t(`stageStatus.${stageView.status}`)}</Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {stageView.tasks.length === 0 && <p className="text-sm text-muted-foreground">{t("emptyTasksInStage")}</p>}
        {stageView.tasks.map((task) => (
          <RoadmapTaskRow key={task.id} task={task} pending={pendingTaskIds.has(task.id)} onToggle={() => onToggleTask(task.id)} />
        ))}
      </CardContent>
    </Card>
  );
}

function RoadmapTaskRow({ task, pending, onToggle }: { task: RoadmapTaskView; pending: boolean; onToggle: () => void }) {
  const t = useTranslations("roadmap");

  return (
    <div className="flex items-start gap-3 border-b border-border py-3 last:border-b-0">
      <Checkbox checked={task.completed} onCheckedChange={onToggle} disabled={pending} className="mt-0.5" aria-label={task.title} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className={cn("text-sm font-medium", task.completed ? "text-muted-foreground line-through" : "text-foreground")}>
            {task.title}
          </p>
          {task.sourceSectionKey && (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-accent-foreground/80">
              <Sparkles className="h-2.5 w-2.5" />
              {t("personalized")}
            </span>
          )}
        </div>
        {task.description && <p className="mt-0.5 text-xs text-muted-foreground">{task.description}</p>}
      </div>
      <span className="shrink-0 text-xs font-semibold text-muted-foreground">{t("xpValue", { value: task.xpValue })}</span>
    </div>
  );
}
