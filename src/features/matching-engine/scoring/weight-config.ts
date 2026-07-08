import { MatchingDimension } from "./dimensions";

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
 * Deliberately empty. No dimension has a weight yet — assigning one is a
 * product/data decision for whoever designs the actual matching algorithm,
 * not something this scaffold should pre-empt. `weights: {}` means every
 * dimension currently contributes exactly 0 to any score.
 */
export const UNWEIGHTED_CONFIG: WeightConfig = {
  version: "unassigned",
  weights: {},
};

export function getDimensionWeight(config: WeightConfig, dimension: MatchingDimension): number {
  return config.weights[dimension] ?? 0;
}
