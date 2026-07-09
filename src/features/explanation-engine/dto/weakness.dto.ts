import type { MatchingDimension } from "@/features/matching-engine/scoring/dimensions";

/**
 * What a weakness is *about* — kept small and closed since it only needs
 * to route a `DetectedWeakness` to the right kind of `GrowthArea` later.
 */
export enum WeaknessCategory {
  Dimension = "dimension",
  MissingSkill = "missingSkill",
}

/**
 * Output of `WeaknessAnalyzer.detect()` (Weakness Detection stage) and
 * input to `GrowthOpportunityAnalyzer.analyze()` (Growth Analysis stage) —
 * a genuinely new, pipeline-internal shape for this sprint, not part of
 * `ExplanationResult` itself. One entry per dimension the user scored
 * weakly on (from `CompatibilityResult.weaknesses`) or missing skill (from
 * `CompatibilityResult.missingSkills`).
 */
export interface DetectedWeakness {
  category: WeaknessCategory;
  dimension?: MatchingDimension;
  skillKey?: string;
  /** 0-1 — how pronounced the weakness is; echoes the relevant DimensionScore.rawValue gap. */
  severity: number;
}
