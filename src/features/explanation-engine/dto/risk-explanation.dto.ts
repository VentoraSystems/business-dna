/** Mirrors the "low" / "moderate" / "high" three-level scale business-library uses throughout (see business-library/schema.ts's `levelDimensionSchema`). */
export type RiskLevel = "low" | "moderate" | "high";

/**
 * One risk factor, sourced from `BusinessGenome.risks[]` (see
 * business-library/schema.ts → `riskItemSchema`) and read against the
 * user's own risk-tolerance signal
 * (`AssessmentFeatureVector.dimensionInputs[MatchingDimension.Risk]`).
 */
export interface RiskFactor {
  severity: RiskLevel;
  translationKey: string;
  /** Whether the user's risk tolerance appears to offset this factor — undefined until real analysis exists. */
  offsetByUserRiskTolerance?: boolean;
}

/**
 * Produced by `ContextualExplainer.explainRisk()` (see README
 * "Judgement calls" for why risk gets its own analyzer method instead of
 * a dedicated pipeline stage).
 */
export interface RiskExplanation {
  overallRiskLevel: RiskLevel;
  factors: RiskFactor[];
}
