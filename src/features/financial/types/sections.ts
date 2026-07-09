import type { BusinessDnaKpiKey, FinancialAssumptionType, FinancialDna } from "./reused";

/**
 * The 18 Financial sections. Every cost-category section (Startup Costs,
 * Monthly Fixed Costs, Variable Costs, Hiring Costs, Marketing Budget,
 * Taxes, Emergency Reserve) reuses business-engine's
 * `BusinessFinancialTemplate` pattern — a list of category keys, not an
 * itemized array — per this epic's explicit instruction not to invent a
 * parallel cost-category shape. See README.md's reuse table.
 */

/** Shared shape for every cost-category section below. */
export interface LineItemCategoryList {
  lineItemCategories: string[];
}

/** 1. Startup Costs */
export type StartupCosts = LineItemCategoryList;
/** 2. Monthly Fixed Costs */
export type MonthlyFixedCosts = LineItemCategoryList;
/** 3. Variable Costs */
export type VariableCosts = LineItemCategoryList;

/** Revenue stream shape reused from business-dna's FinancialDna (itself from business-library's revenueStreamSchema) via indexed access — not redeclared. */
export type RevenueStreamItem = FinancialDna["financialInformation"]["revenueStreams"][number];

/** 4. Revenue Streams */
export interface RevenueStreams {
  revenueStreams: RevenueStreamItem[];
}

/** 5. Pricing Assumptions — reuses business-engine's assumptionsSchema pattern exactly. */
export interface PricingAssumptions {
  assumptionsSchema: Record<string, FinancialAssumptionType>;
}

/** 6. Revenue Forecast — structural only, no calculations. */
export interface RevenueForecast {
  assumptionsSchema: Record<string, FinancialAssumptionType>;
  notesTranslationKey?: string;
}

/** 7. Cash Flow */
export type CashFlow = LineItemCategoryList;

/** 8. Break-even — structural placeholder only, no computed estimate. */
export interface BreakEven {
  breakEvenMonthEstimate?: number;
  notesTranslationKey?: string;
}

/** 9. Gross Margin */
export interface GrossMargin {
  percentEstimate?: number;
  notesTranslationKey?: string;
}

/** 10. Net Margin */
export interface NetMargin {
  percentEstimate?: number;
  notesTranslationKey?: string;
}

/** 11. Hiring Costs */
export type HiringCosts = LineItemCategoryList;
/** 12. Marketing Budget */
export type MarketingBudget = LineItemCategoryList;
/** 13. Taxes */
export type Taxes = LineItemCategoryList;
/** 14. Emergency Reserve */
export type EmergencyReserve = LineItemCategoryList;

/** 15. Financial KPIs — cross-references business-dna's fixed KPI enum rather than redeclaring it. */
export interface FinancialKpis {
  kpis: BusinessDnaKpiKey[];
}

/** One scenario's structural placeholder — no computed figures. */
export interface FinancialScenario {
  revenueEstimate?: number;
  notesTranslationKey?: string;
}

/** 16. Scenarios */
export interface Scenarios {
  conservative: FinancialScenario;
  expected: FinancialScenario;
  optimistic: FinancialScenario;
}

export type FinancialRiskSeverity = "low" | "moderate" | "high";

export interface FinancialRiskItem {
  descriptionTranslationKey: string;
  severity: FinancialRiskSeverity;
}

/** 17. Financial Risks — genuinely new; not the same as business-dna's RiskDna (that's the general business risk section — see features/blueprint's "Risks" reuse of it). */
export interface FinancialRisks {
  risks: FinancialRiskItem[];
}

/**
 * 18. AI Metadata — same *pattern* as business-dna's `AiMetadata` and
 * features/blueprint's `BlueprintAiMetadata` (a bundle of translationKey
 * hints), independently defined per feature rather than shared, since
 * each feature's hint set differs slightly by design intent.
 */
export interface FinancialAiMetadata {
  generationHintsTranslationKey?: string;
  explanationHintsTranslationKey?: string;
  matchingHintsTranslationKey?: string;
}
