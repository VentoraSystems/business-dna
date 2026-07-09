import { z } from "zod";
import {
  founderFitSchema,
  financialDnaSchema,
  marketingDnaSchema,
  riskDnaSchema,
  successDnaSchema,
  resourcesSectionSchema,
} from "@/features/business-dna/schemas/sections.schema";
import { industryTypeSchema, businessModelTypeSchema } from "@/features/business-engine/schemas/enums";
import {
  CUSTOMER_TYPE_KEYS,
  PRICING_MODEL_KEYS,
  REVENUE_MODEL_KEYS,
  SALES_METHOD_KEYS,
} from "@/features/knowledge-engine/types/vocabularies";
import { BusinessDnaKpiKey } from "@/features/business-dna/types/sections/kpis";
import type {
  BudgetRange,
  BusinessOverview,
  ExecutiveSummary,
  Market,
  IdealCustomer,
  Offer,
  Pricing,
  Revenue,
  Sales,
  Operations,
  Technology,
  Team,
  BlueprintKpis,
  LaunchChecklist,
  GrowthRoadmap,
  BlueprintAiMetadata,
} from "../types/sections";

// Re-exported here purely for schemas/index.ts's convenience barrel — full reuse, not redeclared.
export {
  founderFitSchema as blueprintFounderFitSchema,
  marketingDnaSchema as blueprintMarketingSchema,
  financialDnaSchema as financialOverviewSchema,
  riskDnaSchema as blueprintRisksSchema,
  successDnaSchema as blueprintSuccessFactorsSchema,
  resourcesSectionSchema as blueprintResourcesSchema,
};

// ---------------------------------------------------------------------------
// 1. Executive Summary
// ---------------------------------------------------------------------------

const budgetRangeSchema: z.ZodType<BudgetRange> = z.object({
  min: z.number().nonnegative(),
  max: z.number().nonnegative(),
  currency: z.string().length(3),
});

export const executiveSummarySchema: z.ZodType<ExecutiveSummary> = z.object({
  businessSnapshotTranslationKey: z.string().min(1),
  whoThisIsForTranslationKey: z.string().min(1),
  whoShouldAvoidItTranslationKey: z.string().min(1),
  estimatedLaunchTimeMonths: z.number().int().nonnegative().optional(),
  estimatedStartupBudget: budgetRangeSchema.optional(),
  businessModel: businessModelTypeSchema.optional(),
  revenueType: z.enum(REVENUE_MODEL_KEYS).optional(),
  difficulty: z.enum(["low", "moderate", "high"]).optional(),
});

// ---------------------------------------------------------------------------
// 2. Business Overview
// ---------------------------------------------------------------------------

export const businessOverviewSchema: z.ZodType<BusinessOverview> = z.object({
  descriptionTranslationKey: z.string().min(1),
  industry: industryTypeSchema.optional(),
  categoryKey: z.string().optional(),
  foundingStoryTranslationKey: z.string().optional(),
});

// ---------------------------------------------------------------------------
// 4. Market
// ---------------------------------------------------------------------------

export const marketSchema: z.ZodType<Market> = z.object({
  marketSizeTranslationKey: z.string().optional(),
  marketTrendsTranslationKeys: z.array(z.string()),
  competitiveLandscapeTranslationKey: z.string().optional(),
});

// ---------------------------------------------------------------------------
// 5. Ideal Customer
// ---------------------------------------------------------------------------

export const idealCustomerSchema: z.ZodType<IdealCustomer> = z.object({
  personaTranslationKey: z.string().optional(),
  customerType: z.enum(CUSTOMER_TYPE_KEYS).optional(),
  painPointsTranslationKeys: z.array(z.string()),
});

// ---------------------------------------------------------------------------
// 6. Offer
// ---------------------------------------------------------------------------

export const offerSchema: z.ZodType<Offer> = z.object({
  offerDescriptionTranslationKey: z.string().optional(),
  coreFeatureTranslationKeys: z.array(z.string()),
});

// ---------------------------------------------------------------------------
// 7. Pricing
// ---------------------------------------------------------------------------

export const pricingSchema: z.ZodType<Pricing> = z.object({
  pricingModel: z.enum(PRICING_MODEL_KEYS).optional(),
  pricingSummaryTranslationKey: z.string().optional(),
});

// ---------------------------------------------------------------------------
// 8. Revenue
// ---------------------------------------------------------------------------

export const revenueSchema: z.ZodType<Revenue> = z.object({
  revenueModel: z.enum(REVENUE_MODEL_KEYS).optional(),
  revenueStreamTranslationKeys: z.array(z.string()),
});

// ---------------------------------------------------------------------------
// 10. Sales
// ---------------------------------------------------------------------------

export const salesSchema: z.ZodType<Sales> = z.object({
  salesApproachTranslationKey: z.string().optional(),
  salesMethods: z.array(z.enum(SALES_METHOD_KEYS)),
});

// ---------------------------------------------------------------------------
// 11. Operations
// ---------------------------------------------------------------------------

export const operationsSchema: z.ZodType<Operations> = z.object({
  coreProcessTranslationKeys: z.array(z.string()),
  automationLevel: z.enum(["low", "moderate", "high"]).optional(),
});

// ---------------------------------------------------------------------------
// 12. Technology
// ---------------------------------------------------------------------------

export const technologySchema: z.ZodType<Technology> = z.object({
  techStackTranslationKeys: z.array(z.string()),
  toolKeys: z.array(z.string()),
  aiToolKeys: z.array(z.string()),
});

// ---------------------------------------------------------------------------
// 13. Team
// ---------------------------------------------------------------------------

export const teamSchema: z.ZodType<Team> = z.object({
  roleTranslationKeys: z.array(z.string()),
  teamSize: z.enum(["solo", "small", "large"]).optional(),
});

// ---------------------------------------------------------------------------
// 15. KPIs
// ---------------------------------------------------------------------------

export const blueprintKpisSchema: z.ZodType<BlueprintKpis> = z.object({
  kpis: z.array(z.nativeEnum(BusinessDnaKpiKey)),
});

// ---------------------------------------------------------------------------
// 16. Launch Checklist
// ---------------------------------------------------------------------------

export const launchChecklistSchema: z.ZodType<LaunchChecklist> = z.object({
  itemTranslationKeys: z.array(z.string()),
});

// ---------------------------------------------------------------------------
// 17. Growth Roadmap
// ---------------------------------------------------------------------------

export const growthRoadmapSchema: z.ZodType<GrowthRoadmap> = z.object({
  milestoneTranslationKeys: z.array(z.string()),
});

// ---------------------------------------------------------------------------
// 21. AI Metadata
// ---------------------------------------------------------------------------

export const blueprintAiMetadataSchema: z.ZodType<BlueprintAiMetadata> = z.object({
  generationHintsTranslationKey: z.string().optional(),
  explanationHintsTranslationKey: z.string().optional(),
  financialHintsTranslationKey: z.string().optional(),
  marketingHintsTranslationKey: z.string().optional(),
  matchingHintsTranslationKey: z.string().optional(),
});
