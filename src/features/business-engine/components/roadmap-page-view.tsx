"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toggleTaskCompletion } from "@/features/business-engine/actions/roadmap-view";
import type { RoadmapView, RoadmapBadgeKey } from "@/features/business-engine/actions/roadmap-view";
import { ROADMAP_BADGE_KEYS, ROADMAP_BADGE_ICONS } from "@/features/business-engine/components/roadmap-badge-config";
import { RoadmapStageTimeline } from "@/features/business-engine/components/roadmap-stage-timeline";
import { RoadmapStageCard } from "@/features/business-engine/components/roadmap-stage-card";

interface RoadmapPageViewProps {
  initialView: RoadmapView;
}

/**
 * Top-level client orchestrator: owns the whole Roadmap page's state so a
 * single task toggle can update the header/badges/timeline/checklist
 * together without a full page reload. Optimistic: the toggled task and
 * derived XP flip immediately; the real toggleTaskCompletion() response
 * reconciles totals/badges, or reverts the optimistic change on error.
 */
export function RoadmapPageView({ initialView }: RoadmapPageViewProps) {
  const [view, setView] = React.useState(initialView);
  const [pendingTaskIds, setPendingTaskIds] = React.useState<Set<string>>(new Set());
  const [newBadge, setNewBadge] = React.useState<RoadmapBadgeKey | null>(null);

  async function handleToggleTask(taskId: string) {
    const previousView = view;
    const task = view.stages.flatMap((s) => s.tasks).find((t) => t.id === taskId);
    if (!task) return;

    const optimisticCompleted = !task.completed;
    const xpDelta = optimisticCompleted ? task.xpValue : -task.xpValue;

    setView((current) => ({
      ...current,
      totalXp: Math.max(0, current.totalXp + xpDelta),
      stages: current.stages.map((stage) => ({
        ...stage,
        tasks: stage.tasks.map((t) => (t.id === taskId ? { ...t, completed: optimisticCompleted } : t)),
      })),
    }));
    setPendingTaskIds((current) => new Set(current).add(taskId));

    try {
      const result = await toggleTaskCompletion(taskId);
      setView((current) => ({
        ...current,
        totalXp: result.totalXp,
        level: result.level,
        xpIntoLevel: result.xpIntoLevel,
        xpForNextLevel: result.xpForNextLevel,
        unlockedBadgeKeys: result.unlockedBadgeKeys,
        stages: current.stages.map((stage) => ({
          ...stage,
          status: stageStatusFromTasks(stage.tasks),
        })),
      }));
      const [firstNewBadge] = result.newlyUnlocked;
      if (firstNewBadge) {
        setNewBadge(firstNewBadge);
      }
    } catch {
      setView(previousView);
    } finally {
      setPendingTaskIds((current) => {
        const next = new Set(current);
        next.delete(taskId);
        return next;
      });
    }
  }

  React.useEffect(() => {
    if (!newBadge) return;
    const timeout = setTimeout(() => setNewBadge(null), 4000);
    return () => clearTimeout(timeout);
  }, [newBadge]);

  return (
    <div className="flex flex-col gap-6">
      <RoadmapHero level={view.level} xpIntoLevel={view.xpIntoLevel} xpForNextLevel={view.xpForNextLevel} />
      <RoadmapBadgeRow unlockedBadgeKeys={view.unlockedBadgeKeys} />
      <RoadmapStageTimeline stages={view.stages} />
      <div className="flex flex-col gap-4">
        {view.stages.map((stageView) => (
          <RoadmapStageCard
            key={stageView.stage}
            stageView={stageView}
            onToggleTask={handleToggleTask}
            pendingTaskIds={pendingTaskIds}
          />
        ))}
      </div>
      <NewBadgeToast badgeKey={newBadge} />
    </div>
  );
}

/** Recomputed client-side from the tasks the optimistic update already flipped — same 3-state logic as getRoadmapView's stageStatus(), kept in sync deliberately (not imported, since that helper lives in a "use server" file and isn't exported). */
function stageStatusFromTasks(tasks: { completed: boolean }[]): "completed" | "inProgress" | "upcoming" {
  if (tasks.length === 0) return "upcoming";
  if (tasks.every((t) => t.completed)) return "completed";
  if (tasks.some((t) => t.completed)) return "inProgress";
  return "upcoming";
}

function RoadmapHero({ level, xpIntoLevel, xpForNextLevel }: { level: number; xpIntoLevel: number; xpForNextLevel: number }) {
  const t = useTranslations("roadmap.hero");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center py-2 text-center"
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-accent-foreground">{t("eyebrow")}</p>
      <p className="font-display text-5xl">{t("level", { level })}</p>
      <p className="mt-2 text-sm text-muted-foreground">{t("xpToNext", { xpIntoLevel, xpForNextLevel })}</p>
      <Progress value={(xpIntoLevel / xpForNextLevel) * 100} className="mt-4 w-full max-w-xs" />
    </motion.div>
  );
}

function RoadmapBadgeRow({ unlockedBadgeKeys }: { unlockedBadgeKeys: RoadmapBadgeKey[] }) {
  const t = useTranslations("roadmap.badges");
  const unlockedSet = new Set(unlockedBadgeKeys);

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {ROADMAP_BADGE_KEYS.map((badgeKey) => {
        const Icon = ROADMAP_BADGE_ICONS[badgeKey];
        const unlocked = unlockedSet.has(badgeKey);
        return (
          <div
            key={badgeKey}
            className="flex w-20 flex-col items-center gap-1.5 text-center"
            title={unlocked ? t(`${badgeKey}.unlockedDescription`) : t(`${badgeKey}.lockedDescription`)}
          >
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full",
                unlocked ? "bg-accent/15 text-accent-foreground" : "bg-muted text-muted-foreground grayscale opacity-50"
              )}
            >
              <Icon className="h-6 w-6" />
            </div>
            <p className={cn("text-[11px] leading-tight", unlocked ? "text-foreground" : "text-muted-foreground")}>
              {t(`${badgeKey}.name`)}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function NewBadgeToast({ badgeKey }: { badgeKey: RoadmapBadgeKey | null }) {
  const t = useTranslations("roadmap");
  const tBadges = useTranslations("roadmap.badges");

  return (
    <AnimatePresence>
      {badgeKey && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 shadow-soft"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15 text-accent-foreground">
            {React.createElement(ROADMAP_BADGE_ICONS[badgeKey], { className: "h-5 w-5" })}
          </div>
          <p className="text-sm font-medium text-foreground">{t("newBadgeToast", { badge: tBadges(`${badgeKey}.name`) })}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
