/**
 * Every knowledge domain this engine can be queried about — the single
 * source of truth for domain names, same role `MatchingPipelineStage`
 * plays for matching-engine's stages. Three of these
 * (Industries, BusinessModels, Skills) cross-reference an existing
 * vocabulary elsewhere in the codebase instead of owning their own — see
 * ./reused-vocabularies.ts and README.md's domain table. The rest are
 * net-new to this feature.
 */
export enum KnowledgeDomain {
  Industries = "industries",
  BusinessModels = "businessModels",
  Skills = "skills",
  RevenueModels = "revenueModels",
  CustomerTypes = "customerTypes",
  PricingModels = "pricingModels",
  MarketingChannels = "marketingChannels",
  /** Sales METHODS (direct/channel-partner/inside-sales/...) — not business-engine's SalesChannel (b2b/b2c/both). See ./vocabularies.ts → SalesMethodKey. */
  SalesMethods = "salesMethods",
  DistributionChannels = "distributionChannels",
  BusinessTools = "businessTools",
  AITools = "aiTools",
  LegalStructures = "legalStructures",
  FundingOptions = "fundingOptions",
  BusinessRisks = "businessRisks",
  KPIs = "kpis",
  GrowthStrategies = "growthStrategies",
  HiringStrategies = "hiringStrategies",
  BusinessTerminology = "businessTerminology",
}

export const ALL_KNOWLEDGE_DOMAINS: readonly KnowledgeDomain[] = Object.values(KnowledgeDomain);
