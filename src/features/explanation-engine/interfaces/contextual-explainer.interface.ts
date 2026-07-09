import type { ExplanationEngineInput } from "../dto/explanation-engine-input.dto";
import type { RiskExplanation } from "../dto/risk-explanation.dto";
import type { FinancialExplanation } from "../dto/financial-explanation.dto";
import type { TimelineExplanation } from "../dto/timeline-explanation.dto";

/**
 * Explains three BusinessGenome-derived contextual concerns — risk,
 * financial fit, and timeline fit — against the user's own profile. Not
 * one of the seven named services this sprint's spec lists; added
 * because `riskExplanation`/`financialExplanation`/`timelineExplanation`
 * are `ExplanationResult` fields with no obvious owner among the other
 * seven. See ../README.md → "Judgement calls" for the reasoning.
 */
export interface ContextualExplainer {
  explainRisk(input: ExplanationEngineInput): Promise<RiskExplanation>;
  explainFinancials(input: ExplanationEngineInput): Promise<FinancialExplanation>;
  explainTimeline(input: ExplanationEngineInput): Promise<TimelineExplanation>;
}
