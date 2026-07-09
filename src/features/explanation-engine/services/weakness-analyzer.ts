import { NotImplementedError } from "../utils/errors";
import { ExplanationPipelineStage } from "../types/pipeline";
import type { ExplanationEngineInput } from "../dto/explanation-engine-input.dto";
import type { DetectedWeakness } from "../dto/weakness.dto";
import type { WeaknessAnalyzer } from "../interfaces/weakness-analyzer.interface";

export class PlaceholderWeaknessAnalyzer implements WeaknessAnalyzer {
  async detect(_input: ExplanationEngineInput): Promise<DetectedWeakness[]> {
    throw new NotImplementedError(
      ExplanationPipelineStage.WeaknessDetection,
      "WeaknessAnalyzer.detect — no weakness-detection logic exists yet."
    );
  }
}
