import { z } from "zod";

/**
 * @deprecated — This is the legacy Business Genome format. It is kept
 * only for backward compatibility with the one business authored under
 * it (examples/ai-automation-agency.ts, json/ai-automation-agency.json).
 * Do NOT use this for new businesses — use features/business-dna's
 * BusinessDnaProfile contract via the new business-library/technology/
 * structure instead. This format will be removed in a future migration
 * sprint once existing content is migrated. Nothing in this file's
 * exported behavior has changed because of this notice.
 */

/**
 * =============================================================================
 * BUSINESS GENOME SCHEMA
 * =============================================================================
 *
 * This file defines the Business Genome: the one structured document format
 * every BusinessType in BusinessDNA's Business Genome Library follows. It is
 * intentionally self-contained — it does not import from `src/`, so it can
 * be authored, validated, and versioned independently of the Next.js app,
 * and could be extracted into its own package later without a rewrite.
 *
 * Where this schema's vocabulary overlaps with other parts of the platform
 * (industries, business models, skill keys, dimension names), the string
 * values are kept in sync by convention with:
 *   - src/features/business-engine/schemas/enums.ts
 *   - src/features/matching-engine/scoring/dimensions.ts
 *   - src/features/assessment/config/sections.ts
 * That alignment is deliberate — see README.md → "How future BusinessTypes
 * should be created" — but it is a documentation/process discipline, not a
 * code dependency, because a Business Genome document must remain valid on
 * its own, independent of any particular app version.
 *
 * See README.md for the full explanation of what a Business Genome is and
 * how each part of the platform consumes it. See examples/ for the one
 * reference document (AI Automation Agency) this schema validates.
 * =============================================================================
 */

// -----------------------------------------------------------------------
// Shared primitives
// -----------------------------------------------------------------------

/** The two locales the platform supports today. Kept in sync with src/i18n/config.ts by convention. */
export const genomeLocaleSchema = z.enum(["en", "ro"]);
export type GenomeLocale = z.infer<typeof genomeLocaleSchema>;

/**
 * Every piece of narrative content in a Business Genome is stored inline,
 * per locale, rather than as a translationKey into messages/*.json. A
 * genome document is a large, self-contained package of long-form content
 * (marketing strategy, KPIs, a 90-day plan) — that belongs with the
 * document itself, not scattered across the app's UI translation files.
 */
export const localizedTextSchema = z.object({
  en: z.string().min(1),
  ro: z.string().min(1),
});
export type LocalizedText = z.infer<typeof localizedTextSchema>;

export const slugSchema = z
  .string()
  .min(2)
  .max(80)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Must be lowercase, hyphen-separated (e.g. \"ai-automation-agency\").");

export const nonNegativeIntSchema = z.number().int().min(0);

/** A 1-5 rating, matching the Assessment's rating-question scale and the Matching Engine's rating dimensions. */
export const ratingScaleSchema = z.number().int().min(1).max(5);

const threeLevelSchema = z.enum(["low", "moderate", "high"]);

/**
 * The recurring "a dimension has a level, plus an optional narrative"
 * shape used by difficulty, scalability, automation, aiResistance, the
 * three complexity fields, learningCurve, revenueSpeed, and profitMargin.
 * Factoring this out once keeps all of those fields structurally
 * identical instead of ad-hoc variations of the same idea.
 */
function levelDimensionSchema<TLevel extends [string, ...string[]]>(levels: TLevel) {
  return z.object({
    level: z.enum(levels),
    notes: localizedTextSchema.optional(),
  });
}

// -----------------------------------------------------------------------
// Shared vocabularies
// -----------------------------------------------------------------------
//
// These are declared locally (not imported from features/business-engine)
// so this schema has no dependency on the app — see the file header. Their
// string values are intentionally the same as the equivalent enums there.

export const industryTypeSchema = z.enum([
  "health",
  "tech",
  "food",
  "education",
  "fashion",
  "finance",
  "travel",
  "sustainability",
  "entertainment",
  "homeServices",
  "professionalServices",
  "mediaProduction",
]);

export const businessModelTypeSchema = z.enum([
  "ecommerce",
  "saas",
  "service",
  "marketplace",
  "content",
  "physicalProduct",
  "subscription",
  "agency",
]);

export const skillKeySchema = z.enum([
  "marketing",
  "sales",
  "programming",
  "ai",
  "finance",
  "management",
  "design",
  "content",
  "negotiation",
  "communication",
]);

export const personalityTraitSchema = z.enum([
  "strategic",
  "persistent",
  "systemOriented",
  "growthMindset",
  "creative",
  "analytical",
  "collaborative",
  "decisive",
  "resilient",
  "detailOriented",
  "patient",
  "riskTolerant",
]);

export const founderArchetypeSchema = z.enum([
  "theBuilder",
  "theConnector",
  "theOperator",
  "theVisionary",
  "theSpecialist",
  "theHustler",
]);

// -----------------------------------------------------------------------
// 1. Identity
// -----------------------------------------------------------------------

export const businessGenomeIdentitySchema = z.object({
  /** Stable unique identifier for this genome document — not the same as any database row id. */
  id: z.string().uuid(),
  /** URL-safe identifier. Should match BusinessType.slug if/when this genome is ingested into the Business Engine catalog. */
  slug: slugSchema,
  /** Semver for this individual document, so edits to one BusinessType's genome can be tracked over time. */
  version: z.string().regex(/^\d+\.\d+\.\d+$/, "Must be semver, e.g. \"1.0.0\"."),
  name: localizedTextSchema,
  tagline: localizedTextSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  status: z.enum(["draft", "in_review", "published", "archived"]),
});

// -----------------------------------------------------------------------
// 2. Description
// -----------------------------------------------------------------------

export const businessGenomeDescriptionSchema = z.object({
  /** One to two sentences — used in catalog/list views. */
  short: localizedTextSchema,
  /** Full narrative description — used in the detail view. */
  long: localizedTextSchema,
  /** "Who this is for" — feeds both the detail page and Matching Engine explanations. */
  idealFor: localizedTextSchema,
});

// -----------------------------------------------------------------------
// 3-5. Industry, Category, Business Model
// -----------------------------------------------------------------------

export const businessGenomeIndustrySchema = z.object({
  primary: industryTypeSchema,
  secondary: z.array(industryTypeSchema).default([]),
});

export const businessGenomeCategorySchema = z.object({
  slug: slugSchema,
  name: localizedTextSchema,
});

export const businessGenomeBusinessModelSchema = z.object({
  primary: businessModelTypeSchema,
  secondary: z.array(businessModelTypeSchema).default([]),
  /** Short narrative, e.g. "monthly retainer plus a project-based onboarding fee." */
  revenueModelSummary: localizedTextSchema.optional(),
});

// -----------------------------------------------------------------------
// 6. Founder Profile
// -----------------------------------------------------------------------

export const businessGenomeFounderProfileSchema = z.object({
  idealArchetypes: z.array(founderArchetypeSchema).min(1),
  summary: localizedTextSchema,
  minimumExperienceYears: nonNegativeIntSchema.optional(),
});

// -----------------------------------------------------------------------
// 7-8. Required Skills, Required Personality
// -----------------------------------------------------------------------

export const skillRequirementSchema = z.object({
  key: skillKeySchema,
  importance: ratingScaleSchema,
});

export const personalityRequirementSchema = z.object({
  trait: personalityTraitSchema,
  importance: ratingScaleSchema,
});

export const businessGenomeRequiredSkillsSchema = z.array(skillRequirementSchema).min(1);
export const businessGenomeRequiredPersonalitySchema = z.array(personalityRequirementSchema).min(1);

// -----------------------------------------------------------------------
// 9, 12-20. Level dimensions: Difficulty, Profit Margin, Scalability,
// Automation, AI Resistance, Legal/Marketing/Sales Complexity, Learning
// Curve, Location Dependency, Revenue Speed
// -----------------------------------------------------------------------

export const businessGenomeDifficultySchema = levelDimensionSchema(["low", "moderate", "high"]);
export const businessGenomeProfitMarginSchema = levelDimensionSchema(["low", "moderate", "high"]);
export const businessGenomeScalabilitySchema = levelDimensionSchema(["low", "moderate", "high"]);
export const businessGenomeAutomationSchema = levelDimensionSchema(["low", "moderate", "high"]);
export const businessGenomeAIResistanceSchema = levelDimensionSchema(["low", "moderate", "high"]);
export const businessGenomeLegalComplexitySchema = levelDimensionSchema(["low", "moderate", "high"]);
export const businessGenomeMarketingComplexitySchema = levelDimensionSchema(["low", "moderate", "high"]);
export const businessGenomeSalesComplexitySchema = levelDimensionSchema(["low", "moderate", "high"]);
export const businessGenomeLearningCurveSchema = levelDimensionSchema(["low", "moderate", "high"]);
export const businessGenomeLocationDependencySchema = levelDimensionSchema([
  "none",
  "local",
  "regional",
  "global",
]);
export const businessGenomeRevenueSpeedSchema = levelDimensionSchema(["slow", "moderate", "fast"]);

// -----------------------------------------------------------------------
// 11. Budget
// -----------------------------------------------------------------------

export const businessGenomeBudgetSchema = z
  .object({
    minInvestment: nonNegativeIntSchema,
    maxInvestment: nonNegativeIntSchema,
    currency: z.string().length(3).default("EUR"),
    ongoingMonthlyCostMin: nonNegativeIntSchema.optional(),
    ongoingMonthlyCostMax: nonNegativeIntSchema.optional(),
    notes: localizedTextSchema.optional(),
  })
  .refine((data) => data.maxInvestment >= data.minInvestment, {
    message: "maxInvestment must be greater than or equal to minInvestment.",
    path: ["maxInvestment"],
  });

// -----------------------------------------------------------------------
// 21. Lifestyle
// -----------------------------------------------------------------------

export const businessGenomeLifestyleSchema = z.object({
  workMode: z.enum(["remote", "hybrid", "inPerson"]),
  travelRequirement: z.enum(["none", "occasional", "frequent"]),
  onlineOffline: z.enum(["online", "offline", "hybrid"]),
  salesChannel: z.enum(["b2b", "b2c", "both"]),
  minWeeklyHours: nonNegativeIntSchema.optional(),
  maxWeeklyHours: nonNegativeIntSchema.optional(),
  freedomLevel: ratingScaleSchema.optional(),
  notes: localizedTextSchema.optional(),
});

// -----------------------------------------------------------------------
// 22. Team Size
// -----------------------------------------------------------------------

export const businessGenomeTeamSizeSchema = z.object({
  atLaunch: z.enum(["solo", "small", "large"]),
  atScale: z.enum(["solo", "small", "large"]).optional(),
  notes: localizedTextSchema.optional(),
});

// -----------------------------------------------------------------------
// 23. Growth Potential
// -----------------------------------------------------------------------

export const businessGenomeGrowthPotentialSchema = z.object({
  level: threeLevelSchema,
  ceilingNotes: localizedTextSchema.optional(),
  timeHorizonMonths: nonNegativeIntSchema.optional(),
});

// -----------------------------------------------------------------------
// 24. Financial Information
// -----------------------------------------------------------------------

export const oneTimeLineItemSchema = z.object({
  key: z.string().min(1),
  label: localizedTextSchema,
  typicalMin: z.number().min(0).optional(),
  typicalMax: z.number().min(0).optional(),
});

export const recurringLineItemSchema = z.object({
  key: z.string().min(1),
  label: localizedTextSchema,
  typicalMonthlyMin: z.number().min(0).optional(),
  typicalMonthlyMax: z.number().min(0).optional(),
});

export const revenueStreamSchema = z.object({
  key: z.string().min(1),
  label: localizedTextSchema,
});

export const businessGenomeFinancialInformationSchema = z.object({
  startupCosts: z.array(oneTimeLineItemSchema).default([]),
  recurringCosts: z.array(recurringLineItemSchema).default([]),
  revenueStreams: z.array(revenueStreamSchema).default([]),
  targetMonthlyIncomeMin: nonNegativeIntSchema.optional(),
  targetMonthlyIncomeMax: nonNegativeIntSchema.optional(),
  breakEvenTimelineMonths: nonNegativeIntSchema.optional(),
  currency: z.string().length(3).default("EUR"),
});

// -----------------------------------------------------------------------
// 25. Customer Profile
// -----------------------------------------------------------------------

export const businessGenomeCustomerProfileSchema = z.object({
  description: localizedTextSchema,
  segments: z.array(localizedTextSchema).default([]),
  painPoints: z.array(localizedTextSchema).default([]),
  buyingTriggers: z.array(localizedTextSchema).default([]),
});

// -----------------------------------------------------------------------
// 26. Marketing Strategy
// -----------------------------------------------------------------------

export const channelPlanSchema = z.object({
  /** Freeform channel-type key, e.g. "localSeo", "coldOutreach", "linkedInContent" — a future candidate for its own enum once enough genomes exist to see the real vocabulary. */
  channelType: z.string().min(1),
  description: localizedTextSchema,
  priority: z.enum(["primary", "secondary", "experimental"]),
});

export const businessGenomeMarketingStrategySchema = z.object({
  positioning: localizedTextSchema,
  channels: z.array(channelPlanSchema).min(1),
});

// -----------------------------------------------------------------------
// 27. Sales Strategy
// -----------------------------------------------------------------------

export const businessGenomeSalesStrategySchema = z.object({
  approach: localizedTextSchema,
  salesCycleLengthDays: nonNegativeIntSchema.optional(),
  pricingModel: localizedTextSchema.optional(),
});

// -----------------------------------------------------------------------
// 28. Operations
// -----------------------------------------------------------------------

export const businessGenomeOperationsSchema = z.object({
  coreProcesses: z.array(localizedTextSchema).default([]),
  dailyWorkflow: localizedTextSchema.optional(),
  fulfillmentModel: localizedTextSchema.optional(),
});

// -----------------------------------------------------------------------
// 29. Scaling
// -----------------------------------------------------------------------

export const scalingMilestoneSchema = z.object({
  monthsFromLaunch: nonNegativeIntSchema,
  description: localizedTextSchema,
});

export const businessGenomeScalingSchema = z.object({
  path: localizedTextSchema,
  bottlenecks: z.array(localizedTextSchema).default([]),
  milestones: z.array(scalingMilestoneSchema).default([]),
});

// -----------------------------------------------------------------------
// 30-31. Risks, Advantages
// -----------------------------------------------------------------------

export const riskItemSchema = z.object({
  description: localizedTextSchema,
  severity: threeLevelSchema,
  mitigation: localizedTextSchema.optional(),
});

export const advantageItemSchema = z.object({
  description: localizedTextSchema,
});

export const businessGenomeRisksSchema = z.array(riskItemSchema).default([]);
export const businessGenomeAdvantagesSchema = z.array(advantageItemSchema).default([]);

// -----------------------------------------------------------------------
// 32. AI Usage
// -----------------------------------------------------------------------

export const aiUseCaseSchema = z.object({
  /** Freeform area key, e.g. "customerSupport", "contentGeneration", "leadQualification". */
  area: z.string().min(1),
  description: localizedTextSchema,
  maturity: z.enum(["emerging", "established", "coreToModel"]),
});

export const businessGenomeAIUsageSchema = z.object({
  useCases: z.array(aiUseCaseSchema).default([]),
  aiDependencyLevel: threeLevelSchema,
});

// -----------------------------------------------------------------------
// 33. Recommended Tools
// -----------------------------------------------------------------------

export const recommendedToolSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  isRequired: z.boolean().default(true),
  websiteUrl: z.string().url().optional(),
});

export const businessGenomeRecommendedToolsSchema = z.array(recommendedToolSchema).default([]);

// -----------------------------------------------------------------------
// 34. KPIs
// -----------------------------------------------------------------------

export const kpiSchema = z.object({
  key: z.string().min(1),
  label: localizedTextSchema,
  targetDescription: localizedTextSchema.optional(),
});

export const businessGenomeKPIsSchema = z.array(kpiSchema).min(1);

// -----------------------------------------------------------------------
// 35. 90-Day Plan
// -----------------------------------------------------------------------

export const ninetyDayTaskSchema = z.object({
  week: z.number().int().min(1).max(13),
  title: localizedTextSchema,
  description: localizedTextSchema.optional(),
});

export const businessGenomeNinetyDayPlanSchema = z.object({
  theme: localizedTextSchema.optional(),
  tasks: z.array(ninetyDayTaskSchema).min(1),
});

// -----------------------------------------------------------------------
// 36. Exit Potential
// -----------------------------------------------------------------------

export const businessGenomeExitPotentialSchema = z.object({
  viable: z.boolean(),
  typicalPaths: z
    .array(z.enum(["acquisition", "acquihire", "managementBuyout", "privateEquity", "ipo", "shutdown"]))
    .default([]),
  notes: localizedTextSchema.optional(),
});

// -----------------------------------------------------------------------
// 37. Blueprint Structure
// -----------------------------------------------------------------------
//
// Mirrors BusinessBlueprintTemplate in the Business Engine
// (src/features/business-engine/schemas/templates.ts) — this is the
// section this genome should populate once it's ingested into that table.

export const businessGenomeBlueprintStructureSchema = z.object({
  /** Ordered section keys, e.g. ["executiveSummary", "marketAnalysis", ...] — matches blueprint.sections.* in messages/*.json. */
  sections: z.array(z.string().min(1)).min(1),
  promptContext: localizedTextSchema.optional(),
});

// -----------------------------------------------------------------------
// 38. Matching Metadata
// -----------------------------------------------------------------------
//
// The bridge to the Matching Engine Framework
// (src/features/matching-engine). Every field here is optional — this
// section describes the *shape* an author can fill in about what this
// BusinessType looks for in a founder; it does not compute, weight, or
// combine anything. No matching logic reads this yet (the Matching Engine
// is still a framework of placeholders — see its own README) — populating
// this section is content authoring, preparing the day that engine exists.

export const budgetRangeSchema = z.object({
  min: nonNegativeIntSchema,
  max: nonNegativeIntSchema,
  currency: z.string().length(3).default("EUR"),
});

export const timeAvailabilitySchema = z.object({
  minWeeklyHours: nonNegativeIntSchema,
  maxWeeklyHours: nonNegativeIntSchema.optional(),
});

export const businessGenomeMatchingMetadataSchema = z
  .object({
    requiredSkills: z.array(skillRequirementSchema),
    preferredSkills: z.array(skillRequirementSchema),
    requiredPersonality: z.array(personalityRequirementSchema),
    preferredPersonality: z.array(personalityRequirementSchema),
    requiredBudget: budgetRangeSchema,
    preferredBudget: budgetRangeSchema,
    riskProfile: threeLevelSchema,
    timeAvailability: timeAvailabilitySchema,
    /** Freeform tags, e.g. ["direct", "consultative"] — a future candidate for its own enum. */
    communicationStyle: z.array(z.string().min(1)),
    technicalLevel: ratingScaleSchema,
    leadershipLevel: ratingScaleSchema,
    creativityLevel: ratingScaleSchema,
    salesAffinity: ratingScaleSchema,
    automationAffinity: ratingScaleSchema,
    remotePreference: z.enum(["remote", "hybrid", "inPerson", "noPreference"]),
    travelPreference: z.enum(["none", "occasional", "frequent", "noPreference"]),
    idealFounderArchetypes: z.array(founderArchetypeSchema),
  })
  .partial();

export type BusinessGenomeMatchingMetadata = z.infer<typeof businessGenomeMatchingMetadataSchema>;

// -----------------------------------------------------------------------
// The complete Business Genome
// -----------------------------------------------------------------------

export const BUSINESS_GENOME_SCHEMA_VERSION = "1.0.0";

export const businessGenomeSchema = z.object({
  /** Versions this standard itself (schema.ts), independent of any one document's own identity.version. */
  schemaVersion: z.literal(BUSINESS_GENOME_SCHEMA_VERSION),

  identity: businessGenomeIdentitySchema,
  description: businessGenomeDescriptionSchema,
  industry: businessGenomeIndustrySchema,
  category: businessGenomeCategorySchema,
  businessModel: businessGenomeBusinessModelSchema,
  founderProfile: businessGenomeFounderProfileSchema,
  requiredSkills: businessGenomeRequiredSkillsSchema,
  requiredPersonality: businessGenomeRequiredPersonalitySchema,
  difficulty: businessGenomeDifficultySchema,
  budget: businessGenomeBudgetSchema,
  revenueSpeed: businessGenomeRevenueSpeedSchema,
  profitMargin: businessGenomeProfitMarginSchema,
  scalability: businessGenomeScalabilitySchema,
  automation: businessGenomeAutomationSchema,
  aiResistance: businessGenomeAIResistanceSchema,
  legalComplexity: businessGenomeLegalComplexitySchema,
  marketingComplexity: businessGenomeMarketingComplexitySchema,
  salesComplexity: businessGenomeSalesComplexitySchema,
  learningCurve: businessGenomeLearningCurveSchema,
  locationDependency: businessGenomeLocationDependencySchema,
  lifestyle: businessGenomeLifestyleSchema,
  teamSize: businessGenomeTeamSizeSchema,
  growthPotential: businessGenomeGrowthPotentialSchema,
  financialInformation: businessGenomeFinancialInformationSchema,
  customerProfile: businessGenomeCustomerProfileSchema,
  marketingStrategy: businessGenomeMarketingStrategySchema,
  salesStrategy: businessGenomeSalesStrategySchema,
  operations: businessGenomeOperationsSchema,
  scaling: businessGenomeScalingSchema,
  risks: businessGenomeRisksSchema,
  advantages: businessGenomeAdvantagesSchema,
  aiUsage: businessGenomeAIUsageSchema,
  recommendedTools: businessGenomeRecommendedToolsSchema,
  kpis: businessGenomeKPIsSchema,
  ninetyDayPlan: businessGenomeNinetyDayPlanSchema,
  exitPotential: businessGenomeExitPotentialSchema,
  blueprintStructure: businessGenomeBlueprintStructureSchema,
  matchingMetadata: businessGenomeMatchingMetadataSchema,
});

export type BusinessGenome = z.infer<typeof businessGenomeSchema>;

// -----------------------------------------------------------------------
// Validation helper
// -----------------------------------------------------------------------

export interface BusinessGenomeValidationResult {
  success: boolean;
  data?: BusinessGenome;
  errors?: string[];
}

/**
 * Validates an unknown value (typically a `JSON.parse()`'d file from
 * ./json/) against the Business Genome standard. Used by both
 * ./examples (at author time) and validate.ts (as a CI-style check over
 * every file in ./json).
 */
export function validateBusinessGenome(data: unknown): BusinessGenomeValidationResult {
  const result = businessGenomeSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return {
    success: false,
    errors: result.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`),
  };
}
