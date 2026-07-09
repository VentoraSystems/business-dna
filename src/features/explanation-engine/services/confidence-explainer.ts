import { NotImplementedError } from "../utils/errors";
import { ExplanationPipelineStage } from "../types/pipeline";
import type { ExplanationEngineInput } from "../dto/explanation-engine-input.dto";
import type { ConfidenceExplanation } from "../dto/confidence-explanation.dto";
import type { ConfidenceExplainer } from "../interfaces/confidence-explainer.interface";

export class PlaceholderConfidenceExplainer implements ConfidenceExplainer {
  async explain(_input: ExplanationEngineInput): Promise<ConfidenceExplanation> {
    throw new NotImplementedError(
      ExplanationPipelineStage.ExplanationResult,
      "ConfidenceExplainer.explain — no confidence-explanation logic exists yet."
    );
  }
}
