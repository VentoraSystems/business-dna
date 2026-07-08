import { NotImplementedError } from "../utils/errors";
import { MatchingPipelineStage } from "../types/pipeline";
import type { DimensionScore } from "./dimension-score";
import type { RuleEvaluationResult } from "../rules/rule-types";

export interface CompatibilityCalculationInput {
  dimensionScores: DimensionScore[];
  ruleResults: RuleEvaluationResult[];
}

export interface CompatibilityCalculationOutput {
  /** 0-100. */
  overallScore: number;
  /** 0-1 — see CompatibilityResult.confidenceScore for the full definition. */
  confidenceScore: number;
}

/**
 * Combines per-dimension scores with rule outcomes (required/exclusion
 * rules can drop a candidate entirely; bonus/penalty rules adjust the
 * score) into the single `overallScore` and `confidenceScore` that
 * `CompatibilityResult` reports. This is deliberately a separate stage
 * from `ScoreCalculator` — how individual dimensions compare is a
 * different question from how those comparisons should combine into one
 * number, and the two may evolve independently (e.g. the combination
 * function could become a learned model — see README.md → "Where ML could
 * replace parts of this pipeline" — while dimension scoring stays
 * rule-based, or vice versa).
 */
export interface CompatibilityCalculator {
  calculate(input: CompatibilityCalculationInput): Promise<CompatibilityCalculationOutput>;
}

export class PlaceholderCompatibilityCalculator implements CompatibilityCalculator {
  async calculate(_input: CompatibilityCalculationInput): Promise<CompatibilityCalculationOutput> {
    throw new NotImplementedError(
      MatchingPipelineStage.CompatibilityCalculation,
      "CompatibilityCalculator.calculate — no score-combination logic exists yet."
    );
  }
}
