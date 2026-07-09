import type { MatchingDimension } from "@/features/matching-engine/scoring/dimensions";

export enum WarningSeverity {
  Info = "info",
  Caution = "caution",
  Critical = "critical",
}

export enum WarningCategory {
  Budget = "budget",
  Skill = "skill",
  Risk = "risk",
  DataQuality = "dataQuality",
  Legal = "legal",
  Market = "market",
}

/**
 * One structured caution surfaced during the Warning Analysis stage —
 * e.g. a budget mismatch against `BusinessGenome.budget`, a missing
 * critical skill, or a low-confidence result caused by a sparsely
 * answered Assessment. Produced by `WarningAnalyzer.analyze()`.
 */
export interface Warning {
  severity: WarningSeverity;
  category: WarningCategory;
  translationKey: string;
  relatedDimension?: MatchingDimension;
}
