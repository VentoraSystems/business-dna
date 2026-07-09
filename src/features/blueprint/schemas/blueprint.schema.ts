import { z } from "zod";
import {
  executiveSummarySchema,
  businessOverviewSchema,
  blueprintFounderFitSchema,
  marketSchema,
  idealCustomerSchema,
  offerSchema,
  pricingSchema,
  revenueSchema,
  blueprintMarketingSchema,
  salesSchema,
  operationsSchema,
  technologySchema,
  teamSchema,
  financialOverviewSchema,
  blueprintKpisSchema,
  launchChecklistSchema,
  growthRoadmapSchema,
  blueprintRisksSchema,
  blueprintSuccessFactorsSchema,
  blueprintResourcesSchema,
  blueprintAiMetadataSchema,
} from "./sections.schema";

/**
 * Not annotated `z.ZodType<Blueprint>`: `financialOverviewSchema`
 * (= business-dna's `financialDnaSchema`), `blueprintRisksSchema`
 * (= `riskDnaSchema`), and `blueprintSuccessFactorsSchema`
 * (= `successDnaSchema`) are themselves not annotated in business-dna,
 * for the `.default()` Input/Output divergence reasons documented there
 * — that divergence propagates here. `z.infer` still recovers the
 * correct output type.
 */
export const blueprintSchema = z.object({
  executiveSummary: executiveSummarySchema,
  businessOverview: businessOverviewSchema,
  founderFit: blueprintFounderFitSchema,
  market: marketSchema,
  idealCustomer: idealCustomerSchema,
  offer: offerSchema,
  pricing: pricingSchema,
  revenue: revenueSchema,
  marketing: blueprintMarketingSchema,
  sales: salesSchema,
  operations: operationsSchema,
  technology: technologySchema,
  team: teamSchema,
  financialOverview: financialOverviewSchema,
  kpis: blueprintKpisSchema,
  launchChecklist: launchChecklistSchema,
  growthRoadmap: growthRoadmapSchema,
  risks: blueprintRisksSchema,
  successFactors: blueprintSuccessFactorsSchema,
  resources: blueprintResourcesSchema,
  aiMetadata: blueprintAiMetadataSchema,
});

export type BlueprintSchemaOutput = z.infer<typeof blueprintSchema>;

export const blueprintCreateSchema = blueprintSchema;
export const blueprintUpdateSchema = blueprintSchema.partial();
