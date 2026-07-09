export enum FinancialConsiderationCategory {
  StartupBudget = "startupBudget",
  OngoingCost = "ongoingCost",
  TargetIncome = "targetIncome",
  BreakEven = "breakEven",
}

/**
 * One structured financial callout, sourced from `BusinessGenome.budget`
 * and `BusinessGenome.financialInformation` (see business-library/schema.ts)
 * compared against the user's own budget-related signal
 * (`AssessmentFeatureVector.dimensionInputs[MatchingDimension.Budget]`).
 */
export interface FinancialConsideration {
  category: FinancialConsiderationCategory;
  translationKey: string;
  /** Echoes the relevant BusinessGenome money figure (e.g. budget.minInvestment) for direct display alongside the translationKey. */
  amount?: number;
  currency?: string;
}

/**
 * Produced by `ContextualExplainer.explainFinancials()` (see README
 * "Judgement calls" for why this rides along with the Warning Analysis
 * stage instead of getting its own).
 */
export interface FinancialExplanation {
  considerations: FinancialConsideration[];
  /** Whether the candidate's budget.minInvestment/maxInvestment appears to fit the user's stated budget — undefined until real analysis exists. */
  fitsStatedBudget?: boolean;
}
