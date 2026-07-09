import { NotImplementedError } from "../utils/errors";
import { ExplanationPipelineStage } from "../types/pipeline";
import type { ExplanationEngineInput } from "../dto/explanation-engine-input.dto";
import type { RiskExplanation } from "../dto/risk-explanation.dto";
import type { FinancialExplanation } from "../dto/financial-explanation.dto";
import type { TimelineExplanation } from "../dto/timeline-explanation.dto";
import type { ContextualExplainer } from "../interfaces/contextual-explainer.interface";

export class PlaceholderContextualExplainer implements ContextualExplainer {
  async explainRisk(_input: ExplanationEngineInput): Promise<RiskExplanation> {
    throw new NotImplementedError(
      ExplanationPipelineStage.WarningAnalysis,
      "ContextualExplainer.explainRisk — no risk-explanation logic exists yet."
    );
  }

  async explainFinancials(_input: ExplanationEngineInput): Promise<FinancialExplanation> {
    throw new NotImplementedError(
      ExplanationPipelineStage.WarningAnalysis,
      "ContextualExplainer.explainFinancials — no financial-explanation logic exists yet."
    );
  }

  async explainTimeline(_input: ExplanationEngineInput): Promise<TimelineExplanation> {
    throw new NotImplementedError(
      ExplanationPipelineStage.WarningAnalysis,
      "ContextualExplainer.explainTimeline — no timeline-explanation logic exists yet."
    );
  }
}
