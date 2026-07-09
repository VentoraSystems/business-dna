import { NotImplementedError } from "../utils/errors";
import { ExplanationPipelineStage } from "../types/pipeline";
import type { ExplanationEngineInput } from "../dto/explanation-engine-input.dto";
import type { SummaryBuilder, SummaryBuilderOutput } from "../interfaces/summary-builder.interface";

export class PlaceholderSummaryBuilder implements SummaryBuilder {
  async build(_input: ExplanationEngineInput): Promise<SummaryBuilderOutput> {
    throw new NotImplementedError(
      ExplanationPipelineStage.ExplanationResult,
      "SummaryBuilder.build — no summary/match-reason logic exists yet."
    );
  }
}
