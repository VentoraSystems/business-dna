import type { MatchingDimension } from "./dimensions";

/**
 * One dimension's contribution to a candidate's overall score.
 * `rawValue` and `weightedValue` are both kept (rather than only the
 * weighted result) so the "why this match" explanation UI and
 * `ExplanationGenerator` can describe both "how well you matched on X"
 * and "how much X mattered for this BusinessType".
 */
export interface DimensionScore {
  dimension: MatchingDimension;
  /** 0-1: how well the user and the candidate align on this dimension alone, before weighting. */
  rawValue: number;
  /** The weight applied for this dimension and this candidate (see WeightConfig). */
  weight: number;
  /** rawValue * weight — this dimension's actual contribution to the overall score. */
  weightedValue: number;
}
