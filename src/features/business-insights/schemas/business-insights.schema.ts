import { z } from "zod";
import {
  bestPracticesSchema,
  businessInsightsAiMetadataSchema,
  commonMistakesSchema,
  failureStoriesSchema,
  fastestWinsSchema,
  founderAdviceSchema,
  frequentlyAskedQuestionsSchema,
  hiddenCostsSchema,
  hiddenOpportunitiesSchema,
  hiddenRisksSchema,
  industrySecretsSchema,
  marketSignalsSchema,
  mythsSchema,
  patternsSchema,
  scalingAdviceSchema,
  successStoriesSchema,
} from "./sections.schema";

/** Not annotated `z.ZodType<BusinessInsights>` so `.partial()` remains available for `businessInsightsUpdateSchema` — same reasoning as the other Business Assets composite schemas. */
export const businessInsightsSchema = z.object({
  hiddenOpportunities: hiddenOpportunitiesSchema,
  hiddenRisks: hiddenRisksSchema,
  commonMistakes: commonMistakesSchema,
  fastestWins: fastestWinsSchema,
  scalingAdvice: scalingAdviceSchema,
  founderAdvice: founderAdviceSchema,
  patterns: patternsSchema,
  industrySecrets: industrySecretsSchema,
  hiddenCosts: hiddenCostsSchema,
  marketSignals: marketSignalsSchema,
  successStories: successStoriesSchema,
  failureStories: failureStoriesSchema,
  frequentlyAskedQuestions: frequentlyAskedQuestionsSchema,
  myths: mythsSchema,
  bestPractices: bestPracticesSchema,
  aiMetadata: businessInsightsAiMetadataSchema,
});

export type BusinessInsightsSchemaOutput = z.infer<typeof businessInsightsSchema>;

export const businessInsightsCreateSchema = businessInsightsSchema;
export const businessInsightsUpdateSchema = businessInsightsSchema.partial();
