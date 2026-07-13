import "server-only";
import { db } from "@/lib/db";

/**
 * Truncates a Date down to UTC-midnight, date-only precision. Streak
 * comparisons ("was the last activity yesterday, today, or further back?")
 * only make sense as date arithmetic, not timestamp arithmetic — two
 * completions 30 minutes apart but either side of local midnight must
 * never be treated as "different days" than two completions 23 hours
 * apart on the same UTC day, so every comparison in this module goes
 * through this same normalization first. UTC (not the request's local
 * timezone) is used for the same reason the rest of this app treats dates
 * as UTC-normalized server-side values — there's no reliable per-user
 * timezone stored anywhere to normalize to instead.
 *
 * Exported: completeDailyAction() (daily-actions.ts) reuses this same
 * normalization for DailyActionCompletion.completedAt, so "today" means
 * exactly the same thing for streaks and for daily-action dedup.
 */
export function toUtcDateOnly(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Shared streak-update helper — called by BOTH toggleTaskCompletion()
 * (RoadmapTask completion) and completeDailyAction() (DailyActionCompletion),
 * so the streak rule lives in exactly one place instead of being
 * duplicated across the two completion paths.
 *
 * Rule: completing anything today extends the streak by 1 if the
 * Roadmap's last recorded activity was exactly yesterday; leaves it
 * unchanged if the last activity was already today (no double-counting
 * multiple completions on the same day); resets it to 1 for any bigger
 * gap (2+ days) or if there's no prior activity at all. longestStreak is
 * updated to track the highest currentStreak ever reached and never
 * decreases.
 *
 * Deliberately NOT called on task un-completion — only completions extend
 * or reset the streak; toggling a task back off doesn't retroactively
 * undo a streak day (mirrors badges never being revoked).
 *
 * Wrapped in an interactive transaction: read-then-write on
 * currentStreak/lastActivityDate must be atomic, since two completions
 * landing concurrently on the same Roadmap (e.g. a task and a daily
 * action completed within the same second) could otherwise both read the
 * same pre-update currentStreak and race to write it back, silently
 * losing whichever update finished last.
 */
export async function recordRoadmapActivity(roadmapId: string, completionDate: Date = new Date()): Promise<void> {
  const today = toUtcDateOnly(completionDate);

  await db.$transaction(async (tx) => {
    const roadmap = await tx.roadmap.findUniqueOrThrow({
      where: { id: roadmapId },
      select: { currentStreak: true, longestStreak: true, lastActivityDate: true },
    });

    const lastActivity = roadmap.lastActivityDate ? toUtcDateOnly(roadmap.lastActivityDate) : null;
    const diffDays = lastActivity ? Math.round((today.getTime() - lastActivity.getTime()) / MS_PER_DAY) : null;

    let newStreak: number;
    if (diffDays === 0) {
      newStreak = roadmap.currentStreak; // already recorded activity today — no change
    } else if (diffDays === 1) {
      newStreak = roadmap.currentStreak + 1; // exactly one day after the last activity
    } else {
      newStreak = 1; // no prior activity, a 2+ day gap, or (defensively) a backdated completionDate
    }

    await tx.roadmap.update({
      where: { id: roadmapId },
      data: {
        currentStreak: newStreak,
        longestStreak: Math.max(roadmap.longestStreak, newStreak),
        lastActivityDate: today,
      },
    });
  });
}
