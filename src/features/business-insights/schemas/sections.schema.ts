import { z } from "zod";
import { industryTypeSchema } from "@/features/business-engine/schemas/enums";
import { resourceItemSchema } from "@/features/resources/schemas/sections.schema";
import type {
  BestPractices,
  BusinessInsightsAiMetadata,
  CommonMistakes,
  FailureStories,
  FaqItem,
  FastestWins,
  FounderAdvice,
  FrequentlyAskedQuestions,
  HiddenCosts,
  HiddenOpportunities,
  HiddenRisks,
  IndustryScopedInsightItem,
  IndustrySecrets,
  InsightItem,
  MarketSignals,
  MythItem,
  Myths,
  Patterns,
  ScalingAdvice,
  SuccessStories,
} from "../types/sections";

// ---------------------------------------------------------------------------
// Shared item shapes
// ---------------------------------------------------------------------------

export const insightItemSchema: z.ZodType<InsightItem> = z.object({
  titleTranslationKey: z.string().min(1),
  detailTranslationKey: z.string().optional(),
  relatedResources: z.array(resourceItemSchema).optional(),
});

export const industryScopedInsightItemSchema: z.ZodType<IndustryScopedInsightItem> = z.object({
  titleTranslationKey: z.string().min(1),
  detailTranslationKey: z.string().optional(),
  relatedResources: z.array(resourceItemSchema).optional(),
  industry: industryTypeSchema.optional(),
});

const insightListSchema = z.object({ items: z.array(insightItemSchema) });

// ---------------------------------------------------------------------------
// 1-7, 9, 11-12, 15. Generic insight-list sections
// ---------------------------------------------------------------------------

export const hiddenOpportunitiesSchema: z.ZodType<HiddenOpportunities> = insightListSchema;
export const hiddenRisksSchema: z.ZodType<HiddenRisks> = insightListSchema;
export const commonMistakesSchema: z.ZodType<CommonMistakes> = insightListSchema;
export const fastestWinsSchema: z.ZodType<FastestWins> = insightListSchema;
export const scalingAdviceSchema: z.ZodType<ScalingAdvice> = insightListSchema;
export const founderAdviceSchema: z.ZodType<FounderAdvice> = insightListSchema;
export const patternsSchema: z.ZodType<Patterns> = insightListSchema;
export const hiddenCostsSchema: z.ZodType<HiddenCosts> = insightListSchema;
export const successStoriesSchema: z.ZodType<SuccessStories> = insightListSchema;
export const failureStoriesSchema: z.ZodType<FailureStories> = insightListSchema;
export const bestPracticesSchema: z.ZodType<BestPractices> = insightListSchema;

// ---------------------------------------------------------------------------
// 8, 10. Industry-scoped sections
// ---------------------------------------------------------------------------

export const industrySecretsSchema: z.ZodType<IndustrySecrets> = z.object({
  items: z.array(industryScopedInsightItemSchema),
});

export const marketSignalsSchema: z.ZodType<MarketSignals> = z.object({
  items: z.array(industryScopedInsightItemSchema),
});

// ---------------------------------------------------------------------------
// 13. Frequently Asked Questions
// ---------------------------------------------------------------------------

const faqItemSchema: z.ZodType<FaqItem> = z.object({
  questionTranslationKey: z.string().min(1),
  answerTranslationKey: z.string().optional(),
});

export const frequentlyAskedQuestionsSchema: z.ZodType<FrequentlyAskedQuestions> = z.object({
  items: z.array(faqItemSchema),
});

// ---------------------------------------------------------------------------
// 14. Myths
// ---------------------------------------------------------------------------

const mythItemSchema: z.ZodType<MythItem> = z.object({
  mythTranslationKey: z.string().min(1),
  factTranslationKey: z.string().optional(),
});

export const mythsSchema: z.ZodType<Myths> = z.object({
  items: z.array(mythItemSchema),
});

// ---------------------------------------------------------------------------
// 16. AI Metadata
// ---------------------------------------------------------------------------

export const businessInsightsAiMetadataSchema: z.ZodType<BusinessInsightsAiMetadata> = z.object({
  generationHintsTranslationKey: z.string().optional(),
  explanationHintsTranslationKey: z.string().optional(),
  matchingHintsTranslationKey: z.string().optional(),
});
