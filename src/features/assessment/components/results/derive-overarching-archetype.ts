import { NotImplementedError } from "./errors";
import type { DnaArchetypeKey, OverarchingArchetypeKey } from "./config";

/** One of the 7 `DnaArchetypeKey` dimension scores this function will read as its input — same shape as `MockDnaResults.dnaProfile` in ./mock-data.ts. */
export interface DnaArchetypeDimensionScore {
  key: DnaArchetypeKey;
  score: number;
}

/**
 * The future classification function behind `OverarchingArchetypeKey`
 * (see ./config.ts's `@derived` docstring) — NOT implemented this
 * sprint. This is architecture-reconciliation work only: it records
 * that the 5-key Primary/Overarching Archetype is a derived
 * classification, not an independently-authored value, and gives that
 * derivation a real, typed home to be filled in later. Placed here
 * (results/'s own scope) rather than a shared location, since nothing
 * outside the results page currently consumes `OverarchingArchetypeKey`
 * — flagged as a placement judgment call, not a settled architectural
 * decision; move it if a second consumer appears.
 *
 * Deliberately NOT implemented: computing a real classification from
 * dimension scores is matching/scoring logic, out of scope for this
 * sprint (see epic's "DO NOT" section).
 */
export function deriveOverarchingArchetype(
  dimensionScores: DnaArchetypeDimensionScore[]
): OverarchingArchetypeKey {
  throw new NotImplementedError(
    "deriveOverarchingArchetype",
    `No 7-dimension → Primary Archetype classification logic exists yet (received ${dimensionScores.length} dimension scores) — this sprint only records the derivation relationship.`
  );
}
