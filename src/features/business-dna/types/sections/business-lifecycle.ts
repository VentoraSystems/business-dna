import type { LocalizedText } from "../reused-from-business-library";
import { BusinessDnaKpiKey } from "./kpis";

/**
 * Section 21 — Business Lifecycle. GENUINELY NEW — no business-library
 * equivalent (its closest relative, `ninetyDayPlan` §35, is a fixed
 * 90-day/13-week plan for one business; this section is an 8-stage
 * lifecycle model shared across all businesses on this contract).
 *
 * `kpis` below cross-references Section 19's `BusinessDnaKpiKey` (this
 * file's own fixed KPI vocabulary) rather than duplicating it —
 * `recommendedResources` similarly stores `translationKey` references
 * (loosely, not a strict foreign key) into Section 18's
 * `ResourcesSection.resources`.
 */
export enum BusinessLifecycleStage {
  Idea = "idea",
  Validation = "validation",
  MVP = "mvp",
  FirstClients = "firstClients",
  StableRevenue = "stableRevenue",
  Scaling = "scaling",
  Expansion = "expansion",
  Exit = "exit",
}

export const BUSINESS_LIFECYCLE_STAGE_ORDER: readonly BusinessLifecycleStage[] = [
  BusinessLifecycleStage.Idea,
  BusinessLifecycleStage.Validation,
  BusinessLifecycleStage.MVP,
  BusinessLifecycleStage.FirstClients,
  BusinessLifecycleStage.StableRevenue,
  BusinessLifecycleStage.Scaling,
  BusinessLifecycleStage.Expansion,
  BusinessLifecycleStage.Exit,
];

export interface BusinessLifecycleStageProfile {
  stage: BusinessLifecycleStage;
  objectives: LocalizedText[];
  /** References Section 19's fixed KPI vocabulary — see ./kpis.ts. */
  kpis: BusinessDnaKpiKey[];
  commonMistakes: LocalizedText[];
  recommendedActions: LocalizedText[];
  /** `translationKey` references into Section 18's `ResourcesSection.resources` — see ./resources.ts. */
  recommendedResources: string[];
}

export interface BusinessLifecycle {
  stages: BusinessLifecycleStageProfile[];
}
