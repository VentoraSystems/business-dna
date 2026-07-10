import { NotImplementedError } from "../utils/errors";
import { MatchingPipelineStage } from "../types/pipeline";
import type { DimensionScore } from "./dimension-score";
import type { RuleEvaluationResult } from "../rules/rule-types";
import { ALL_MATCHING_DIMENSIONS } from "./dimensions";
import { clamp, weightedAverage } from "../utils/normalization-math";

export interface CompatibilityCalculationInput {
  dimensionScores: DimensionScore[];
  ruleResults: RuleEvaluationResult[];
  /**
   * v1 confidenceScore stub input — how many of the Assessment's questions
   * were actually answered, out of the total question bank. Optional: if
   * omitted (e.g. existing callers/tests that predate this), confidence
   * falls back to dimension coverage (`dimensionScores.length` out of the
   * 14 possible) instead.
   */
  answeredQuestionCount?: number;
  totalQuestionCount?: number;
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

/**
 * v1 implementation: `overallScore` is the weight-weighted average of
 * every `DimensionScore.rawValue` (0-1), scaled to 0-100, then adjusted by
 * any rule `scoreAdjustment`s (a no-op in this phase — `RuleEngine` is a
 * safe no-op with an empty `matchingRules`, see rules/rule-engine.ts).
 * `confidenceScore` is `answeredQuestionCount / totalQuestionCount` when
 * supplied (the v1 stub this phase specifies), falling back to how many of
 * the 14 dimensions this candidate actually had a score for otherwise.
 */
export class DefaultCompatibilityCalculator implements CompatibilityCalculator {
  async calculate(input: CompatibilityCalculationInput): Promise<CompatibilityCalculationOutput> {
    const { dimensionScores, ruleResults, answeredQuestionCount, totalQuestionCount } = input;

    const weightedScore = weightedAverage(
      dimensionScores.map((score) => ({ value: score.rawValue, weight: score.weight }))
    );
    const ruleAdjustment = ruleResults.reduce((sum, result) => sum + result.scoreAdjustment, 0);
    const overallScore = clamp(weightedScore * 100 + ruleAdjustment, 0, 100);

    const confidenceScore =
      totalQuestionCount && totalQuestionCount > 0 && answeredQuestionCount !== undefined
        ? clamp(answeredQuestionCount / totalQuestionCount, 0, 1)
        : clamp(dimensionScores.length / ALL_MATCHING_DIMENSIONS.length, 0, 1);

    return { overallScore, confidenceScore };
  }
}
