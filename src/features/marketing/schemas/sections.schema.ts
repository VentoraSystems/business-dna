import { z } from "zod";
import { CUSTOMER_TYPE_KEYS, MARKETING_CHANNEL_KEYS } from "@/features/knowledge-engine/types/vocabularies";
import { BusinessDnaKpiKey } from "@/features/business-dna/types/sections/kpis";
import type {
  Analytics,
  BrandPromise,
  BrandVoice,
  ChannelStrategy,
  Community,
  ContentPillars,
  CustomerPersona,
  CustomerPersonas,
  DesiredOutcomes,
  Funnels,
  FunnelStage,
  Icp,
  LeadMagnets,
  MarketingAiMetadata,
  MarketingKpis,
  Messaging,
  PainPoints,
  Positioning,
  Retention,
  Uvp,
} from "../types/sections";

// ---------------------------------------------------------------------------
// 1. Positioning
// ---------------------------------------------------------------------------

export const positioningSchema: z.ZodType<Positioning> = z.object({
  positioningStatementTranslationKey: z.string().optional(),
  categoryTranslationKey: z.string().optional(),
});

// ---------------------------------------------------------------------------
// 2. Brand Promise
// ---------------------------------------------------------------------------

export const brandPromiseSchema: z.ZodType<BrandPromise> = z.object({
  promiseTranslationKey: z.string().optional(),
});

// ---------------------------------------------------------------------------
// 3. UVP
// ---------------------------------------------------------------------------

export const uvpSchema: z.ZodType<Uvp> = z.object({
  uvpTranslationKey: z.string().optional(),
  differentiatorTranslationKeys: z.array(z.string()),
});

// ---------------------------------------------------------------------------
// 4. ICP
// ---------------------------------------------------------------------------

export const icpSchema: z.ZodType<Icp> = z.object({
  customerType: z.enum(CUSTOMER_TYPE_KEYS).optional(),
  descriptionTranslationKey: z.string().optional(),
  firmographicsTranslationKey: z.string().optional(),
});

// ---------------------------------------------------------------------------
// 5. Customer Personas
// ---------------------------------------------------------------------------

const customerPersonaSchema: z.ZodType<CustomerPersona> = z.object({
  nameTranslationKey: z.string().min(1),
  descriptionTranslationKey: z.string().optional(),
});

export const customerPersonasSchema: z.ZodType<CustomerPersonas> = z.object({
  personas: z.array(customerPersonaSchema),
});

// ---------------------------------------------------------------------------
// 6. Pain Points
// ---------------------------------------------------------------------------

export const painPointsSchema: z.ZodType<PainPoints> = z.object({
  painPointTranslationKeys: z.array(z.string()),
});

// ---------------------------------------------------------------------------
// 7. Desired Outcomes
// ---------------------------------------------------------------------------

export const desiredOutcomesSchema: z.ZodType<DesiredOutcomes> = z.object({
  outcomeTranslationKeys: z.array(z.string()),
});

// ---------------------------------------------------------------------------
// 8. Messaging
// ---------------------------------------------------------------------------

export const messagingSchema: z.ZodType<Messaging> = z.object({
  coreMessageTranslationKey: z.string().optional(),
  supportingMessageTranslationKeys: z.array(z.string()),
});

// ---------------------------------------------------------------------------
// 9. Brand Voice
// ---------------------------------------------------------------------------

export const brandVoiceSchema: z.ZodType<BrandVoice> = z.object({
  toneTranslationKey: z.string().optional(),
  voiceAttributeTranslationKeys: z.array(z.string()),
});

// ---------------------------------------------------------------------------
// 10. Content Pillars
// ---------------------------------------------------------------------------

export const contentPillarsSchema: z.ZodType<ContentPillars> = z.object({
  pillarTranslationKeys: z.array(z.string()),
});

// ---------------------------------------------------------------------------
// 11. Channel Strategy
// ---------------------------------------------------------------------------

export const channelStrategySchema: z.ZodType<ChannelStrategy> = z.object({
  channels: z.array(z.enum(MARKETING_CHANNEL_KEYS)),
  strategyTranslationKey: z.string().optional(),
});

// ---------------------------------------------------------------------------
// 12. Community
// ---------------------------------------------------------------------------

export const communitySchema: z.ZodType<Community> = z.object({
  communityDescriptionTranslationKey: z.string().optional(),
  platformTranslationKeys: z.array(z.string()),
});

// ---------------------------------------------------------------------------
// 13. Lead Magnets
// ---------------------------------------------------------------------------

export const leadMagnetsSchema: z.ZodType<LeadMagnets> = z.object({
  leadMagnetTranslationKeys: z.array(z.string()),
});

// ---------------------------------------------------------------------------
// 14. Funnels
// ---------------------------------------------------------------------------

const funnelStageSchema: z.ZodType<FunnelStage> = z.object({
  nameTranslationKey: z.string().min(1),
  descriptionTranslationKey: z.string().optional(),
});

export const funnelsSchema: z.ZodType<Funnels> = z.object({
  stages: z.array(funnelStageSchema),
});

// ---------------------------------------------------------------------------
// 15. Retention
// ---------------------------------------------------------------------------

export const retentionSchema: z.ZodType<Retention> = z.object({
  retentionTacticTranslationKeys: z.array(z.string()),
});

// ---------------------------------------------------------------------------
// 16. Analytics
// ---------------------------------------------------------------------------

export const analyticsSchema: z.ZodType<Analytics> = z.object({
  trackedMetricTranslationKeys: z.array(z.string()),
});

// ---------------------------------------------------------------------------
// 17. Marketing KPIs
// ---------------------------------------------------------------------------

export const marketingKpisSchema: z.ZodType<MarketingKpis> = z.object({
  kpis: z.array(z.nativeEnum(BusinessDnaKpiKey)),
});

// ---------------------------------------------------------------------------
// 18. AI Metadata
// ---------------------------------------------------------------------------

export const marketingAiMetadataSchema: z.ZodType<MarketingAiMetadata> = z.object({
  generationHintsTranslationKey: z.string().optional(),
  explanationHintsTranslationKey: z.string().optional(),
  matchingHintsTranslationKey: z.string().optional(),
});
