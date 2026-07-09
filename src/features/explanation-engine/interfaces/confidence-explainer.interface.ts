import type { ExplanationEngineInput } from "../dto/explanation-engine-input.dto";
import type { ConfidenceExplanation } from "../dto/confidence-explanation.dto";

/** Explains `compatibilityResult.confidenceScore` — does not recompute it. */
export interface ConfidenceExplainer {
  explain(input: ExplanationEngineInput): Promise<ConfidenceExplanation>;
}
