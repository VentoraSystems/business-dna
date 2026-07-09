import { NotImplementedError } from "../utils/errors";
import { ExplanationPipelineStage } from "../types/pipeline";
import type { ExplanationEngineInput } from "../dto/explanation-engine-input.dto";
import type { StrengthReason } from "../dto/strength-reason.dto";
import type { StrengthAnalyzer } from "../interfaces/strength-analyzer.interface";

export class PlaceholderStrengthAnalyzer implements StrengthAnalyzer {
  async analyze(_input: ExplanationEngineInput): Promise<StrengthReason[]> {
    throw new NotImplementedError(
      ExplanationPipelineStage.StrengthDetection,
      "StrengthAnalyzer.analyze — no strength-explanation logic exists yet."
    );
  }
}
