/**
 * Every type/schema this feature reuses from business-library rather
 * than redeclares. Centralized in this one file so the long relative
 * import into business-library — a deliberate, approved exception to
 * business-library's usual decoupling from `src/` (see this feature's
 * README → "Architecture relationship") — appears exactly once. Every
 * other file in this feature imports from here.
 *
 * business-library doesn't export named TS types for most of its
 * section schemas (only the schemas themselves, plus a handful of
 * `z.infer` type aliases like `BusinessGenome` and
 * `BusinessGenomeMatchingMetadata`) — the rest are derived here via
 * `z.infer`, which is deriving a type from an existing schema, not
 * redeclaring the schema's shape in a second, driftable form.
 */
import { z } from "zod";
import {
  type BusinessGenome,
  type BusinessGenomeMatchingMetadata,
  type LocalizedText,
  localizedTextSchema,
  businessGenomeSchema,
  businessGenomeIdentitySchema,
  businessGenomeFounderProfileSchema,
  businessGenomeBudgetSchema,
  businessGenomeRevenueSpeedSchema,
  businessGenomeProfitMarginSchema,
  businessGenomeFinancialInformationSchema,
  businessGenomeLifestyleSchema,
  businessGenomeScalabilitySchema,
  businessGenomeGrowthPotentialSchema,
  businessGenomeScalingSchema,
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
  businessGenomeAdvantagesSchema,
  businessGenomeMatchingMetadataSchema,
  businessGenomeBlueprintStructureSchema,
  skillKeySchema,
  founderArchetypeSchema,
} from "../../../../business-library/schema";

export type {
  BusinessGenome,
  BusinessGenomeMatchingMetadata,
  LocalizedText,
};

export {
  localizedTextSchema,
  businessGenomeSchema,
  businessGenomeIdentitySchema,
  businessGenomeFounderProfileSchema,
  businessGenomeBudgetSchema,
  businessGenomeRevenueSpeedSchema,
  businessGenomeProfitMarginSchema,
  businessGenomeFinancialInformationSchema,
  businessGenomeLifestyleSchema,
  businessGenomeScalabilitySchema,
  businessGenomeGrowthPotentialSchema,
  businessGenomeScalingSchema,
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
  businessGenomeAdvantagesSchema,
  businessGenomeMatchingMetadataSchema,
  businessGenomeBlueprintStructureSchema,
  skillKeySchema,
  founderArchetypeSchema,
};

export type BusinessGenomeIdentity = z.infer<typeof businessGenomeIdentitySchema>;
export type BusinessGenomeFounderProfile = z.infer<typeof businessGenomeFounderProfileSchema>;
export type BusinessGenomeBudget = z.infer<typeof businessGenomeBudgetSchema>;
export type BusinessGenomeRevenueSpeed = z.infer<typeof businessGenomeRevenueSpeedSchema>;
export type BusinessGenomeProfitMargin = z.infer<typeof businessGenomeProfitMarginSchema>;
export type BusinessGenomeFinancialInformation = z.infer<typeof businessGenomeFinancialInformationSchema>;
export type BusinessGenomeLifestyle = z.infer<typeof businessGenomeLifestyleSchema>;
export type BusinessGenomeScalability = z.infer<typeof businessGenomeScalabilitySchema>;
export type BusinessGenomeGrowthPotential = z.infer<typeof businessGenomeGrowthPotentialSchema>;
export type BusinessGenomeScaling = z.infer<typeof businessGenomeScalingSchema>;
export type BusinessGenomeDifficulty = z.infer<typeof businessGenomeDifficultySchema>;
export type BusinessGenomeAIResistance = z.infer<typeof businessGenomeAIResistanceSchema>;
export type BusinessGenomeRisks = z.infer<typeof businessGenomeRisksSchema>;
export type BusinessGenomeMarketingStrategy = z.infer<typeof businessGenomeMarketingStrategySchema>;
export type BusinessGenomeMarketingComplexity = z.infer<typeof businessGenomeMarketingComplexitySchema>;
export type BusinessGenomeSalesStrategy = z.infer<typeof businessGenomeSalesStrategySchema>;
export type BusinessGenomeSalesComplexity = z.infer<typeof businessGenomeSalesComplexitySchema>;
export type BusinessGenomeOperations = z.infer<typeof businessGenomeOperationsSchema>;
export type BusinessGenomeAutomation = z.infer<typeof businessGenomeAutomationSchema>;
export type BusinessGenomeAIUsage = z.infer<typeof businessGenomeAIUsageSchema>;
export type BusinessGenomeRecommendedTools = z.infer<typeof businessGenomeRecommendedToolsSchema>;
export type BusinessGenomeAdvantages = z.infer<typeof businessGenomeAdvantagesSchema>;
export type SkillKey = z.infer<typeof skillKeySchema>;
export type FounderArchetype = z.infer<typeof founderArchetypeSchema>;
export type BusinessGenomeBlueprintStructure = z.infer<typeof businessGenomeBlueprintStructureSchema>;
