import type {
  BusinessGenomeAIResistance,
  BusinessGenomeDifficulty,
  BusinessGenomeRisks,
  BusinessGenomeScalability,
} from "../reused-from-business-library";

/**
 * Section 9 — Scalability DNA. Full reuse of business-library's
 * `scalability` (§13) — the top-line "can this grow without
 * proportionally scaling effort" rating. `growthPotential` (§23) and
 * `scaling` (§29) — the ceiling and the growth *path* — belong to
 * Section 17, Growth DNA (see growth-and-success.ts), not here, since
 * this epic's 21-section list names "Scalability DNA" and "Growth DNA"
 * as two separate sections.
 */
export interface ScalabilityDna {
  scalability: BusinessGenomeScalability;
}

/**
 * Section 10 — Risk DNA. Full reuse of business-library's `difficulty`
 * (§9), `aiResistance` (§15), and `risks[]` (§30) — the top-line ratings
 * plus the itemized risk list. Compared against Entrepreneur DNA's
 * `risk` dimension at match time (see docs/domain/02-entrepreneur-dna-specification.md).
 */
export interface RiskDna {
  difficulty: BusinessGenomeDifficulty;
  aiResistance: BusinessGenomeAIResistance;
  risks: BusinessGenomeRisks;
}
