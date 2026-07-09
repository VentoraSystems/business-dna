import type {
  Analytics,
  BrandPromise,
  BrandVoice,
  ChannelStrategy,
  Community,
  ContentPillars,
  CustomerPersonas,
  DesiredOutcomes,
  Funnels,
  Icp,
  LeadMagnets,
  MarketingAiMetadata,
  MarketingKpis,
  Messaging,
  PainPoints,
  Positioning,
  Retention,
  Uvp,
} from "./sections";

/** Top-level Marketing document — the 18 sections composed together. */
export interface Marketing {
  positioning: Positioning;
  brandPromise: BrandPromise;
  uvp: Uvp;
  icp: Icp;
  customerPersonas: CustomerPersonas;
  painPoints: PainPoints;
  desiredOutcomes: DesiredOutcomes;
  messaging: Messaging;
  brandVoice: BrandVoice;
  contentPillars: ContentPillars;
  channelStrategy: ChannelStrategy;
  community: Community;
  leadMagnets: LeadMagnets;
  funnels: Funnels;
  retention: Retention;
  analytics: Analytics;
  marketingKpis: MarketingKpis;
  aiMetadata: MarketingAiMetadata;
}
