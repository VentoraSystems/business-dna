import type { MatchingDimension } from "@/features/matching-engine/scoring/dimensions";

/**
 * Expands one entry of `CompatibilityResult.strengths` (a bare dimension
 * key) into a structured, translatable explanation. Produced by
 * `StrengthAnalyzer.analyze()` (Strength Detection stage).
 */
export interface StrengthReason {
  dimension: MatchingDimension;
  translationKey: string;
  /** 0-1 — echoes the relevant DimensionScore.rawValue for this dimension. */
  strength: number;
}
