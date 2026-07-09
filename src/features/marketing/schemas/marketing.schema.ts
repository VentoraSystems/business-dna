import { z } from "zod";
import {
  positioningSchema,
  brandPromiseSchema,
  uvpSchema,
  icpSchema,
  customerPersonasSchema,
  painPointsSchema,
  desiredOutcomesSchema,
  messagingSchema,
  brandVoiceSchema,
  contentPillarsSchema,
  channelStrategySchema,
  communitySchema,
  leadMagnetsSchema,
  funnelsSchema,
  retentionSchema,
  analyticsSchema,
  marketingKpisSchema,
  marketingAiMetadataSchema,
} from "./sections.schema";

/** Not annotated `z.ZodType<Marketing>` so `.partial()` remains available for `marketingUpdateSchema` — same reasoning as features/blueprint's and features/financial's composite schemas. */
export const marketingSchema = z.object({
  positioning: positioningSchema,
  brandPromise: brandPromiseSchema,
  uvp: uvpSchema,
  icp: icpSchema,
  customerPersonas: customerPersonasSchema,
  painPoints: painPointsSchema,
  desiredOutcomes: desiredOutcomesSchema,
  messaging: messagingSchema,
  brandVoice: brandVoiceSchema,
  contentPillars: contentPillarsSchema,
  channelStrategy: channelStrategySchema,
  community: communitySchema,
  leadMagnets: leadMagnetsSchema,
  funnels: funnelsSchema,
  retention: retentionSchema,
  analytics: analyticsSchema,
  marketingKpis: marketingKpisSchema,
  aiMetadata: marketingAiMetadataSchema,
});

export type MarketingSchemaOutput = z.infer<typeof marketingSchema>;

export const marketingCreateSchema = marketingSchema;
export const marketingUpdateSchema = marketingSchema.partial();
