export enum TimelineConsiderationCategory {
  BreakEven = "breakEven",
  RevenueSpeed = "revenueSpeed",
  GrowthHorizon = "growthHorizon",
}

/**
 * One structured timeline callout, sourced from
 * `BusinessGenome.revenueSpeed`, `BusinessGenome.growthPotential.timeHorizonMonths`,
 * and `BusinessGenome.financialInformation.breakEvenTimelineMonths` (see
 * business-library/schema.ts) compared against the user's own timeline
 * signal (`AssessmentFeatureVector.dimensionInputs[MatchingDimension.Timeline]`).
 */
export interface TimelineConsideration {
  category: TimelineConsiderationCategory;
  translationKey: string;
  /** Echoes the relevant BusinessGenome month figure (e.g. breakEvenTimelineMonths) for direct display alongside the translationKey. */
  months?: number;
}

/**
 * Produced by `ContextualExplainer.explainTimeline()` (see README
 * "Judgement calls" for why this rides along with the Warning Analysis
 * stage instead of getting its own).
 */
export interface TimelineExplanation {
  considerations: TimelineConsideration[];
  /** Whether the candidate's timeline appears to fit the user's stated availability/urgency — undefined until real analysis exists. */
  fitsStatedTimeline?: boolean;
}
