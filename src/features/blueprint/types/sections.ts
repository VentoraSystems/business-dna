import type {
  BusinessModelType,
  BusinessDnaKpiKey,
  CustomerTypeKey,
  FinancialDna,
  FounderFit,
  IndustryType,
  MarketingDna,
  PricingModelKey,
  ResourceItem,
  RevenueModelKey,
  RiskDna,
  SalesMethodKey,
  SuccessDna,
} from "./reused";

/**
 * The 25 canonical Blueprint v2 sections (officially superseding v1's
 * 21-section list — see README.md's "Specification History"), plus one
 * internal-only `BlueprintAiMetadata` field that is NOT one of the 25
 * (same convention v1 used: a hints bundle, never rendered as a
 * document heading — see this file's bottom section and
 * `templates/empty-blueprint.md`). See README.md's reuse table for the
 * full per-section reasoning and the v1→v2 mapping. Every narrative
 * field is a `translationKey` (points into messages/*.json) — no inline
 * prose, per this sprint's convention.
 */

/** 1. Executive Summary — unchanged shape from v1, renumbered only. */
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

/** 2. Entrepreneur Fit — renamed from v1's "Founder Fit" (was `BlueprintFounderFit`); still full reuse, see README.md. */
export type EntrepreneurFit = FounderFit;

/** 3. Business Overview — unchanged shape from v1, renumbered only. */
export interface BusinessOverview {
  descriptionTranslationKey: string;
  industry?: IndustryType;
  categoryKey?: string;
  foundingStoryTranslationKey?: string;
}

/** 4. Market Intelligence — renamed from v1's "Market"; same shape. */
export interface MarketIntelligence {
  marketSizeTranslationKey?: string;
  marketTrendsTranslationKeys: string[];
  competitiveLandscapeTranslationKey?: string;
}

/** 5. Customer Intelligence — renamed from v1's "Ideal Customer"; same shape, still cross-references knowledge-engine's CustomerTypeKey. */
export interface CustomerIntelligence {
  personaTranslationKey?: string;
  customerType?: CustomerTypeKey;
  painPointsTranslationKeys: string[];
}

/** 6. Offer Architecture — renamed from v1's "Offer"; same shape. */
export interface OfferArchitecture {
  offerDescriptionTranslationKey?: string;
  coreFeatureTranslationKeys: string[];
}

/** 7. Revenue Architecture — renamed from v1's "Revenue"; same shape, still cross-references knowledge-engine's RevenueModelKey. Reordered ahead of Pricing Strategy in v2 (v1 had Pricing before Revenue). */
export interface RevenueArchitecture {
  revenueModel?: RevenueModelKey;
  revenueStreamTranslationKeys: string[];
}

/** 8. Pricing Strategy — renamed from v1's "Pricing"; same shape, still cross-references knowledge-engine's PricingModelKey. */
export interface PricingStrategy {
  pricingModel?: PricingModelKey;
  pricingSummaryTranslationKey?: string;
}

/** 9. Marketing System — renamed from v1's "Marketing" (was `BlueprintMarketing`); still full reuse, see README.md. */
export type MarketingSystem = MarketingDna;

/** 10. Sales System — renamed from v1's "Sales"; same shape, still cross-references knowledge-engine's SalesMethodKey. Still NOT one of the epic's named business-dna cross-references, kept independently defined for the same reason as v1. */
export interface SalesSystem {
  salesApproachTranslationKey?: string;
  salesMethods: SalesMethodKey[];
}

/** 11. Operations System — renamed from v1's "Operations"; same shape. */
export interface OperationsSystem {
  coreProcessTranslationKeys: string[];
  automationLevel?: "low" | "moderate" | "high";
}

/** 12. Technology Stack — renamed from v1's "Technology"; same shape (open-catalog `toolKeys`/`aiToolKeys`, no closed enum — see README.md). */
export interface TechnologyStack {
  techStackTranslationKeys: string[];
  toolKeys: string[];
  aiToolKeys: string[];
}

/**
 * 13. Automation Opportunities — NEW in v2, no v1 equivalent.
 * `recommendedAiToolKeys` loosely references
 * `business-library/taxonomy/ai-tools.json` entries, same open-catalog
 * convention Technology Stack's `aiToolKeys` already uses.
 */
export interface AutomationOpportunities {
  opportunityTranslationKeys: string[];
  recommendedAiToolKeys: string[];
}

/** 14. Team Structure — renamed from v1's "Team"; same shape. */
export interface TeamStructure {
  roleTranslationKeys: string[];
  teamSize?: "solo" | "small" | "large";
}

/** 15. Financial Overview — unchanged, full reuse, see README.md. */
export type FinancialOverview = FinancialDna;

/** 16. KPIs — unchanged shape from v1, renumbered only. */
export interface BlueprintKpis {
  kpis: BusinessDnaKpiKey[];
}

/** 17. Risk Analysis — renamed from v1's "Risks" (was `Risks`); still full reuse, see README.md. */
export type RiskAnalysis = RiskDna;

/**
 * 18. Competitive Advantages — NEW section name in v2. Per this epic's
 * explicit instruction, v1's "Success Factors" (full reuse of
 * business-dna's `SuccessDna`) is folded entirely into this section
 * rather than also duplicating it into "AI Recommendations" (23) —
 * documented judgment call, see README.md.
 */
export type CompetitiveAdvantages = SuccessDna;

/**
 * 19. Launch Strategy — NEW in v2, no v1 equivalent (v1's "Launch
 * Checklist" is consolidated into "90-Day Action Plan" below, not here
 * — see that section's docstring). A strategic overview of *how* to
 * launch, distinct from the day-by-day plan in section 20.
 */
export interface LaunchStrategy {
  strategyTranslationKey?: string;
  keyMilestoneTranslationKeys: string[];
}

/**
 * 20. 90-Day Action Plan — NEW in v2, and explicitly **consolidates**
 * v1's "Launch Checklist" (`itemTranslationKeys`, folded into
 * `checklistTranslationKeys` below) and v1's "Growth Roadmap"
 * (`milestoneTranslationKeys`, folded in as-is) into one structured,
 * week-by-week plan — not kept as two separate sections alongside this
 * new one. Deliberately NOT the same thing as `features/roadmap` (that
 * feature's dedicated, full stage-by-stage authoring system) — this is
 * a lightweight in-document 90-day (≈13-week) summary only.
 */
export interface NinetyDayActionPlanWeek {
  weekNumber: number;
  focusTranslationKey?: string;
  actionItemTranslationKeys: string[];
}
export interface NinetyDayActionPlan {
  weeks: NinetyDayActionPlanWeek[];
  /** Consolidated from v1's "Launch Checklist" section. */
  checklistTranslationKeys: string[];
  /** Consolidated from v1's "Growth Roadmap" section. */
  milestoneTranslationKeys: string[];
}

/** 21. Scaling Strategy — NEW in v2, no v1 equivalent. */
export interface ScalingStrategy {
  strategyTranslationKey?: string;
  scalingLeverTranslationKeys: string[];
}

/** 22. Exit Opportunities — NEW in v2, no v1 equivalent. Structural placeholder only — no valuation figures or calculations, same discipline as features/financial's Break-even/Gross Margin/Net Margin sections. */
export interface ExitOpportunities {
  exitOptionTranslationKeys: string[];
}

/**
 * 23. AI Recommendations — NEW in v2, no v1 equivalent. A visible,
 * narrative section (rendered as a heading in the .md template) — NOT
 * the same thing as the internal-only `aiMetadata` hints bundle at the
 * bottom of this file (v1's "AI Metadata", which persists unchanged
 * and is still never rendered as a heading). See README.md.
 */
export interface AiRecommendations {
  recommendationTranslationKeys: string[];
}

/**
 * 24. Resources — v2 CHANGE: now references `features/resources`'
 * `ResourceItem` (the new 16-category canonical superset built last
 * sprint) instead of v1's alias to business-dna's narrower (7-category)
 * `ResourcesSection`. See README.md's "Specification History" for why
 * this is a correction, not a silent drift: this epic's text asserts
 * Blueprint "did" this in v1, but v1 actually aliased business-dna's
 * type — flagged, not silently glossed over.
 */
export interface BlueprintResources {
  resources: ResourceItem[];
}

/** 25. Appendix — NEW in v2, no v1 equivalent. */
export interface Appendix {
  noteTranslationKeys: string[];
}

/**
 * AI Metadata — internal-only, NOT one of the 25 named sections above
 * (unchanged from v1: still never rendered as a heading in the .md
 * template). Independently defined, same reasoning as v1's
 * `BlueprintAiMetadata` — a bundle of translationKey hints, not a
 * straight reuse of business-dna's differently-shaped `AiMetadata`.
 */
export interface BlueprintAiMetadata {
  generationHintsTranslationKey?: string;
  explanationHintsTranslationKey?: string;
  financialHintsTranslationKey?: string;
  marketingHintsTranslationKey?: string;
  matchingHintsTranslationKey?: string;
}
