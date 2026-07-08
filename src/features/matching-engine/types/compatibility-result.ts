import type { DimensionScore } from "../scoring/dimension-score";
import type { RuleEvaluationResult } from "../rules/rule-types";

/**
 * Structured explanation data, distinct from `reasoning.summary` (the
 * eventual AI-generated prose). Keeping the rule results here means the
 * "why this match" UI can render a deterministic breakdown even before
 * `ExplanationGenerator` produces any text, and can show both side by
 * side once it does.
 */
export interface MatchReasoning {
  /** AI-generated explanation text, once ExplanationGenerator is implemented. Absent until then. */
  summary?: string;
  ruleResults: RuleEvaluationResult[];
  generatedAt?: Date;
}

/**
 * The final, normalized shape produced for one (user, Assessment,
 * BusinessType) combination — this is what
 * `businessMatchRepository.create()` (see
 * features/business-engine/repositories/business-match-repository.ts)
 * should eventually persist as a `BusinessMatchResult` row, and what
 * `scoreBreakdown` on that row should be shaped from.
 */
export interface CompatibilityResult {
  businessTypeId: string;
  /** 0-100, the final ranked score. */
  overallScore: number;
  dimensionScores: DimensionScore[];
  /** Dimension keys (or, later, translationKeys) the user scored strongly on relative to this candidate. */
  strengths: string[];
  /** Dimension keys the user scored weakly on relative to this candidate. */
  weaknesses: string[];
  /** RequiredSkill keys the user's Assessment answers satisfy for this candidate. */
  matchedSkills: string[];
  /** RequiredSkill keys this candidate needs that the user's Assessment answers don't yet show. */
  missingSkills: string[];
  /**
   * Other BusinessTypeIds worth surfacing alongside this one — e.g. close
   * alternatives, or businesses in the same category. Empty until the
   * ranking stage has a notion of "related", which it does not yet.
   */
  recommendedBusinessTypes: string[];
  /** 0-1 — how much data was available to compute this result (fully-answered assessment vs. partial). */
  confidenceScore: number;
  reasoning: MatchReasoning;
}
