import { ALL_MATCHING_DIMENSIONS, MatchingDimension } from "./dimensions";

/**
 * A weight per dimension, in the range [-1, 1] once real values exist:
 * positive weights pull the score up as the dimension's normalized value
 * increases, negative weights pull it down (useful for a dimension where
 * "less of this" is better for a given BusinessType). Every dimension is
 * optional in the map — an absent dimension is treated as weight 0
 * (no influence), not as an error.
 */
export type DimensionWeightMap = Partial<Record<MatchingDimension, number>>;

/**
 * A named, versioned set of weights. Versioning exists so the matching
 * engine can support multiple weight configurations side by side later —
 * e.g. to A/B test a new weighting, or to let a BusinessType override the
 * global default for one dimension — without a schema change.
 */
export interface WeightConfig {
  /** Identifies this configuration, e.g. for logging which config produced a result. */
  version: string;
  weights: DimensionWeightMap;
}

/**
 * v1 default: every one of the 14 `MatchingDimension`s contributes equally
 * (weight 1) to a candidate's score. This was a deliberate product decision
 * for the first real scoring pass — no dimension is judged more important
 * than another yet (e.g. budget isn't weighted above communicationStyle) —
 * rather than an engineering default. A future phase may replace this with
 * per-dimension weights informed by real match outcomes; `WeightConfig`
 * stays versioned (see above) specifically so that transition doesn't need
 * a schema change.
 *
 * Formerly `UNWEIGHTED_CONFIG` (`weights: {}`, every dimension contributing
 * 0) — renamed together with its value now that a real weighting exists,
 * so nothing in this codebase still calls a uniformly-weighted config
 * "unweighted".
 */
export const UNIFORM_CONFIG: WeightConfig = {
  version: "v1-uniform",
  weights: Object.fromEntries(ALL_MATCHING_DIMENSIONS.map((dimension) => [dimension, 1])) as DimensionWeightMap,
};

export function getDimensionWeight(config: WeightConfig, dimension: MatchingDimension): number {
  return config.weights[dimension] ?? 0;
}
