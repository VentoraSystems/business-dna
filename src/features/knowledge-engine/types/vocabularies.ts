/**
 * Domain-specific controlled vocabularies owned by this feature — i.e.
 * the domains that do NOT already have a canonical type elsewhere (see
 * ./reused-vocabularies.ts for the three that do).
 *
 * Each list below is a closed, well-established business taxonomy — the
 * same kind of thing IndustryType/BusinessModelType already are (compare
 * businessModelTypeSchema's "saas"/"ecommerce"/"marketplace" in
 * business-engine/schemas/enums.ts). These are vocabulary/architecture,
 * not knowledge CONTENT: no description, guidance, or prose lives here —
 * that belongs to a future KnowledgeEntry row's `translationKey`, once
 * entries exist (this sprint seeds none).
 *
 * Domains that are open-ended catalogs of specific named things —
 * Business Tools, AI Tools, Business Risks, KPIs, Growth Strategies,
 * Hiring Strategies, Business Terminology — deliberately do NOT get a
 * closed vocabulary here. Unlike "there are N well-known revenue models,"
 * there is no small, finite, non-arbitrary list of "the businesstools" or
 * "the business terms" — enumerating specific ones would mean naming real
 * products/terms, which is knowledge content, not architecture. Their
 * entries are identified by `KnowledgeEntry.key` alone (a free-form slug),
 * same as every other domain. See README.md → "Domains without a closed
 * vocabulary" for the full reasoning.
 *
 * Each list is declared `as const` (not a plain `enum`) so the same array
 * can back both the TS union type (via indexed access) and the Zod
 * schema in ../schemas/knowledge-entry.schema.ts (`z.enum(...)` needs a
 * literal tuple) without repeating the values twice.
 */

export const REVENUE_MODEL_KEYS = [
  "subscription",
  "oneTime",
  "usageBased",
  "freemium",
  "transactionFee",
  "licensing",
  "advertising",
  "affiliate",
] as const;
export type RevenueModelKey = (typeof REVENUE_MODEL_KEYS)[number];

export const CUSTOMER_TYPE_KEYS = ["b2b", "b2c", "b2b2c", "d2c", "government", "nonprofit"] as const;
export type CustomerTypeKey = (typeof CUSTOMER_TYPE_KEYS)[number];

export const PRICING_MODEL_KEYS = [
  "flatRate",
  "tiered",
  "usageBased",
  "freemium",
  "valueBased",
  "perSeat",
  "dynamic",
] as const;
export type PricingModelKey = (typeof PRICING_MODEL_KEYS)[number];

export const MARKETING_CHANNEL_KEYS = [
  "seo",
  "paidSearch",
  "socialMedia",
  "emailMarketing",
  "contentMarketing",
  "influencerMarketing",
  "eventsAndSponsorship",
  "referralProgram",
] as const;
export type MarketingChannelKey = (typeof MARKETING_CHANNEL_KEYS)[number];

/**
 * Deliberately named "SalesMethodKey" — NOT "SalesChannel" or
 * "SalesChannelKey" — to avoid any collision with business-engine's
 * existing `SalesChannel` (b2b/b2c/both; see
 * src/features/business-engine/schemas/enums.ts → salesChannelSchema).
 * That enum describes WHO a business sells to; this one describes HOW a
 * sale happens (the go-to-market method) — a different concept entirely,
 * despite the epic calling this domain "Sales Channels".
 */
export const SALES_METHOD_KEYS = [
  "directSales",
  "channelPartner",
  "insideSales",
  "fieldSales",
  "selfService",
  "reseller",
] as const;
export type SalesMethodKey = (typeof SALES_METHOD_KEYS)[number];

export const DISTRIBUTION_CHANNEL_KEYS = [
  "directToConsumer",
  "retail",
  "wholesale",
  "onlineMarketplace",
  "distributor",
  "franchise",
] as const;
export type DistributionChannelKey = (typeof DISTRIBUTION_CHANNEL_KEYS)[number];

export const LEGAL_STRUCTURE_KEYS = [
  "soleProprietorship",
  "partnership",
  "llc",
  "corporation",
  "nonprofit",
  "cooperative",
] as const;
export type LegalStructureKey = (typeof LEGAL_STRUCTURE_KEYS)[number];

export const FUNDING_OPTION_KEYS = [
  "bootstrapped",
  "friendsAndFamily",
  "angelInvestment",
  "ventureCapital",
  "bankLoan",
  "grant",
  "crowdfunding",
  "revenueBasedFinancing",
] as const;
export type FundingOptionKey = (typeof FUNDING_OPTION_KEYS)[number];
