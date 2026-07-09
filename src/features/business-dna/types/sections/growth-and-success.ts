import type {
  BusinessGenomeAdvantages,
  BusinessGenomeGrowthPotential,
  BusinessGenomeScaling,
  LocalizedText,
} from "../reused-from-business-library";

/**
 * Section 15 — Growth DNA. Full reuse of business-library's
 * `growthPotential` (§23, the ceiling and time horizon) and `scaling`
 * (§29, the path/bottlenecks/milestones) — see Scalability DNA
 * (scalability-and-risk.ts) for why the top-line `scalability` rating
 * lives in that section instead of this one.
 */
export interface GrowthDna {
  growthPotential: BusinessGenomeGrowthPotential;
  scaling: BusinessGenomeScaling;
}

/**
 * Section 16 — Success DNA. Reuses business-library's `advantages` (§31)
 * directly. `benchmarkNotes` is genuinely new — a place for narrative
 * context this profile doesn't otherwise have a home for; it is
 * deliberately NOT a computed "success probability" or similar (no
 * calculations exist in this sprint, and none should be implied by this
 * field).
 */
export interface SuccessDna {
  advantages: BusinessGenomeAdvantages;
  /** GENUINELY NEW. Optional narrative context — not a computed score. */
  benchmarkNotes?: LocalizedText;
}
