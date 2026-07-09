import type { ExplanationEngineInput } from "../dto/explanation-engine-input.dto";
import type { GrowthArea } from "../dto/growth-area.dto";
import type { Warning } from "../dto/warning.dto";
import type { RecommendedAction } from "../dto/recommended-action.dto";

/** Action Planning stage: turns GrowthAreas and Warnings into concrete next steps. */
export interface ActionPlanner {
  plan(
    growthAreas: GrowthArea[],
    warnings: Warning[],
    input: ExplanationEngineInput
  ): Promise<RecommendedAction[]>;
}
