"use client";

import * as React from "react";
import { Flame } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toggleTaskCompletion } from "@/features/business-engine/actions/roadmap-view";
import type { RoadmapView, RoadmapBadgeKey } from "@/features/business-engine/actions/roadmap-view";
import { completeDailyAction } from "@/features/business-engine/actions/daily-actions";
import type { DailyActionView, DailyActionKey } from "@/features/business-engine/actions/daily-actions";
import { ROADMAP_BADGE_KEYS, ROADMAP_BADGE_ICONS } from "@/features/business-engine/components/roadmap-badge-config";
import { RoadmapStageTimeline } from "@/features/business-engine/components/roadmap-stage-timeline";
import { RoadmapStageCard } from "@/features/business-engine/components/roadmap-stage-card";
import { RoadmapDailyActionsSection } from "@/features/business-engine/components/roadmap-daily-actions-section";

interface RoadmapPageViewProps {
  initialView: RoadmapView;
  initialDailyActions: DailyActionView[];
}

/**
 * Top-level client orchestrator: owns the whole Roadmap page's state so a
 * single task toggle can update the header/badges/timeline/checklist
 * together without a full page reload. Optimistic: the toggled task and
 * derived XP flip immediately; the real toggleTaskCompletion() response
 * reconciles totals/badges, or reverts the optimistic change on error.
 */
export function RoadmapPageView({ initialView, initialDailyActions }: RoadmapPageViewProps) {
  const [view, setView] = React.useState(initialView);
  const [dailyActions, setDailyActions] = React.useState(initialDailyActions);
  const [pendingTaskIds, setPendingTaskIds] = React.useState<Set<string>>(new Set());
  const [pendingDailyActionKeys, setPendingDailyActionKeys] = React.useState<Set<string>>(new Set());
  const [newBadge, setNewBadge] = React.useState<RoadmapBadgeKey | null>(null);
  const [bonusEvent, setBonusEvent] = React.useState<{ id: number; amount: number } | null>(null);
  const bonusEventId = React.useRef(0);

  function triggerBonusXp(amount: number) {
    if (amount <= 0) return;
    bonusEventId.current += 1;
    setBonusEvent({ id: bonusEventId.current, amount });
  }

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
        currentStreak: result.currentStreak,
        longestStreak: result.longestStreak,
        stages: current.stages.map((stage) => ({
          ...stage,
          status: stageStatusFromTasks(stage.tasks),
        })),
      }));
      const [firstNewBadge] = result.newlyUnlocked;
      if (firstNewBadge) {
        setNewBadge(firstNewBadge);
      }
      triggerBonusXp(result.bonusXp);
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

  async function handleCompleteDailyAction(actionKey: string) {
    const action = dailyActions.find((a) => a.key === actionKey);
    if (!action || action.completedToday) return;

    const previousDailyActions = dailyActions;
    const previousView = view;

    setDailyActions((current) => current.map((a) => (a.key === actionKey ? { ...a, completedToday: true } : a)));
    setView((current) => ({ ...current, totalXp: current.totalXp + action.xpValue }));
    setPendingDailyActionKeys((current) => new Set(current).add(actionKey));

    try {
      const result = await completeDailyAction(view.roadmapId, actionKey as DailyActionKey);
      setView((current) => ({
        ...current,
        totalXp: result.totalXp,
        level: result.level,
        xpIntoLevel: result.xpIntoLevel,
        xpForNextLevel: result.xpForNextLevel,
        unlockedBadgeKeys: result.unlockedBadgeKeys,
        currentStreak: result.currentStreak,
        longestStreak: result.longestStreak,
      }));
      const [firstNewBadge] = result.newlyUnlocked;
      if (firstNewBadge) {
        setNewBadge(firstNewBadge);
      }
      triggerBonusXp(result.bonusXp);
    } catch (error) {
      if (error instanceof Error && error.message === "ALREADY_COMPLETED_TODAY") {
        // A stale double-tap raced the UI's own "already done" guard — the action really is
        // completed server-side, so keep it marked done, just undo the optimistic XP bump we
        // speculatively added, since this particular call never actually landed.
        setView((current) => ({ ...current, totalXp: Math.max(0, current.totalXp - action.xpValue) }));
      } else {
        setDailyActions(previousDailyActions);
        setView(previousView);
      }
    } finally {
      setPendingDailyActionKeys((current) => {
        const next = new Set(current);
        next.delete(actionKey);
        return next;
      });
    }
  }

  React.useEffect(() => {
    if (!newBadge) return;
    const timeout = setTimeout(() => setNewBadge(null), 4000);
    return () => clearTimeout(timeout);
  }, [newBadge]);

  React.useEffect(() => {
    if (!bonusEvent) return;
    const timeout = setTimeout(() => setBonusEvent(null), 2500);
    return () => clearTimeout(timeout);
  }, [bonusEvent]);

  return (
    <div className="flex flex-col gap-6">
      <RoadmapHero
        level={view.level}
        xpIntoLevel={view.xpIntoLevel}
        xpForNextLevel={view.xpForNextLevel}
        currentStreak={view.currentStreak}
        longestStreak={view.longestStreak}
        bonusEvent={bonusEvent}
      />
      <RoadmapBadgeRow unlockedBadgeKeys={view.unlockedBadgeKeys} />
      <RoadmapDailyActionsSection actions={dailyActions} pendingKeys={pendingDailyActionKeys} onComplete={handleCompleteDailyAction} />
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

interface BonusXpEvent {
  id: number;
  amount: number;
}

function RoadmapHero({
  level,
  xpIntoLevel,
  xpForNextLevel,
  currentStreak,
  longestStreak,
  bonusEvent,
}: {
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  currentStreak: number;
  longestStreak: number;
  bonusEvent: BonusXpEvent | null;
}) {
  const t = useTranslations("roadmap.hero");
  const tStreak = useTranslations("roadmap.streak");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative flex flex-col items-center py-2 text-center"
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-accent-foreground">{t("eyebrow")}</p>
      <p className="font-display text-5xl">{t("level", { level })}</p>
      <p className="mt-2 text-sm text-muted-foreground">{t("xpToNext", { xpIntoLevel, xpForNextLevel })}</p>
      <Progress value={(xpIntoLevel / xpForNextLevel) * 100} className="mt-4 w-full max-w-xs" />

      <div className="mt-5 flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2">
        <Flame className={cn("h-4 w-4", currentStreak > 0 ? "text-accent-foreground" : "text-muted-foreground")} />
        <span className="text-sm font-semibold text-foreground">
          {currentStreak > 0 ? tStreak("current", { count: currentStreak }) : tStreak("zero")}
        </span>
      </div>
      {longestStreak > 0 && <p className="mt-1.5 text-xs text-muted-foreground">{tStreak("longestLabel", { count: longestStreak })}</p>}

      <BonusXpMoment event={bonusEvent} />
    </motion.div>
  );
}

/**
 * The surprise-bonus-XP moment (Roadmap engagement layer Part 2) —
 * deliberately distinct from NewBadgeToast below: anchored near the XP
 * hero instead of fixed at the bottom of the screen, warning/gold-tinted
 * instead of accent-tinted, and carries a celebratory emoji rather than
 * an icon-chip, so a bonus firing never looks like a badge unlocking.
 * Keyed by event.id so two bonuses landing close together each replay
 * the animation instead of the second one being a no-op re-render.
 */
function BonusXpMoment({ event }: { event: BonusXpEvent | null }) {
  const t = useTranslations("roadmap");

  return (
    <AnimatePresence>
      {event && (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 8, scale: 0.8 }}
          animate={{ opacity: 1, y: -8, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute -top-2 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-warning/20 px-3 py-1.5 text-sm font-semibold text-warning shadow-soft"
        >
          {t("bonusXpMoment", { value: event.amount })}
        </motion.div>
      )}
    </AnimatePresence>
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
