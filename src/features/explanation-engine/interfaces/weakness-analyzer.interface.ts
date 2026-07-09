import type { ExplanationEngineInput } from "../dto/explanation-engine-input.dto";
import type { DetectedWeakness } from "../dto/weakness.dto";

/**
 * Weakness Detection stage: expands `compatibilityResult.weaknesses` and
 * `compatibilityResult.missingSkills` into structured DetectedWeaknesses.
 * Its output is the input to GrowthOpportunityAnalyzer, not the final
 * `growthAreas[]` itself.
 */
export interface WeaknessAnalyzer {
  detect(input: ExplanationEngineInput): Promise<DetectedWeakness[]>;
}
