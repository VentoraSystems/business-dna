import type { MatchingDimension } from "@/features/matching-engine/scoring/dimensions";

/** Mirrors WeaknessCategory (see ./weakness.dto) — kept as its own enum since a future GrowthOpportunityAnalyzer may add categories a raw weakness can't have (e.g. "experience"). */
export enum GrowthAreaCategory {
  Dimension = "dimension",
  MissingSkill = "missingSkill",
  Experience = "experience",
}

/**
 * One actionable growth opportunity, produced by
 * `GrowthOpportunityAnalyzer.analyze()` (Growth Analysis stage) from the
 * `DetectedWeakness[]` that `WeaknessAnalyzer.detect()` produced.
 */
export interface GrowthArea {
  category: GrowthAreaCategory;
  translationKey: string;
  relatedDimension?: MatchingDimension;
  relatedSkillKey?: string;
  /** 0-1 — how much room there is to grow here; higher means a bigger gap. */
  gap: number;
}
