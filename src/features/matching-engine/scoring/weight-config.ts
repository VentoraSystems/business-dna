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

/** Every dimension's weight before `BUDGET_WEIGHT_OVERRIDE` is applied below. */
const BASE_WEIGHT = 1;

/**
 * Product decision (not an engineering default): a budget mismatch should
 * never hard-exclude a business (see `NoOpRuleEngine` — no hard exclusions
 * exist for v1), but it should visibly drag a bad-fit business down the
 * ranking rather than being drowned out by the other 13 dimensions. 5x the
 * base weight was chosen as a simple, defensible multiplier — strong enough
 * that a real budget mismatch measurably outweighs a handful of well-matched
 * dimensions, without being so extreme that budget becomes the *only*
 * dimension that matters. Revisit with real match-outcome data once any
 * exists.
 */
const BUDGET_WEIGHT_OVERRIDE = 5;

/**
 * v1 default: 13 of the 14 `MatchingDimension`s contribute equally (weight
 * `BASE_WEIGHT`); `budget` is weighted `BUDGET_WEIGHT_OVERRIDE`x higher per
 * the product decision above. `WeightConfig` stays versioned (see above) so
 * a future phase can replace this with per-dimension weights informed by
 * real match outcomes without a schema change.
 *
 * Formerly `UNIFORM_CONFIG` (every dimension at `BASE_WEIGHT`, no
 * dimension weighted above another) — renamed now that one dimension is no
 * longer uniform with the rest, so nothing in this codebase still calls a
 * non-uniformly-weighted config "uniform". Before that, `UNWEIGHTED_CONFIG`
 * (`weights: {}`, every dimension contributing 0).
 */
export const DEFAULT_CONFIG: WeightConfig = {
  version: "v2-budget-weighted",
  weights: {
    ...(Object.fromEntries(ALL_MATCHING_DIMENSIONS.map((dimension) => [dimension, BASE_WEIGHT])) as DimensionWeightMap),
    [MatchingDimension.Budget]: BUDGET_WEIGHT_OVERRIDE,
  },
};

export function getDimensionWeight(config: WeightConfig, dimension: MatchingDimension): number {
  return config.weights[dimension] ?? 0;
}
