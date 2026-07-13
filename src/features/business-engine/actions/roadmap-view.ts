"use server";

import { db } from "@/lib/db";
import { requireCurrentUser } from "@/lib/auth";
import { recomputeRoadmapProgress } from "@/features/business-engine/utils/roadmap-progress";
import type { RoadmapBadgeKey } from "@/features/business-engine/utils/roadmap-progress";
import { RoadmapStageKey, ROADMAP_STAGE_ORDER } from "@/features/roadmap/types/sections";

// "use server" files may only export async functions — these are all type-only
// exports (erased at runtime), which the react-server compiler allows.
export type { RoadmapBadgeKey };

/** Flat XP-per-task model established in Part 1 (10 XP/task by default, AI tasks vary 5-25) — level is derived, never stored. */
const XP_PER_LEVEL = 100;

function levelFromXp(totalXp: number) {
  return {
    level: Math.floor(totalXp / XP_PER_LEVEL) + 1,
    xpIntoLevel: totalXp % XP_PER_LEVEL,
    xpForNextLevel: XP_PER_LEVEL,
  };
}

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
 * distinguishes them visually, not separate lists). Returns null if this
 * Business has no Roadmap yet (its BusinessType has no authored
 * roadmap.json, or seeding silently no-op'd) — a legitimate, expected
 * state, not an error.
 */
export async function getRoadmapView(businessId: string): Promise<RoadmapView | null> {
  const user = await requireCurrentUser();

  const business = await db.business.findUnique({ where: { id: businessId } });
  if (!business || business.userId !== user.id) {
    throw new Error("BUSINESS_NOT_FOUND");
  }

  const roadmap = await db.roadmap.findUnique({
    where: { businessId },
    include: { milestones: true },
  });
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

  const { level, xpIntoLevel, xpForNextLevel } = levelFromXp(roadmap.totalXp);

  return {
    roadmapId: roadmap.id,
    totalXp: roadmap.totalXp,
    level,
    xpIntoLevel,
    xpForNextLevel,
    unlockedBadgeKeys: roadmap.unlockedBadgeKeys as RoadmapBadgeKey[],
    stages,
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
}

/**
 * Flips one task's completedAt (null <-> now()) and recomputes the
 * Roadmap's XP/badge state, returning everything the header/badge row
 * needs to update without a full page reload. Ownership is checked via
 * the task's parent Roadmap.userId directly (Roadmap carries its own
 * userId — no need to round-trip through Business).
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
  const { level, xpIntoLevel, xpForNextLevel } = levelFromXp(progress.totalXp);

  return {
    completed: nowCompleted,
    totalXp: progress.totalXp,
    level,
    xpIntoLevel,
    xpForNextLevel,
    unlockedBadgeKeys: progress.unlockedBadgeKeys,
    newlyUnlocked: progress.newlyUnlocked,
  };
}
