import { NotImplementedError } from "../utils/errors";
import { ExplanationPipelineStage } from "../types/pipeline";
import type { ExplanationEngineInput } from "../dto/explanation-engine-input.dto";
import type { Warning } from "../dto/warning.dto";
import type { WarningAnalyzer } from "../interfaces/warning-analyzer.interface";

export class PlaceholderWarningAnalyzer implements WarningAnalyzer {
  async analyze(_input: ExplanationEngineInput): Promise<Warning[]> {
    throw new NotImplementedError(
      ExplanationPipelineStage.WarningAnalysis,
      "WarningAnalyzer.analyze — no warning-detection logic exists yet."
    );
  }
}
