import type {
  BusinessModelType,
  BusinessDnaKpiKey,
  CustomerTypeKey,
  FinancialDna,
  FounderFit,
  IndustryType,
  MarketingDna,
  PricingModelKey,
  RevenueModelKey,
  RiskDna,
  BusinessDnaResourcesSection,
  SalesMethodKey,
  SuccessDna,
} from "./reused";

/**
 * The 21 Blueprint sections. See README.md's reuse table for the full
 * per-section reasoning. Every narrative field is a `translationKey`
 * (points into messages/*.json) — no inline prose, per this sprint's
 * convention.
 */

/** 1. Executive Summary — a lightweight snapshot, deliberately not importing FinancialDna's full budget shape (see Section 14, Financial Overview, for that). */
export interface BudgetRange {
  min: number;
  max: number;
  currency: string;
}

export interface ExecutiveSummary {
  businessSnapshotTranslationKey: string;
  whoThisIsForTranslationKey: string;
  whoShouldAvoidItTranslationKey: string;
  estimatedLaunchTimeMonths?: number;
  estimatedStartupBudget?: BudgetRange;
  businessModel?: BusinessModelType;
  revenueType?: RevenueModelKey;
  difficulty?: "low" | "moderate" | "high";
}

/** 2. Business Overview — genuinely new; a narrative introduction distinct from business-dna's Identity (a data record, not a document section). */
export interface BusinessOverview {
  descriptionTranslationKey: string;
  industry?: IndustryType;
  categoryKey?: string;
  foundingStoryTranslationKey?: string;
}

/** 3. Founder Fit — full reuse, see README.md. */
export type BlueprintFounderFit = FounderFit;

/** 4. Market — genuinely new. */
export interface Market {
  marketSizeTranslationKey?: string;
  marketTrendsTranslationKeys: string[];
  competitiveLandscapeTranslationKey?: string;
}

/** 5. Ideal Customer — genuinely new; cross-references knowledge-engine's CustomerTypeKey. */
export interface IdealCustomer {
  personaTranslationKey?: string;
  customerType?: CustomerTypeKey;
  painPointsTranslationKeys: string[];
}

/** 6. Offer — genuinely new. */
export interface Offer {
  offerDescriptionTranslationKey?: string;
  coreFeatureTranslationKeys: string[];
}

/** 7. Pricing — genuinely new; cross-references knowledge-engine's PricingModelKey. */
export interface Pricing {
  pricingModel?: PricingModelKey;
  pricingSummaryTranslationKey?: string;
}

/** 8. Revenue — genuinely new; cross-references knowledge-engine's RevenueModelKey (distinct from Financial Overview's structured revenue streams — see Section 14). */
export interface Revenue {
  revenueModel?: RevenueModelKey;
  revenueStreamTranslationKeys: string[];
}

/** 9. Marketing — full reuse, see README.md. */
export type BlueprintMarketing = MarketingDna;

/** 10. Sales — genuinely new (NOT one of the epic's 7 named cross-references); cross-references knowledge-engine's SalesMethodKey. */
export interface Sales {
  salesApproachTranslationKey?: string;
  salesMethods: SalesMethodKey[];
}

/** 11. Operations — genuinely new. */
export interface Operations {
  coreProcessTranslationKeys: string[];
  automationLevel?: "low" | "moderate" | "high";
}

/** 12. Technology — genuinely new; `toolKeys`/`aiToolKeys` are loose string references into business-library/taxonomy/{tools,ai-tools}.json, not a closed enum (those domains are open catalogs — see knowledge-engine's README). */
export interface Technology {
  techStackTranslationKeys: string[];
  toolKeys: string[];
  aiToolKeys: string[];
}

/** 13. Team — genuinely new. */
export interface Team {
  roleTranslationKeys: string[];
  teamSize?: "solo" | "small" | "large";
}

/** 14. Financial Overview — full reuse, see README.md. */
export type FinancialOverview = FinancialDna;

/** 15. KPIs — cross-references business-dna's fixed KPI enum rather than redeclaring it. */
export interface BlueprintKpis {
  kpis: BusinessDnaKpiKey[];
}

/** 16. Launch Checklist — genuinely new. */
export interface LaunchChecklist {
  itemTranslationKeys: string[];
}

/**
 * 17. Growth Roadmap — genuinely new, and deliberately NOT the same
 * thing as `features/roadmap` (this epic's dedicated Roadmap system,
 * with its own 9-stage model). This is a lightweight in-document summary
 * list; features/roadmap is the full stage-by-stage authoring system.
 */
export interface GrowthRoadmap {
  milestoneTranslationKeys: string[];
}

/** 18. Risks — full reuse, see README.md. */
export type Risks = RiskDna;

/** 19. Success Factors — full reuse, see README.md. */
export type SuccessFactors = SuccessDna;

/**
 * 20. Resources — full reuse of business-dna's (narrower) Resources
 * section, per this epic's explicit cross-reference list. NOTE:
 * `features/resources` (this same epic) defines a broader, 16-category
 * vocabulary intended as the new canonical superset for "resources"
 * generally — see that feature's README. This section still points at
 * business-dna's narrower type today, since that's what the epic's
 * cross-reference table specifies for Blueprint specifically; switching
 * it to `features/resources`' vocabulary is a documented future option,
 * not done here.
 */
export type BlueprintResources = BusinessDnaResourcesSection;

/**
 * 21. AI Metadata — internal-only. NOT a straight reuse of business-dna's
 * `AiMetadata`, despite the epic's cross-reference table listing
 * "AI Metadata→AI Metadata": business-dna's shape is
 * `{ matchingHints, blueprintHints, marketingHints, financialHints, generationHints }`,
 * but this epic explicitly specifies Blueprint's own AI Metadata as
 * `{ generationHints, explanationHints, financialHints, marketingHints, matchingHints }`
 * — note `explanationHints` where business-dna has `blueprintHints`
 * (which would be redundant here — this section *is* the blueprint).
 * Same pattern (a bundle of translationKey hints), different field set —
 * flagged as a conflict per README.md, not silently reconciled.
 */
export interface BlueprintAiMetadata {
  generationHintsTranslationKey?: string;
  explanationHintsTranslationKey?: string;
  financialHintsTranslationKey?: string;
  marketingHintsTranslationKey?: string;
  matchingHintsTranslationKey?: string;
}
