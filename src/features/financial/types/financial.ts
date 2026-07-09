import type {
  BreakEven,
  CashFlow,
  EmergencyReserve,
  FinancialAiMetadata,
  FinancialKpis,
  FinancialRisks,
  GrossMargin,
  HiringCosts,
  MarketingBudget,
  MonthlyFixedCosts,
  NetMargin,
  PricingAssumptions,
  RevenueForecast,
  RevenueStreams,
  Scenarios,
  StartupCosts,
  Taxes,
  VariableCosts,
} from "./sections";

/** The canonical Financial document shape — all 18 sections. See README.md's reuse table. */
export interface Financial {
  startupCosts: StartupCosts;
  monthlyFixedCosts: MonthlyFixedCosts;
  variableCosts: VariableCosts;
  revenueStreams: RevenueStreams;
  pricingAssumptions: PricingAssumptions;
  revenueForecast: RevenueForecast;
  cashFlow: CashFlow;
  breakEven: BreakEven;
  grossMargin: GrossMargin;
  netMargin: NetMargin;
  hiringCosts: HiringCosts;
  marketingBudget: MarketingBudget;
  taxes: Taxes;
  emergencyReserve: EmergencyReserve;
  financialKpis: FinancialKpis;
  scenarios: Scenarios;
  financialRisks: FinancialRisks;
  aiMetadata: FinancialAiMetadata;
}
