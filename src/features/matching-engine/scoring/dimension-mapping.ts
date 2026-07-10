/**
 * The Step 1 dimension mapping, as shared numeric constants — the single
 * source of truth for how a raw Assessment answer and a raw BusinessType
 * attribute both become the same 0-1 scale for a given `MatchingDimension`.
 * Both `AssessmentNormalizer.extractFeatures()` (assessment side) and
 * `BusinessCandidateProvider.toCandidate()` (business side) import from
 * here rather than each hard-coding their own bounds, so a 0-1 value means
 * the same thing on both sides of every `ScoreCalculator` comparison. See
 * README.md's "Scoring model" section for the full mapping table and the
 * assumptions flagged alongside it.
 */

/** financialSituation.budget slider bounds (config/sections.ts) — reused rather than re-declared so this can't drift from the actual UI control. */
export const BUDGET_RANGE = { min: 0, max: 50_000 } as const;

/** lifestyle.workingHours slider bounds (config/sections.ts). */
export const WEEKLY_HOURS_RANGE = { min: 10, max: 80 } as const;

/**
 * financialSituation.desiredTimeline is a closed choice, not a slider —
 * these are this mapping's own representative month values for each
 * option, capped at 24 for "twoYearsPlus" (an open-ended option; 24 is a
 * judgment call, not a real upper bound on the assessment side).
 */
export const DESIRED_TIMELINE_MONTHS: Record<string, number> = {
  threeMonths: 3,
  sixMonths: 6,
  oneYear: 12,
  twoYearsPlus: 24,
};
export const TIMELINE_MONTHS_RANGE = { min: 0, max: 24 } as const;

/** Every `rating`-type question defaults to 1-5 (see question-renderer.tsx), matching BusinessSkill.importance's own 1-5 scale. */
export const RATING_RANGE = { min: 1, max: 5 } as const;

/**
 * low/moderate/high -> 0/0.5/1. Used for BusinessRisk.riskLevel. A
 * three-point ordinal scale collapsed to evenly-spaced points — coarse,
 * but there's no finer-grained source data to justify anything sharper.
 */
export const THREE_LEVEL_TO_UNIT: Record<"low" | "moderate" | "high", number> = {
  low: 0,
  moderate: 0.5,
  high: 1,
};

/**
 * remote/hybrid/inPerson is a genuine ordinal spectrum (not an arbitrary
 * category order) — hybrid really is the midpoint between fully remote and
 * fully in-person, so a 0/0.5/1 encoding carries real meaning here, unlike
 * industry or business-model categories (see BusinessCandidate.industryCode
 * / .businessModelCode for why those two are handled differently).
 */
export const WORK_MODE_TO_UNIT: Record<string, number> = {
  remote: 0,
  hybrid: 0.5,
  inPerson: 1,
};

/** online/hybrid/offline — same reasoning as WORK_MODE_TO_UNIT: a real spectrum, not an arbitrary category list. */
export const ONLINE_OFFLINE_TO_UNIT: Record<string, number> = {
  online: 0,
  hybrid: 0.5,
  offline: 1,
};

/**
 * Simplification, flagged: when a lifestyle question offers a
 * "noPreference" option, there's no single fixed 0-1 value that scores
 * equally well against every candidate under a plain `1 - abs(diff)`
 * comparison (that would require the comparison itself to special-case
 * "no preference", which ScoreCalculator's v1 implementation deliberately
 * doesn't do — see its own docstring). Defaulting to the dimension's
 * midpoint is a simple, defensible approximation — it minimizes worst-case
 * distance across the 0/0.5/1 candidate-side encoding — not a true
 * "always matches" semantics.
 */
export const NO_PREFERENCE_VALUE = 0.5;

/** The 10 skillKeySchema keys this platform shares between Assessment's `skills` section, RequiredSkill.key, and BusinessSkill. */
export const SKILL_KEYS = [
  "marketing",
  "sales",
  "programming",
  "ai",
  "finance",
  "management",
  "design",
  "content",
  "negotiation",
  "communication",
] as const;
