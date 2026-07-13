import "server-only";
import { db } from "@/lib/db";
import { RoadmapStageKey } from "@/features/roadmap/types/sections";

/** Fixed set of 5 for v1 — no dedicated table, stored as Roadmap.unlockedBadgeKeys (a plain string array). */
export const ROADMAP_BADGE_KEYS = [
  "firstStep",
  "readyToLaunch",
  "firstCustomer",
  "halfwayThere",
  "roadmapComplete",
] as const;

export type RoadmapBadgeKey = (typeof ROADMAP_BADGE_KEYS)[number];

export interface RoadmapProgressResult {
  totalXp: number;
  unlockedBadgeKeys: RoadmapBadgeKey[];
  newlyUnlocked: RoadmapBadgeKey[];
}

/**
 * Recomputes and persists a Roadmap's totalXp and unlockedBadgeKeys from
 * its tasks' current completion state. Not wired to any UI trigger in this
 * phase — a later phase calls this whenever a task's completedAt changes.
 *
 * Badges only ever get ADDED, never removed, even if a task is later
 * un-completed (see the union with the existing unlockedBadgeKeys below) —
 * matches the explicit "badges don't get revoked" decision.
 */
export async function recomputeRoadmapProgress(roadmapId: string): Promise<RoadmapProgressResult> {
  const roadmap = await db.roadmap.findUniqueOrThrow({
    where: { id: roadmapId },
    include: { milestones: true },
  });

  const tasks = roadmap.milestones;
  const completedTasks = tasks.filter((task) => task.completedAt !== null);
  const totalXp = completedTasks.reduce((sum, task) => sum + task.xpValue, 0);

  const launchTasks = tasks.filter((task) => task.stage === RoadmapStageKey.Launch);
  const firstCustomerTasks = tasks.filter((task) => task.stage === RoadmapStageKey.FirstCustomer);

  const earnedNow = new Set<RoadmapBadgeKey>();
  if (completedTasks.length >= 1) earnedNow.add("firstStep");
  if (launchTasks.length > 0 && launchTasks.every((task) => task.completedAt !== null)) earnedNow.add("readyToLaunch");
  if (firstCustomerTasks.length > 0 && firstCustomerTasks.every((task) => task.completedAt !== null)) {
    earnedNow.add("firstCustomer");
  }
  if (tasks.length > 0 && completedTasks.length / tasks.length >= 0.5) earnedNow.add("halfwayThere");
  if (tasks.length > 0 && completedTasks.length === tasks.length) earnedNow.add("roadmapComplete");

  const previouslyUnlocked = new Set(roadmap.unlockedBadgeKeys as RoadmapBadgeKey[]);
  const newlyUnlocked = [...earnedNow].filter((key) => !previouslyUnlocked.has(key));
  const unlockedBadgeKeys = [...new Set([...previouslyUnlocked, ...earnedNow])];

  await db.roadmap.update({
    where: { id: roadmapId },
    data: { totalXp, unlockedBadgeKeys },
  });

  return { totalXp, unlockedBadgeKeys, newlyUnlocked };
}
