import { NotImplementedError } from "../utils/errors";
import { MatchingPipelineStage } from "../types/pipeline";
import type { MatchingRule, RuleEvaluationContext, RuleEvaluationResult } from "./rule-types";

/**
 * Evaluates a set of rules against one candidate for one user. Runs as
 * part of the Compatibility Calculation stage, alongside
 * `CompatibilityCalculator` — see services/matching-engine.ts for how the
 * two combine.
 */
export interface RuleEngine {
  evaluate(
    rules: readonly MatchingRule[],
    context: RuleEvaluationContext
  ): Promise<RuleEvaluationResult[]>;

  /**
   * Convenience check for `required`/`exclusion` rules: does this set of
   * rule results mean the candidate must be dropped entirely? Kept
   * separate from `evaluate` so ranking can filter without recomputing
   * anything.
   */
  isExcluded(results: readonly RuleEvaluationResult[]): boolean;
}

export class PlaceholderRuleEngine implements RuleEngine {
  async evaluate(
    _rules: readonly MatchingRule[],
    _context: RuleEvaluationContext
  ): Promise<RuleEvaluationResult[]> {
    throw new NotImplementedError(
      MatchingPipelineStage.CompatibilityCalculation,
      "RuleEngine.evaluate — no rule evaluation logic exists yet; rules/rule-registry.ts is also empty."
    );
  }

  isExcluded(_results: readonly RuleEvaluationResult[]): boolean {
    throw new NotImplementedError(
      MatchingPipelineStage.CompatibilityCalculation,
      "RuleEngine.isExcluded"
    );
  }
}
