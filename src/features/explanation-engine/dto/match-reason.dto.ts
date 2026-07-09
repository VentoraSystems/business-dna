import type { MatchingDimension } from "@/features/matching-engine/scoring/dimensions";

/** Where a given match reason's justification comes from. */
export enum MatchReasonCategory {
  DimensionAlignment = "dimensionAlignment",
  RuleOutcome = "ruleOutcome",
  SkillMatch = "skillMatch",
}

/**
 * One structured "why this matched" line item, produced by
 * `SummaryBuilder.build()` from `CompatibilityResult.dimensionScores` and
 * `CompatibilityResult.reasoning.ruleResults` (see
 * matching-engine/rules/rule-types → `RuleEvaluationResult`) — a
 * translationKey plus enough structured context to render or re-rank it,
 * never free text.
 */
export interface MatchReason {
  category: MatchReasonCategory;
  translationKey: string;
  relatedDimensions: MatchingDimension[];
  /** 0-1 — this reason's share of the overall match, for ordering reasons by importance. */
  contribution: number;
}
