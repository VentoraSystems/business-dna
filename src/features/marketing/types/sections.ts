import type { BusinessDnaKpiKey, CustomerTypeKey, MarketingChannelKey } from "./reused";

/**
 * The 18 Marketing sections. See README.md's reuse table for the full
 * per-section reasoning. Every narrative field is a `translationKey`
 * (points into messages/*.json) — no inline prose, per this sprint's
 * convention.
 */

/** 1. Positioning — genuinely new. */
export interface Positioning {
  positioningStatementTranslationKey?: string;
  categoryTranslationKey?: string;
}

/** 2. Brand Promise — genuinely new. */
export interface BrandPromise {
  promiseTranslationKey?: string;
}

/** 3. UVP (Unique Value Proposition) — genuinely new. */
export interface Uvp {
  uvpTranslationKey?: string;
  differentiatorTranslationKeys: string[];
}

/** 4. ICP (Ideal Customer Profile) — cross-references knowledge-engine's CustomerTypeKey, same as Blueprint's IdealCustomer.customerType. */
export interface Icp {
  customerType?: CustomerTypeKey;
  descriptionTranslationKey?: string;
  firmographicsTranslationKey?: string;
}

/** 5. Customer Personas — genuinely new; a list, distinct from the single ICP above. */
export interface CustomerPersona {
  nameTranslationKey: string;
  descriptionTranslationKey?: string;
}
export interface CustomerPersonas {
  personas: CustomerPersona[];
}

/** 6. Pain Points — genuinely new. */
export interface PainPoints {
  painPointTranslationKeys: string[];
}

/** 7. Desired Outcomes — genuinely new. */
export interface DesiredOutcomes {
  outcomeTranslationKeys: string[];
}

/** 8. Messaging — genuinely new. */
export interface Messaging {
  coreMessageTranslationKey?: string;
  supportingMessageTranslationKeys: string[];
}

/** 9. Brand Voice — genuinely new. */
export interface BrandVoice {
  toneTranslationKey?: string;
  voiceAttributeTranslationKeys: string[];
}

/** 10. Content Pillars — genuinely new. */
export interface ContentPillars {
  pillarTranslationKeys: string[];
}

/**
 * 11. Channel Strategy — reuses `BusinessMarketingTemplate`'s
 * `channelTypes` pattern (business-engine) and knowledge-engine's closed
 * `MarketingChannelKey` vocabulary (= business-library/taxonomy/marketing-channels.json)
 * rather than inventing a new channel list. Interpreted the epic's
 * "SEO/Social/Email/Paid/Referral Strategy" as ONE section covering all
 * channels via this closed key list, not five separate sections — see
 * README.md.
 */
export interface ChannelStrategy {
  channels: MarketingChannelKey[];
  strategyTranslationKey?: string;
}

/** 12. Community — genuinely new. */
export interface Community {
  communityDescriptionTranslationKey?: string;
  platformTranslationKeys: string[];
}

/** 13. Lead Magnets — genuinely new. */
export interface LeadMagnets {
  leadMagnetTranslationKeys: string[];
}

/** 14. Funnels — genuinely new. */
export interface FunnelStage {
  nameTranslationKey: string;
  descriptionTranslationKey?: string;
}
export interface Funnels {
  stages: FunnelStage[];
}

/** 15. Retention — genuinely new. */
export interface Retention {
  retentionTacticTranslationKeys: string[];
}

/** 16. Analytics — genuinely new; structural placeholder only, no computed metrics. */
export interface Analytics {
  trackedMetricTranslationKeys: string[];
}

/** 17. Marketing KPIs — cross-references business-dna's fixed KPI enum rather than redeclaring it, same pattern as Blueprint's BlueprintKpis and Financial's FinancialKpis. */
export interface MarketingKpis {
  kpis: BusinessDnaKpiKey[];
}

/**
 * 18. AI Metadata — independently defined, same pattern as
 * `features/blueprint`'s `BlueprintAiMetadata` and `features/financial`'s
 * `FinancialAiMetadata` (a bundle of translationKey hints), different
 * field set by design intent — not a straight alias of any of them.
 */
export interface MarketingAiMetadata {
  generationHintsTranslationKey?: string;
  explanationHintsTranslationKey?: string;
  matchingHintsTranslationKey?: string;
}
