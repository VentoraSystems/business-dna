"use server";

import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { requireCurrentUser } from "@/lib/auth";
import { recomputeRoadmapProgress } from "@/features/business-engine/utils/roadmap-progress";
import type { RoadmapBadgeKey } from "@/features/business-engine/utils/roadmap-progress";
import { recordRoadmapActivity, toUtcDateOnly } from "@/features/business-engine/utils/roadmap-streak";
import { rollBonusXp } from "@/features/business-engine/utils/roadmap-bonus-xp";
import { levelFromXp, effectiveTotalXp } from "@/features/business-engine/utils/roadmap-xp";
import type { DailyActionKey } from "@/features/roadmap/types/daily-actions";

// "use server" files may only export async functions — these are all type-only
// exports (erased at runtime), which the react-server compiler allows.
export type { RoadmapBadgeKey, DailyActionKey };

export interface DailyActionView {
  key: string;
  /** Resolved by a future UI as `${translationKey}.title` / `${translationKey}.description` via next-intl — not baked into a column, same convention as BusinessTag/BusinessResource's catalog metadata. */
  translationKey: string;
  xpValue: number;
  completedToday: boolean;
}

/**
 * All catalog DailyActions, each flagged with whether THIS roadmap has
 * already completed it today (UTC date-only, same normalization
 * recordRoadmapActivity uses — see toUtcDateOnly()). Ownership is checked
 * via Roadmap.userId directly.
 */
export async function getTodaysDailyActions(roadmapId: string): Promise<DailyActionView[]> {
  const user = await requireCurrentUser();

  const roadmap = await db.roadmap.findUnique({ where: { id: roadmapId } });
  if (!roadmap || roadmap.userId !== user.id) {
    throw new Error("ROADMAP_NOT_FOUND");
  }

  const today = toUtcDateOnly(new Date());
  const [actions, completions] = await Promise.all([
    db.dailyAction.findMany({ orderBy: { createdAt: "asc" } }),
    db.dailyActionCompletion.findMany({ where: { roadmapId, completedAt: today } }),
  ]);
  const completedKeysToday = new Set(completions.map((completion) => completion.dailyActionKey));

  return actions.map((action) => ({
    key: action.key,
    translationKey: action.translationKey,
    xpValue: action.xpValue,
    completedToday: completedKeysToday.has(action.key),
  }));
}

export interface CompleteDailyActionResult {
  totalXp: number;
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  unlockedBadgeKeys: RoadmapBadgeKey[];
  newlyUnlocked: RoadmapBadgeKey[];
  currentStreak: number;
  longestStreak: number;
  /** > 0 when the surprise-bonus roll fired on this completion — see roadmap-bonus-xp.ts. Already included in totalXp. */
  bonusXp: number;
}

/**
 * Completes one DailyAction for today. The DailyActionCompletion's unique
 * constraint ([roadmapId, dailyActionKey, completedAt]) is what actually
 * prevents completing the same action twice for credit on the same day —
 * this catches that specific constraint violation and raises a friendly
 * "ALREADY_COMPLETED_TODAY" instead of letting a raw Prisma error through.
 *
 * Ordering mirrors toggleTaskCompletion()'s (roadmap-view.ts):
 * recomputeRoadmapProgress() runs first — its task-based totalXp/badge
 * recalculation is untouched by this phase and doesn't know about daily
 * actions at all (see roadmap-xp.ts's comment for why totalXp and
 * engagementXp are kept separate) — THEN this action's xpValue and any
 * bonus roll are added to Roadmap.engagementXp in one combined increment.
 *
 * Badges: intentionally do NOT consider daily actions in this phase.
 * recomputeRoadmapProgress()'s 5 badge conditions are all
 * RoadmapTask-completion-based, and that logic isn't touched here, per
 * this phase's scope. A later phase could add a daily-action- or
 * streak-driven badge without needing to change this function's shape.
 */
export async function completeDailyAction(roadmapId: string, dailyActionKey: DailyActionKey): Promise<CompleteDailyActionResult> {
  const user = await requireCurrentUser();

  const roadmap = await db.roadmap.findUnique({ where: { id: roadmapId } });
  if (!roadmap || roadmap.userId !== user.id) {
    throw new Error("ROADMAP_NOT_FOUND");
  }

  const dailyAction = await db.dailyAction.findUnique({ where: { key: dailyActionKey } });
  if (!dailyAction) {
    throw new Error("DAILY_ACTION_NOT_FOUND");
  }

  const today = toUtcDateOnly(new Date());
  try {
    await db.dailyActionCompletion.create({ data: { roadmapId, dailyActionKey, completedAt: today } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new Error("ALREADY_COMPLETED_TODAY");
    }
    throw error;
  }

  const progress = await recomputeRoadmapProgress(roadmapId);
  await recordRoadmapActivity(roadmapId, today);

  const bonusXp = rollBonusXp();
  const updated = await db.roadmap.update({
    where: { id: roadmapId },
    data: { engagementXp: { increment: dailyAction.xpValue + bonusXp } },
    select: { engagementXp: true, currentStreak: true, longestStreak: true },
  });

  const totalXp = effectiveTotalXp({ totalXp: progress.totalXp, engagementXp: updated.engagementXp });
  const { level, xpIntoLevel, xpForNextLevel } = levelFromXp(totalXp);

  return {
    totalXp,
    level,
    xpIntoLevel,
    xpForNextLevel,
    unlockedBadgeKeys: progress.unlockedBadgeKeys,
    newlyUnlocked: progress.newlyUnlocked,
    currentStreak: updated.currentStreak,
    longestStreak: updated.longestStreak,
    bonusXp,
  };
}
