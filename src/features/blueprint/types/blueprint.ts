import type {
  AiRecommendations,
  Appendix,
  AutomationOpportunities,
  BlueprintAiMetadata,
  BlueprintKpis,
  BlueprintResources,
  BusinessOverview,
  CompetitiveAdvantages,
  CustomerIntelligence,
  EntrepreneurFit,
  ExecutiveSummary,
  ExitOpportunities,
  FinancialOverview,
  LaunchStrategy,
  MarketIntelligence,
  MarketingSystem,
  NinetyDayActionPlan,
  OfferArchitecture,
  OperationsSystem,
  PricingStrategy,
  RevenueArchitecture,
  RiskAnalysis,
  SalesSystem,
  ScalingStrategy,
  TeamStructure,
  TechnologyStack,
} from "./sections";

/**
 * The canonical Business Blueprint document shape — v2, 25 sections
 * plus the internal-only `aiMetadata` field. See README.md's
 * "Specification History" and reuse table for the full v1→v2 mapping.
 */
export interface Blueprint {
  executiveSummary: ExecutiveSummary;
  entrepreneurFit: EntrepreneurFit;
  businessOverview: BusinessOverview;
  marketIntelligence: MarketIntelligence;
  customerIntelligence: CustomerIntelligence;
  offerArchitecture: OfferArchitecture;
  revenueArchitecture: RevenueArchitecture;
  pricingStrategy: PricingStrategy;
  marketingSystem: MarketingSystem;
  salesSystem: SalesSystem;
  operationsSystem: OperationsSystem;
  technologyStack: TechnologyStack;
  automationOpportunities: AutomationOpportunities;
  teamStructure: TeamStructure;
  financialOverview: FinancialOverview;
  kpis: BlueprintKpis;
  riskAnalysis: RiskAnalysis;
  competitiveAdvantages: CompetitiveAdvantages;
  launchStrategy: LaunchStrategy;
  ninetyDayActionPlan: NinetyDayActionPlan;
  scalingStrategy: ScalingStrategy;
  exitOpportunities: ExitOpportunities;
  aiRecommendations: AiRecommendations;
  resources: BlueprintResources;
  appendix: Appendix;
  aiMetadata: BlueprintAiMetadata;
}
