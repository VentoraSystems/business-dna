import type { LocalizedText } from "../reused-from-business-library";
import { BusinessDnaKpiKey } from "./kpis";
import { ROADMAP_STAGE_ORDER, RoadmapStageKey } from "@/features/roadmap/types/sections";

/**
 * Section 21 — Business Lifecycle.
 *
 * RECONCILED as of the Architecture Reconciliation sprint: this section
 * previously declared its own local 8-stage enum
 * (Idea/Validation/MVP/FirstClients/StableRevenue/Scaling/Expansion/Exit).
 * It now re-exports `features/roadmap`'s canonical v2 10-stage vocabulary
 * (`RoadmapStageKey`/`ROADMAP_STAGE_ORDER`) under this section's original
 * local names, rather than redeclaring the list — see
 * `features/roadmap/types/sections.ts` for the source of truth and
 * `features/roadmap/README.md` for that feature's own stage documentation.
 * Business DNA Profile's Business Lifecycle and `features/roadmap`'s
 * Roadmap now use one shared stage list, not two independently-maintained
 * ones.
 *
 * **"Idea" is a genuine loss, not a rename.** The old 8-stage list's
 * first stage, "Idea," had no equivalent in Roadmap's list even before
 * this reconciliation (Roadmap's first stage was always "Preparation" —
 * see that feature's README). "Preparation" is NOT treated as an
 * equivalent rename of "Idea": Roadmap's "Preparation" describes active
 * pre-launch preparation work *after* a business concept already exists,
 * whereas "Idea" described the ideation stage itself, before any concept
 * is settled. Adopting the shared 10-stage vocabulary means a Business
 * DNA Profile's Business Lifecycle can no longer represent the pure
 * ideation stage as its own distinct entry — a deliberate, documented
 * trade of a small amount of granularity for one unified vocabulary
 * across the two features, not something silently dropped.
 *
 * **Cross-feature import direction, flagged:** every other Business
 * Assets feature (`features/blueprint`, `features/financial`,
 * `features/marketing`, `features/roadmap`, `features/resources`)
 * imports FROM `features/business-dna` — business-dna is the upstream,
 * canonical contract. This file reverses that direction for one field
 * (`features/business-dna` → `features/roadmap`). Since
 * `features/roadmap` already imports `BusinessDnaKpiKey` FROM
 * `features/business-dna` (see `features/roadmap/types/reused.ts`), the
 * two features now import from each other — a real, if narrow, circular
 * module reference (each side only pulls in the other's small, static
 * enum, with no initialization-order dependency between them). This was
 * verified safe via `npm run typecheck` and `npm run build`
 * (Next.js/webpack resolves it without error), but it is a deliberate
 * exception to this codebase's usual layering, made because this sprint's
 * decision explicitly required importing the stage type rather than
 * redeclaring it — flagged here rather than silently introduced.
 *
 * `kpis` below still cross-references Section 19's `BusinessDnaKpiKey`
 * (this file's own fixed KPI vocabulary) rather than duplicating it —
 * `recommendedResources` similarly stores `translationKey` references
 * (loosely, not a strict foreign key) into Section 18's
 * `ResourcesSection.resources`.
 */
export { RoadmapStageKey as BusinessLifecycleStage, ROADMAP_STAGE_ORDER as BUSINESS_LIFECYCLE_STAGE_ORDER };

/**
 * Known authoring pitfall: `features/roadmap`'s stage objects (see
 * `features/roadmap/types/sections.ts`) share the same 10-stage
 * vocabulary and *look* like this shape, but additionally carry a
 * `successCriteriaTranslationKeys` field that has no equivalent here.
 * This interface deliberately has NO `successCriteria` field — do not
 * add one by pattern-matching from a `roadmap.json` you're authoring
 * alongside this section.
 */
export interface BusinessLifecycleStageProfile {
  stage: RoadmapStageKey;
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
