import { NotImplementedError } from "../utils/errors";
import { ExplanationPipelineStage } from "../types/pipeline";
import type { ExplanationEngineInput } from "../dto/explanation-engine-input.dto";
import type { GrowthArea } from "../dto/growth-area.dto";
import type { Warning } from "../dto/warning.dto";
import type { RecommendedAction } from "../dto/recommended-action.dto";
import type { ActionPlanner } from "../interfaces/action-planner.interface";

export class PlaceholderActionPlanner implements ActionPlanner {
  async plan(
    _growthAreas: GrowthArea[],
    _warnings: Warning[],
    _input: ExplanationEngineInput
  ): Promise<RecommendedAction[]> {
    throw new NotImplementedError(
      ExplanationPipelineStage.ActionPlanning,
      "ActionPlanner.plan — no action-planning logic exists yet."
    );
  }
}
