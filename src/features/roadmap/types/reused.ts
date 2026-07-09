/**
 * Every type this feature reuses from elsewhere rather than redeclares.
 * See README.md's reuse table.
 *
 * NOTE: this feature deliberately does NOT reuse business-dna's
 * `BusinessLifecycleStage` / `BUSINESS_LIFECYCLE_STAGE_ORDER`
 * (`@/features/business-dna/types/sections/business-lifecycle`) for its
 * own stage list — see README.md's "Known conflict" section for why the
 * two stage models are intentionally kept distinct rather than merged.
 * `BusinessDnaKpiKey` itself is still reused, since it's this contract's
 * one fixed, closed KPI vocabulary regardless of which stage model is in
 * play.
 */
export { BusinessDnaKpiKey } from "@/features/business-dna/types/sections/kpis";
