import type { BusinessDnaKpiKey } from "./reused";

/**
 * The Roadmap's own 9-stage model. GENUINELY NEW — and deliberately NOT
 * the same list as business-dna's 8-stage `BusinessLifecycleStage`
 * (idea/validation/mvp/firstClients/stableRevenue/scaling/expansion/exit).
 * See README.md's side-by-side comparison table for the full mapping and
 * the explicit "not merged" decision; `Exit` is optional here, matching
 * the epic's "Exit(optional)" note.
 */
export enum RoadmapStageKey {
  Preparation = "preparation",
  Validation = "validation",
  MVP = "mvp",
  FirstClient = "firstClient",
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
  RoadmapStageKey.FirstClient,
  RoadmapStageKey.ProductMarketFit,
  RoadmapStageKey.Growth,
  RoadmapStageKey.Scaling,
  RoadmapStageKey.Expansion,
  RoadmapStageKey.Exit,
];

/** Every stage in the 9-stage model carries this same shape. */
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
