import type { ExplanationEngineInput } from "../dto/explanation-engine-input.dto";
import type { DetectedWeakness } from "../dto/weakness.dto";
import type { GrowthArea } from "../dto/growth-area.dto";

/** Growth Analysis stage: turns WeaknessAnalyzer's output into actionable GrowthAreas. */
export interface GrowthOpportunityAnalyzer {
  analyze(weaknesses: DetectedWeakness[], input: ExplanationEngineInput): Promise<GrowthArea[]>;
}
