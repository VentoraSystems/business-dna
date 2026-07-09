import { z } from "zod";
import { founderFitSchema, financialDnaSchema, marketingDnaSchema, riskDnaSchema, successDnaSchema } from "@/features/business-dna/schemas/sections.schema";
import { industryTypeSchema, businessModelTypeSchema } from "@/features/business-engine/schemas/enums";
import {
  CUSTOMER_TYPE_KEYS,
  PRICING_MODEL_KEYS,
  REVENUE_MODEL_KEYS,
  SALES_METHOD_KEYS,
} from "@/features/knowledge-engine/types/vocabularies";
import { BusinessDnaKpiKey } from "@/features/business-dna/types/sections/kpis";
import { resourceItemSchema } from "@/features/resources/schemas/sections.schema";
import type {
  AiRecommendations,
  Appendix,
  AutomationOpportunities,
  BlueprintAiMetadata,
  BlueprintKpis,
  BlueprintResources,
  BudgetRange,
  BusinessOverview,
  CustomerIntelligence,
  ExecutiveSummary,
  ExitOpportunities,
  LaunchStrategy,
  MarketIntelligence,
  NinetyDayActionPlan,
  NinetyDayActionPlanWeek,
  OfferArchitecture,
  OperationsSystem,
  PricingStrategy,
  RevenueArchitecture,
  SalesSystem,
  ScalingStrategy,
  TeamStructure,
  TechnologyStack,
} from "../types/sections";

// Re-exported here purely for schemas/index.ts's convenience barrel — full reuse, not redeclared.
export {
  founderFitSchema as entrepreneurFitSchema,
  marketingDnaSchema as marketingSystemSchema,
  financialDnaSchema as financialOverviewSchema,
  riskDnaSchema as riskAnalysisSchema,
  successDnaSchema as competitiveAdvantagesSchema,
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
// 3. Business Overview
// ---------------------------------------------------------------------------

export const businessOverviewSchema: z.ZodType<BusinessOverview> = z.object({
  descriptionTranslationKey: z.string().min(1),
  industry: industryTypeSchema.optional(),
  categoryKey: z.string().optional(),
  foundingStoryTranslationKey: z.string().optional(),
});

// ---------------------------------------------------------------------------
// 4. Market Intelligence
// ---------------------------------------------------------------------------

export const marketIntelligenceSchema: z.ZodType<MarketIntelligence> = z.object({
  marketSizeTranslationKey: z.string().optional(),
  marketTrendsTranslationKeys: z.array(z.string()),
  competitiveLandscapeTranslationKey: z.string().optional(),
});

// ---------------------------------------------------------------------------
// 5. Customer Intelligence
// ---------------------------------------------------------------------------

export const customerIntelligenceSchema: z.ZodType<CustomerIntelligence> = z.object({
  personaTranslationKey: z.string().optional(),
  customerType: z.enum(CUSTOMER_TYPE_KEYS).optional(),
  painPointsTranslationKeys: z.array(z.string()),
});

// ---------------------------------------------------------------------------
// 6. Offer Architecture
// ---------------------------------------------------------------------------

export const offerArchitectureSchema: z.ZodType<OfferArchitecture> = z.object({
  offerDescriptionTranslationKey: z.string().optional(),
  coreFeatureTranslationKeys: z.array(z.string()),
});

// ---------------------------------------------------------------------------
// 7. Revenue Architecture
// ---------------------------------------------------------------------------

export const revenueArchitectureSchema: z.ZodType<RevenueArchitecture> = z.object({
  revenueModel: z.enum(REVENUE_MODEL_KEYS).optional(),
  revenueStreamTranslationKeys: z.array(z.string()),
});

// ---------------------------------------------------------------------------
// 8. Pricing Strategy
// ---------------------------------------------------------------------------

export const pricingStrategySchema: z.ZodType<PricingStrategy> = z.object({
  pricingModel: z.enum(PRICING_MODEL_KEYS).optional(),
  pricingSummaryTranslationKey: z.string().optional(),
});

// ---------------------------------------------------------------------------
// 10. Sales System
// ---------------------------------------------------------------------------

export const salesSystemSchema: z.ZodType<SalesSystem> = z.object({
  salesApproachTranslationKey: z.string().optional(),
  salesMethods: z.array(z.enum(SALES_METHOD_KEYS)),
});

// ---------------------------------------------------------------------------
// 11. Operations System
// ---------------------------------------------------------------------------

export const operationsSystemSchema: z.ZodType<OperationsSystem> = z.object({
  coreProcessTranslationKeys: z.array(z.string()),
  automationLevel: z.enum(["low", "moderate", "high"]).optional(),
});

// ---------------------------------------------------------------------------
// 12. Technology Stack
// ---------------------------------------------------------------------------

export const technologyStackSchema: z.ZodType<TechnologyStack> = z.object({
  techStackTranslationKeys: z.array(z.string()),
  toolKeys: z.array(z.string()),
  aiToolKeys: z.array(z.string()),
});

// ---------------------------------------------------------------------------
// 13. Automation Opportunities (NEW)
// ---------------------------------------------------------------------------

export const automationOpportunitiesSchema: z.ZodType<AutomationOpportunities> = z.object({
  opportunityTranslationKeys: z.array(z.string()),
  recommendedAiToolKeys: z.array(z.string()),
});

// ---------------------------------------------------------------------------
// 14. Team Structure
// ---------------------------------------------------------------------------

export const teamStructureSchema: z.ZodType<TeamStructure> = z.object({
  roleTranslationKeys: z.array(z.string()),
  teamSize: z.enum(["solo", "small", "large"]).optional(),
});

// ---------------------------------------------------------------------------
// 16. KPIs
// ---------------------------------------------------------------------------

export const blueprintKpisSchema: z.ZodType<BlueprintKpis> = z.object({
  kpis: z.array(z.nativeEnum(BusinessDnaKpiKey)),
});

// ---------------------------------------------------------------------------
// 19. Launch Strategy (NEW)
// ---------------------------------------------------------------------------

export const launchStrategySchema: z.ZodType<LaunchStrategy> = z.object({
  strategyTranslationKey: z.string().optional(),
  keyMilestoneTranslationKeys: z.array(z.string()),
});

// ---------------------------------------------------------------------------
// 20. 90-Day Action Plan (NEW — consolidates v1's Launch Checklist + Growth Roadmap)
// ---------------------------------------------------------------------------

const ninetyDayActionPlanWeekSchema: z.ZodType<NinetyDayActionPlanWeek> = z.object({
  weekNumber: z.number().int().min(1).max(13),
  focusTranslationKey: z.string().optional(),
  actionItemTranslationKeys: z.array(z.string()),
});

export const ninetyDayActionPlanSchema: z.ZodType<NinetyDayActionPlan> = z.object({
  weeks: z.array(ninetyDayActionPlanWeekSchema),
  checklistTranslationKeys: z.array(z.string()),
  milestoneTranslationKeys: z.array(z.string()),
});

// ---------------------------------------------------------------------------
// 21. Scaling Strategy (NEW)
// ---------------------------------------------------------------------------

export const scalingStrategySchema: z.ZodType<ScalingStrategy> = z.object({
  strategyTranslationKey: z.string().optional(),
  scalingLeverTranslationKeys: z.array(z.string()),
});

// ---------------------------------------------------------------------------
// 22. Exit Opportunities (NEW)
// ---------------------------------------------------------------------------

export const exitOpportunitiesSchema: z.ZodType<ExitOpportunities> = z.object({
  exitOptionTranslationKeys: z.array(z.string()),
});

// ---------------------------------------------------------------------------
// 23. AI Recommendations (NEW)
// ---------------------------------------------------------------------------

export const aiRecommendationsSchema: z.ZodType<AiRecommendations> = z.object({
  recommendationTranslationKeys: z.array(z.string()),
});

// ---------------------------------------------------------------------------
// 24. Resources — v2 CHANGE: reuses features/resources' resourceItemSchema
// instead of v1's alias to business-dna's resourcesSectionSchema.
// ---------------------------------------------------------------------------

export const blueprintResourcesSchema: z.ZodType<BlueprintResources> = z.object({
  resources: z.array(resourceItemSchema),
});

// ---------------------------------------------------------------------------
// 25. Appendix (NEW)
// ---------------------------------------------------------------------------

export const appendixSchema: z.ZodType<Appendix> = z.object({
  noteTranslationKeys: z.array(z.string()),
});

// ---------------------------------------------------------------------------
// AI Metadata (internal-only, not one of the 25 named sections)
// ---------------------------------------------------------------------------

export const blueprintAiMetadataSchema: z.ZodType<BlueprintAiMetadata> = z.object({
  generationHintsTranslationKey: z.string().optional(),
  explanationHintsTranslationKey: z.string().optional(),
  financialHintsTranslationKey: z.string().optional(),
  marketingHintsTranslationKey: z.string().optional(),
  matchingHintsTranslationKey: z.string().optional(),
});
