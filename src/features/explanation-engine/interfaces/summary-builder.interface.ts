import type { ExplanationEngineInput } from "../dto/explanation-engine-input.dto";
import type { OverallSummary } from "../dto/overall-summary.dto";
import type { MatchReason } from "../dto/match-reason.dto";

export interface SummaryBuilderOutput {
  overallSummary: OverallSummary;
  matchReasons: MatchReason[];
}

/**
 * Produces the top-line "why this match" summary and its structured
 * match reasons. Reads `input.compatibilityResult.dimensionScores` and
 * `input.compatibilityResult.reasoning.ruleResults` (see
 * matching-engine/rules/rule-types → RuleEvaluationResult) — both are
 * already part of `ExplanationEngineInput`, not separate parameters.
 */
export interface SummaryBuilder {
  build(input: ExplanationEngineInput): Promise<SummaryBuilderOutput>;
}
