import { z } from "zod";
import {
  businessGenomeIdentitySchema,
  businessGenomeFounderProfileSchema,
  businessGenomeBudgetSchema,
  businessGenomeFinancialInformationSchema,
  businessGenomeRevenueSpeedSchema,
  businessGenomeProfitMarginSchema,
  businessGenomeLifestyleSchema,
  businessGenomeScalabilitySchema,
  businessGenomeDifficultySchema,
  businessGenomeAIResistanceSchema,
  businessGenomeRisksSchema,
  businessGenomeMarketingStrategySchema,
  businessGenomeMarketingComplexitySchema,
  businessGenomeSalesStrategySchema,
  businessGenomeSalesComplexitySchema,
  businessGenomeOperationsSchema,
  businessGenomeAutomationSchema,
  businessGenomeAIUsageSchema,
  businessGenomeRecommendedToolsSchema,
  businessGenomeGrowthPotentialSchema,
  businessGenomeScalingSchema,
  businessGenomeAdvantagesSchema,
  businessGenomeBlueprintStructureSchema,
  businessGenomeMatchingMetadataSchema,
  localizedTextSchema,
} from "../types/reused-from-business-library";
import { resourceTypeSchema } from "../types/reused-from-business-engine";
import type {
  Identity,
  FounderFit,
  RevenueDna,
  LifestyleDna,
  ScalabilityDna,
  MarketingDna,
  SalesDna,
  BlueprintReferences,
  AiMetadata,
} from "../types/sections";
import {
  BusinessDnaSkillKey,
  BUSINESS_DNA_SKILL_SCALE_MIN,
  BUSINESS_DNA_SKILL_SCALE_MAX,
  type SkillDna,
} from "../types/sections/lifestyle-and-skill";
import {
  ENTREPRENEUR_DNA_MATCH_KEYS,
  type EntrepreneurDnaMatch,
} from "../types/sections/entrepreneur-dna-match";
import type { BusinessCharacteristics } from "../types/sections/business-characteristics";
import {
  BUSINESS_DNA_RESOURCE_CATEGORY_KEYS,
  translationKeySchema,
  type ResourcesSection,
} from "../types/sections/resources";
import { BusinessDnaKpiKey, type KpisSection } from "../types/sections/kpis";
import {
  BusinessLifecycleStage,
  type BusinessLifecycle,
} from "../types/sections/business-lifecycle";

// ---------------------------------------------------------------------------
// 1. Identity, 2. Founder Fit — full reuse, no nested `.default()`, safe to
// annotate with `z.ZodType<T>`.
// ---------------------------------------------------------------------------

export const identitySchema: z.ZodType<Identity> = businessGenomeIdentitySchema;
export const founderFitSchema: z.ZodType<FounderFit> = businessGenomeFounderProfileSchema;

// ---------------------------------------------------------------------------
// 3. Financial DNA, 4. Revenue DNA
// ---------------------------------------------------------------------------

/**
 * NOT annotated `z.ZodType<FinancialDna>`: `businessGenomeBudgetSchema`
 * and `businessGenomeFinancialInformationSchema` both have `.default()`
 * fields (business-library/schema.ts), which makes their Zod Input and
 * Output types diverge — incompatible with `z.ZodType<T>`'s
 * single-type-parameter form (same issue explanation-engine documented
 * for `businessGenomeSchema`). `z.infer` below still recovers the right
 * output type.
 */
export const financialDnaSchema = z.object({
  budget: businessGenomeBudgetSchema,
  financialInformation: businessGenomeFinancialInformationSchema,
});
export type FinancialDnaSchemaOutput = z.infer<typeof financialDnaSchema>;

export const revenueDnaSchema: z.ZodType<RevenueDna> = z.object({
  revenueSpeed: businessGenomeRevenueSpeedSchema,
  profitMargin: businessGenomeProfitMarginSchema,
});

// ---------------------------------------------------------------------------
// 5. Lifestyle DNA, 6. Skill DNA
// ---------------------------------------------------------------------------

export const lifestyleDnaSchema: z.ZodType<LifestyleDna> = businessGenomeLifestyleSchema;

export const businessDnaSkillRatingSchema = z.object({
  key: z.nativeEnum(BusinessDnaSkillKey),
  rating: z.number().int().min(BUSINESS_DNA_SKILL_SCALE_MIN).max(BUSINESS_DNA_SKILL_SCALE_MAX),
});

export const skillDnaSchema: z.ZodType<SkillDna> = z.object({
  ratings: z.array(businessDnaSkillRatingSchema),
});

// ---------------------------------------------------------------------------
// 7. Entrepreneur DNA Match
// ---------------------------------------------------------------------------

const entrepreneurDnaMatchKeySchema = z.enum(ENTREPRENEUR_DNA_MATCH_KEYS);

export const entrepreneurDnaMatchScoreSchema = z.object({
  key: entrepreneurDnaMatchKeySchema,
  score: z.number().min(1).max(100),
});

export const entrepreneurDnaMatchSchema: z.ZodType<EntrepreneurDnaMatch> = z.object({
  scores: z.array(entrepreneurDnaMatchScoreSchema),
});

// ---------------------------------------------------------------------------
// 8. Business Characteristics
// ---------------------------------------------------------------------------

export const businessCharacteristicsSchema: z.ZodType<BusinessCharacteristics> = z.object({
  isRemoteFriendly: z.boolean(),
  isFullyRemote: z.boolean(),
  requiresTravel: z.boolean(),
  isOnlineBusiness: z.boolean(),
  isB2B: z.boolean(),
  isB2C: z.boolean(),
  isSoloFounderFriendly: z.boolean(),
  requiresEmployees: z.boolean(),
  isHighlyScalable: z.boolean(),
  isHighlyAutomatable: z.boolean(),
  isAIResistant: z.boolean(),
  requiresPhysicalLocation: z.boolean(),
  isSubscriptionBased: z.boolean(),
  isCapitalIntensive: z.boolean(),
  requiresInventory: z.boolean(),
  isSeasonalBusiness: z.boolean(),
  isFranchisable: z.boolean(),
  isRecessionResistant: z.boolean(),
});

// ---------------------------------------------------------------------------
// 9. Scalability DNA, 10. Risk DNA
// ---------------------------------------------------------------------------

export const scalabilityDnaSchema: z.ZodType<ScalabilityDna> = z.object({
  scalability: businessGenomeScalabilitySchema,
});

/**
 * NOT annotated `z.ZodType<RiskDna>`: `businessGenomeRisksSchema` is
 * `z.array(riskItemSchema).default([])` — see the Financial DNA comment
 * above for why a `.default()` anywhere in a reused sub-schema rules out
 * this annotation on the schema embedding it.
 */
export const riskDnaSchema = z.object({
  difficulty: businessGenomeDifficultySchema,
  aiResistance: businessGenomeAIResistanceSchema,
  risks: businessGenomeRisksSchema,
});
export type RiskDnaSchemaOutput = z.infer<typeof riskDnaSchema>;

// ---------------------------------------------------------------------------
// 11. Marketing DNA, 12. Sales DNA
// ---------------------------------------------------------------------------

export const marketingDnaSchema: z.ZodType<MarketingDna> = z.object({
  marketingStrategy: businessGenomeMarketingStrategySchema,
  marketingComplexity: businessGenomeMarketingComplexitySchema,
});

export const salesDnaSchema: z.ZodType<SalesDna> = z.object({
  salesStrategy: businessGenomeSalesStrategySchema,
  salesComplexity: businessGenomeSalesComplexitySchema,
});

// ---------------------------------------------------------------------------
// 13. Operations DNA, 14. Technology DNA
// ---------------------------------------------------------------------------

/** NOT annotated — `businessGenomeOperationsSchema.coreProcesses` has `.default([])`. See Financial DNA comment above. */
export const operationsDnaSchema = z.object({
  operations: businessGenomeOperationsSchema,
  automation: businessGenomeAutomationSchema,
});
export type OperationsDnaSchemaOutput = z.infer<typeof operationsDnaSchema>;

/** NOT annotated — `businessGenomeAIUsageSchema.useCases` and `businessGenomeRecommendedToolsSchema` both have `.default([])`. See Financial DNA comment above. */
export const technologyDnaSchema = z.object({
  aiUsage: businessGenomeAIUsageSchema,
  recommendedTools: businessGenomeRecommendedToolsSchema,
});
export type TechnologyDnaSchemaOutput = z.infer<typeof technologyDnaSchema>;

// ---------------------------------------------------------------------------
// 15. Growth DNA, 16. Success DNA
// ---------------------------------------------------------------------------

/** NOT annotated — `businessGenomeScalingSchema.bottlenecks`/`.milestones` have `.default([])`. See Financial DNA comment above. */
export const growthDnaSchema = z.object({
  growthPotential: businessGenomeGrowthPotentialSchema,
  scaling: businessGenomeScalingSchema,
});
export type GrowthDnaSchemaOutput = z.infer<typeof growthDnaSchema>;

/** NOT annotated — `businessGenomeAdvantagesSchema` is `z.array(...).default([])`. See Financial DNA comment above. */
export const successDnaSchema = z.object({
  advantages: businessGenomeAdvantagesSchema,
  benchmarkNotes: localizedTextSchema.optional(),
});
export type SuccessDnaSchemaOutput = z.infer<typeof successDnaSchema>;

// ---------------------------------------------------------------------------
// 17. Blueprint References
// ---------------------------------------------------------------------------

export const blueprintReferencesSchema: z.ZodType<BlueprintReferences> = z.object({
  blueprintStructure: businessGenomeBlueprintStructureSchema,
  blueprintTemplateId: z.string().cuid().optional(),
  marketingTemplateId: z.string().cuid().optional(),
  financialTemplateId: z.string().cuid().optional(),
  launchTemplateId: z.string().cuid().optional(),
});

// ---------------------------------------------------------------------------
// 18. Resources
// ---------------------------------------------------------------------------

const businessDnaResourceCategorySchema = z.enum(BUSINESS_DNA_RESOURCE_CATEGORY_KEYS);

export const businessDnaResourceSchema = z.object({
  category: businessDnaResourceCategorySchema,
  translationKey: translationKeySchema,
  relatedResourceType: resourceTypeSchema.optional(),
  url: z.string().url().optional(),
});

export const resourcesSectionSchema: z.ZodType<ResourcesSection> = z.object({
  resources: z.array(businessDnaResourceSchema),
});

// ---------------------------------------------------------------------------
// 19. KPIs
// ---------------------------------------------------------------------------

export const businessDnaKpiTargetSchema = z.object({
  key: z.nativeEnum(BusinessDnaKpiKey),
  targetDescription: localizedTextSchema.optional(),
});

export const kpisSectionSchema: z.ZodType<KpisSection> = z.object({
  targets: z.array(businessDnaKpiTargetSchema),
});

// ---------------------------------------------------------------------------
// 20. AI Metadata
// ---------------------------------------------------------------------------

/**
 * NOT annotated `z.ZodType<AiMetadata>`: although `.partial()` itself
 * doesn't make Input/Output diverge, `businessGenomeMatchingMetadataSchema`
 * nests `budgetRangeSchema` (for `requiredBudget`/`preferredBudget`),
 * which has its own `.default("EUR")` on `currency` — that inner
 * divergence propagates up regardless of the outer `.partial()`. See the
 * Financial DNA comment above for the general rule.
 */
export const aiMetadataSchema = z.object({
  matchingHints: businessGenomeMatchingMetadataSchema,
  blueprintHints: localizedTextSchema.optional(),
  marketingHints: localizedTextSchema.optional(),
  financialHints: localizedTextSchema.optional(),
  generationHints: localizedTextSchema.optional(),
});
export type AiMetadataSchemaOutput = z.infer<typeof aiMetadataSchema>;

// ---------------------------------------------------------------------------
// 21. Business Lifecycle
// ---------------------------------------------------------------------------

export const businessLifecycleStageProfileSchema = z.object({
  stage: z.nativeEnum(BusinessLifecycleStage),
  objectives: z.array(localizedTextSchema),
  kpis: z.array(z.nativeEnum(BusinessDnaKpiKey)),
  commonMistakes: z.array(localizedTextSchema),
  recommendedActions: z.array(localizedTextSchema),
  recommendedResources: z.array(translationKeySchema),
});

export const businessLifecycleSchema: z.ZodType<BusinessLifecycle> = z.object({
  stages: z.array(businessLifecycleStageProfileSchema),
});
