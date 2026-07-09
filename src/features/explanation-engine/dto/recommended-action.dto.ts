import type { MatchingDimension } from "@/features/matching-engine/scoring/dimensions";

export enum ActionCategory {
  SkillBuilding = "skillBuilding",
  Financial = "financial",
  Networking = "networking",
  Validation = "validation",
  Planning = "planning",
}

export enum ActionPriority {
  Low = "low",
  Medium = "medium",
  High = "high",
}

/**
 * One structured next step, produced by `ActionPlanner.plan()` (Action
 * Planning stage) from the Growth Analysis and Warning Analysis outputs —
 * a translationKey plus enough structured context to sort/group actions,
 * never free text (that's the future AI layer's job — see
 * ExplanationResult.recommendedActions in ../dto/explanation-result.dto).
 */
export interface RecommendedAction {
  category: ActionCategory;
  priority: ActionPriority;
  translationKey: string;
  relatedDimension?: MatchingDimension;
  relatedSkillKey?: string;
}
