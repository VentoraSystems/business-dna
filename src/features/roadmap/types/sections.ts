import type { BusinessDnaKpiKey } from "./reused";

/**
 * The Roadmap's own v2 stage model — 10 stages, officially superseding
 * v1's 9-stage list (see README.md's "Specification History" section).
 * Changes from v1: "Launch" inserted between MVP and First Customer;
 * "First Client" renamed to "First Customer"; "Exit" is no longer
 * documented as optional — it's a standard stage now, same as every
 * other.
 *
 * RECONCILED (Architecture Reconciliation sprint): `features/business-dna`'s
 * Business Lifecycle section no longer declares its own separate stage
 * list — it now re-exports this enum under its original local names
 * (`BusinessLifecycleStage`/`BUSINESS_LIFECYCLE_STAGE_ORDER`, see
 * `@/features/business-dna/types/sections/business-lifecycle.ts`)
 * instead of redeclaring one. See README.md's "RESOLVED" section for
 * the full reasoning, including why business-dna's old "Idea" stage has
 * no equivalent here (a documented, deliberate loss, not a rename).
 */
export enum RoadmapStageKey {
  Preparation = "preparation",
  Validation = "validation",
  MVP = "mvp",
  Launch = "launch",
  FirstCustomer = "firstCustomer",
  ProductMarketFit = "productMarketFit",
  Growth = "growth",
  Scaling = "scaling",
  Expansion = "expansion",
  Exit = "exit",
}

export const ROADMAP_STAGE_ORDER: readonly RoadmapStageKey[] = [
  RoadmapStageKey.Preparation,
  RoadmapStageKey.Validation,
  RoadmapStageKey.MVP,
  RoadmapStageKey.Launch,
  RoadmapStageKey.FirstCustomer,
  RoadmapStageKey.ProductMarketFit,
  RoadmapStageKey.Growth,
  RoadmapStageKey.Scaling,
  RoadmapStageKey.Expansion,
  RoadmapStageKey.Exit,
];

/** Every stage in the 10-stage model carries this same shape — unchanged from v1: only the stage list itself changed, not the per-stage structure. */
export interface RoadmapStage {
  stage: RoadmapStageKey;
  objectiveTranslationKeys: string[];
  deliverableTranslationKeys: string[];
  checklistTranslationKeys: string[];
  /** References business-dna's fixed KPI vocabulary — see types/reused.ts. */
  kpis: BusinessDnaKpiKey[];
  commonMistakeTranslationKeys: string[];
  successCriteriaTranslationKeys: string[];
  aiRecommendationTranslationKeys: string[];
}

/**
 * AI Metadata — independently defined, same pattern as
 * `features/blueprint`'s `BlueprintAiMetadata`, `features/financial`'s
 * `FinancialAiMetadata`, and `features/marketing`'s
 * `MarketingAiMetadata` (a bundle of translationKey hints), different
 * field set by design intent.
 */
export interface RoadmapAiMetadata {
  generationHintsTranslationKey?: string;
  explanationHintsTranslationKey?: string;
  matchingHintsTranslationKey?: string;
}
