/**
 * Roadmap engagement layer Part 1 — the fixed vocabulary of generic,
 * stage-agnostic daily engagement actions. Plain string keys, not a Prisma
 * enum, same "vocabulary lives in application code" precedent as
 * RoadmapStageKey (see ./sections.ts) and BlueprintSection.sectionKey.
 *
 * These are intentionally NOT tied to any specific roadmap stage —
 * breaking roadmap.json's stage-specific tasks into finer sub-steps is
 * separate, out-of-scope future work (would require re-authoring content
 * for all 22 businesses). Daily actions are a parallel, generic layer.
 */
export const DAILY_ACTION_KEYS = [
  "reflectProgress",
  "reviewBudget",
  "readBusinessTip",
  "scanCompetitor",
  "reachOutToSomeone",
  "planTomorrow",
] as const;

export type DailyActionKey = (typeof DAILY_ACTION_KEYS)[number];
