import { NotImplementedError } from "../utils/errors";
import { ExplanationPipelineStage } from "../types/pipeline";
import type { ExplanationEngineInput } from "../dto/explanation-engine-input.dto";
import type { DetectedWeakness } from "../dto/weakness.dto";
import type { GrowthArea } from "../dto/growth-area.dto";
import type { GrowthOpportunityAnalyzer } from "../interfaces/growth-opportunity-analyzer.interface";

export class PlaceholderGrowthOpportunityAnalyzer implements GrowthOpportunityAnalyzer {
  async analyze(
    _weaknesses: DetectedWeakness[],
    _input: ExplanationEngineInput
  ): Promise<GrowthArea[]> {
    throw new NotImplementedError(
      ExplanationPipelineStage.GrowthAnalysis,
      "GrowthOpportunityAnalyzer.analyze — no growth-opportunity logic exists yet."
    );
  }
}
