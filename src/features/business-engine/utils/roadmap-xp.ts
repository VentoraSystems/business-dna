/**
 * Shared XP math — used by both toggleTaskCompletion() (roadmap-view.ts)
 * and completeDailyAction() (daily-actions.ts), so the "what's the user's
 * real total, and what level does that put them at" logic lives in one
 * place instead of two copies drifting apart.
 */

/** Flat XP-per-task model established in Part 1 (10 XP/task by default, AI tasks vary 5-25) — level is derived, never stored. */
const XP_PER_LEVEL = 100;

export function levelFromXp(totalXp: number) {
  return {
    level: Math.floor(totalXp / XP_PER_LEVEL) + 1,
    xpIntoLevel: totalXp % XP_PER_LEVEL,
    xpForNextLevel: XP_PER_LEVEL,
  };
}

/**
 * The user's real total is always `totalXp + engagementXp` — see
 * Roadmap.engagementXp's schema comment for why these two columns are
 * kept separate (recomputeRoadmapProgress() unconditionally overwrites
 * totalXp from RoadmapTask completions alone; engagementXp is where
 * daily-action and surprise-bonus XP accumulate instead, so a task toggle
 * never erases them).
 */
export function effectiveTotalXp(roadmap: { totalXp: number; engagementXp: number }): number {
  return roadmap.totalXp + roadmap.engagementXp;
}
