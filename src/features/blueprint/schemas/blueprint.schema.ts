import { z } from "zod";
import {
  executiveSummarySchema,
  businessOverviewSchema,
  entrepreneurFitSchema,
  marketIntelligenceSchema,
  customerIntelligenceSchema,
  offerArchitectureSchema,
  revenueArchitectureSchema,
  pricingStrategySchema,
  marketingSystemSchema,
  salesSystemSchema,
  operationsSystemSchema,
  technologyStackSchema,
  automationOpportunitiesSchema,
  teamStructureSchema,
  financialOverviewSchema,
  blueprintKpisSchema,
  riskAnalysisSchema,
  competitiveAdvantagesSchema,
  launchStrategySchema,
  ninetyDayActionPlanSchema,
  scalingStrategySchema,
  exitOpportunitiesSchema,
  aiRecommendationsSchema,
  blueprintResourcesSchema,
  appendixSchema,
  blueprintAiMetadataSchema,
} from "./sections.schema";

/**
 * Not annotated `z.ZodType<Blueprint>`: `financialOverviewSchema`
 * (= business-dna's `financialDnaSchema`), `riskAnalysisSchema`
 * (= `riskDnaSchema`), and `competitiveAdvantagesSchema`
 * (= `successDnaSchema`) are themselves not annotated in business-dna,
 * for the `.default()` Input/Output divergence reasons documented there
 * — that divergence propagates here, same as v1. `z.infer` still
 * recovers the correct output type.
 */
export const blueprintSchema = z.object({
  executiveSummary: executiveSummarySchema,
  entrepreneurFit: entrepreneurFitSchema,
  businessOverview: businessOverviewSchema,
  marketIntelligence: marketIntelligenceSchema,
  customerIntelligence: customerIntelligenceSchema,
  offerArchitecture: offerArchitectureSchema,
  revenueArchitecture: revenueArchitectureSchema,
  pricingStrategy: pricingStrategySchema,
  marketingSystem: marketingSystemSchema,
  salesSystem: salesSystemSchema,
  operationsSystem: operationsSystemSchema,
  technologyStack: technologyStackSchema,
  automationOpportunities: automationOpportunitiesSchema,
  teamStructure: teamStructureSchema,
  financialOverview: financialOverviewSchema,
  kpis: blueprintKpisSchema,
  riskAnalysis: riskAnalysisSchema,
  competitiveAdvantages: competitiveAdvantagesSchema,
  launchStrategy: launchStrategySchema,
  ninetyDayActionPlan: ninetyDayActionPlanSchema,
  scalingStrategy: scalingStrategySchema,
  exitOpportunities: exitOpportunitiesSchema,
  aiRecommendations: aiRecommendationsSchema,
  resources: blueprintResourcesSchema,
  appendix: appendixSchema,
  aiMetadata: blueprintAiMetadataSchema,
});

export type BlueprintSchemaOutput = z.infer<typeof blueprintSchema>;

export const blueprintCreateSchema = blueprintSchema;
export const blueprintUpdateSchema = blueprintSchema.partial();
