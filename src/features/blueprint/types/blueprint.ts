import type {
  BlueprintAiMetadata,
  BlueprintFounderFit,
  BlueprintKpis,
  BlueprintMarketing,
  BlueprintResources,
  BusinessOverview,
  ExecutiveSummary,
  FinancialOverview,
  GrowthRoadmap,
  IdealCustomer,
  LaunchChecklist,
  Market,
  Offer,
  Operations,
  Pricing,
  Revenue,
  Risks,
  Sales,
  SuccessFactors,
  Team,
  Technology,
} from "./sections";

/** The canonical Business Blueprint document shape — all 21 sections. See README.md's reuse table. */
export interface Blueprint {
  executiveSummary: ExecutiveSummary;
  businessOverview: BusinessOverview;
  founderFit: BlueprintFounderFit;
  market: Market;
  idealCustomer: IdealCustomer;
  offer: Offer;
  pricing: Pricing;
  revenue: Revenue;
  marketing: BlueprintMarketing;
  sales: Sales;
  operations: Operations;
  technology: Technology;
  team: Team;
  financialOverview: FinancialOverview;
  kpis: BlueprintKpis;
  launchChecklist: LaunchChecklist;
  growthRoadmap: GrowthRoadmap;
  risks: Risks;
  successFactors: SuccessFactors;
  resources: BlueprintResources;
  aiMetadata: BlueprintAiMetadata;
}
