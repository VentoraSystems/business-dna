"use server";

import { db } from "@/lib/db";
import { requireCurrentUser } from "@/lib/auth";
import { recomputeRoadmapProgress } from "@/features/business-engine/utils/roadmap-progress";
import type { RoadmapBadgeKey } from "@/features/business-engine/utils/roadmap-progress";
import { seedRoadmapIfMissing } from "@/features/business-engine/utils/roadmap-seeding";
import { recordRoadmapActivity } from "@/features/business-engine/utils/roadmap-streak";
import { rollBonusXp } from "@/features/business-engine/utils/roadmap-bonus-xp";
import { levelFromXp, effectiveTotalXp } from "@/features/business-engine/utils/roadmap-xp";
import { RoadmapStageKey, ROADMAP_STAGE_ORDER } from "@/features/roadmap/types/sections";

// "use server" files may only export async functions — these are all type-only
// exports (erased at runtime), which the react-server compiler allows.
export type { RoadmapBadgeKey };

export interface RoadmapTaskView {
  id: string;
  title: string;
  description: string | null;
  xpValue: number;
  completed: boolean;
  /** Non-null means this task came from AI enrichment (Roadmap Part 2), not the deterministic roadmap.json seed (Part 1) — the UI marks these distinctly. */
  sourceSectionKey: string | null;
}

export interface RoadmapStageView {
  stage: RoadmapStageKey;
  tasks: RoadmapTaskView[];
  /** "upcoming" when the stage has 0 tasks too — an empty stage was never started. */
  status: "completed" | "inProgress" | "upcoming";
}

export interface RoadmapView {
  roadmapId: string;
  totalXp: number;
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  unlockedBadgeKeys: RoadmapBadgeKey[];
  stages: RoadmapStageView[];
  currentStreak: number;
  longestStreak: number;
}

function stageStatus(tasks: RoadmapTaskView[]): RoadmapStageView["status"] {
  if (tasks.length === 0) return "upcoming";
  if (tasks.every((task) => task.completed)) return "completed";
  if (tasks.some((task) => task.completed)) return "inProgress";
  return "upcoming";
}

/**
 * Read path for the Roadmap page: the full Roadmap + every RoadmapTask,
 * grouped by stage in RoadmapStageKey order (deterministic Part 1 tasks and
 * AI-enriched Part 2 tasks are mixed together within a stage, each task's
 * own order field deciding position — sourceSectionKey is what
 * distinguishes them visually, not separate lists).
 *
 * Self-healing: seedRoadmapIfMissing() previously only ever ran once, at
 * adoption time (adoptBusinessMatch()) — a Business whose seeding attempt
 * failed there (e.g. adopted before this app's Roadmap schema columns
 * existed in production yet) had no retriable path afterward, and the
 * Roadmap page could only ever show a dead-end "no roadmap" empty state
 * for it. Retrying the same idempotent seed here means any Business stuck
 * in that state heals itself on its next page visit, no re-adoption
 * needed (re-adopting the same match result is a no-op anyway).
 *
 * Still returns null afterward if this Business's BusinessType genuinely
 * has no authored roadmap.json at all — a real, if rare, state (none of
 * the 21 published businesses are currently missing one, but the schema
 * doesn't guarantee it for every future one).
 */
export async function getRoadmapView(businessId: string): Promise<RoadmapView | null> {
  const user = await requireCurrentUser();

  const business = await db.business.findUnique({
    where: { id: businessId },
    include: { businessType: true, assessment: true },
  });
  if (!business || business.userId !== user.id) {
    throw new Error("BUSINESS_NOT_FOUND");
  }

  let roadmap = await db.roadmap.findUnique({
    where: { businessId },
    include: { milestones: true },
  });

  if (!roadmap && business.businessType && business.assessmentId) {
    // NOT user.locale — see the same locale-resolution note in
    // requestSectionGeneration()/adoptBusinessMatch(): User.locale is never
    // reliably set, Assessment.locale is.
    const locale = business.assessment?.locale ?? user.locale;
    await seedRoadmapIfMissing(business.id, user.id, business.businessType.slug, business.assessmentId, locale);
    roadmap = await db.roadmap.findUnique({ where: { businessId }, include: { milestones: true } });
  }

  if (!roadmap) return null;

  const tasksByStage = new Map<RoadmapStageKey, RoadmapTaskView[]>(ROADMAP_STAGE_ORDER.map((stage) => [stage, []]));
  for (const task of [...roadmap.milestones].sort((a, b) => a.order - b.order)) {
    const stage = task.stage as RoadmapStageKey;
    const view: RoadmapTaskView = {
      id: task.id,
      title: task.title,
      description: task.description,
      xpValue: task.xpValue,
      completed: task.completedAt !== null,
      sourceSectionKey: task.sourceSectionKey,
    };
    tasksByStage.get(stage)?.push(view);
  }

  const stages: RoadmapStageView[] = ROADMAP_STAGE_ORDER.map((stage) => {
    const tasks = tasksByStage.get(stage) ?? [];
    return { stage, tasks, status: stageStatus(tasks) };
  });

  const totalXp = effectiveTotalXp(roadmap);
  const { level, xpIntoLevel, xpForNextLevel } = levelFromXp(totalXp);

  return {
    roadmapId: roadmap.id,
    totalXp,
    level,
    xpIntoLevel,
    xpForNextLevel,
    unlockedBadgeKeys: roadmap.unlockedBadgeKeys as RoadmapBadgeKey[],
    stages,
    currentStreak: roadmap.currentStreak,
    longestStreak: roadmap.longestStreak,
  };
}

export interface ToggleTaskCompletionResult {
  completed: boolean;
  totalXp: number;
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  unlockedBadgeKeys: RoadmapBadgeKey[];
  newlyUnlocked: RoadmapBadgeKey[];
  currentStreak: number;
  longestStreak: number;
  /** > 0 when the surprise-bonus roll fired on this completion (see roadmap-bonus-xp.ts) — 0 on every un-completion and on most completions. Already included in totalXp; surfaced separately so a later UI phase can show a distinct "Bonus XP!" moment. */
  bonusXp: number;
}

/**
 * Flips one task's completedAt (null <-> now()) and recomputes the
 * Roadmap's XP/badge state, returning everything the header/badge row
 * needs to update without a full page reload. Ownership is checked via
 * the task's parent Roadmap.userId directly (Roadmap carries its own
 * userId — no need to round-trip through Business).
 *
 * Engagement layer Part 1, completion only (never on un-completion):
 * records streak activity, and rolls for surprise bonus XP — any bonus is
 * added to Roadmap.engagementXp, NOT totalXp (see effectiveTotalXp()'s
 * comment for why totalXp itself can't safely absorb it). Badge
 * conditions are untouched and do not consider bonus XP or streaks —
 * recomputeRoadmapProgress() itself is not modified by this phase.
 */
export async function toggleTaskCompletion(taskId: string): Promise<ToggleTaskCompletionResult> {
  const user = await requireCurrentUser();

  const task = await db.roadmapTask.findUnique({
    where: { id: taskId },
    include: { roadmap: true },
  });
  if (!task || task.roadmap.userId !== user.id) {
    throw new Error("TASK_NOT_FOUND");
  }

  const nowCompleted = task.completedAt === null;
  await db.roadmapTask.update({
    where: { id: taskId },
    data: { completedAt: nowCompleted ? new Date() : null },
  });

  const progress = await recomputeRoadmapProgress(task.roadmapId);
  let bonusXp = 0;

  if (nowCompleted) {
    await recordRoadmapActivity(task.roadmapId);
    bonusXp = rollBonusXp();
    if (bonusXp > 0) {
      await db.roadmap.update({ where: { id: task.roadmapId }, data: { engagementXp: { increment: bonusXp } } });
    }
  }

  const roadmap = await db.roadmap.findUniqueOrThrow({
    where: { id: task.roadmapId },
    select: { currentStreak: true, longestStreak: true, engagementXp: true },
  });
  const totalXp = effectiveTotalXp({ totalXp: progress.totalXp, engagementXp: roadmap.engagementXp });
  const { level, xpIntoLevel, xpForNextLevel } = levelFromXp(totalXp);

  return {
    completed: nowCompleted,
    totalXp,
    level,
    xpIntoLevel,
    xpForNextLevel,
    unlockedBadgeKeys: progress.unlockedBadgeKeys,
    newlyUnlocked: progress.newlyUnlocked,
    currentStreak: roadmap.currentStreak,
    longestStreak: roadmap.longestStreak,
    bonusXp,
  };
}
