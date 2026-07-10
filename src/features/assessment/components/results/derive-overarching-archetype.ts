import type { DnaArchetypeKey, OverarchingArchetypeKey } from "./config";

/** One of the 7 `DnaArchetypeKey` dimension scores this function will read as its input. */
export interface DnaArchetypeDimensionScore {
  key: DnaArchetypeKey;
  score: number;
}

/**
 * This function's own interpretive judgment call, not a spec: each of the
 * 7 `DnaArchetypeKey`s assigned to the one `OverarchingArchetypeKey` its
 * translated copy (messages/*.json) reads closest to. Two
 * `OverarchingArchetypeKey`s end up with two source keys each (7 doesn't
 * divide evenly into 5) — that's an accepted consequence of "highest
 * score wins" among 7 inputs mapping onto 5 outputs, not an error.
 * Documented explicitly here so the mapping is auditable/revisable rather
 * than buried in a switch statement.
 */
const DNA_ARCHETYPE_TO_OVERARCHING: Record<DnaArchetypeKey, OverarchingArchetypeKey> = {
  builder: "executionSpecialist", // "shipping tangible things and iterating" -> execution-oriented
  visionary: "visionaryOperator",
  operator: "systemsBuilder", // "turns messy processes into repeatable systems" -> systems
  creator: "creativeStrategist",
  seller: "growthArchitect", // "energized by pitching/negotiating/closing" -> growth mechanisms
  leader: "visionaryOperator", // "rallies people around a shared goal" -> pairs with visionary's long view
  analyst: "systemsBuilder", // "grounds decisions in data" -> systems/process-oriented
};

/**
 * Phase 3 v1 implementation: the highest-scoring of the 7 `DnaArchetypeKey`
 * dimensions maps to its assigned `OverarchingArchetypeKey` via the table
 * above — the simple strategy this task specified as a defensible v1
 * default. Ties broken by first occurrence in `dimensionScores`.
 *
 * NOT wired into the live results page (`ResultsPlaceholder`) — its input
 * (real 7-key `DnaArchetypeKey` scores from a user's assessment) doesn't
 * exist anywhere in this codebase. Phase 2 computes scores for the 14
 * `MatchingDimension`s, a different vocabulary with no specified mapping
 * onto these 7 keys; inventing one would mean deciding, unilaterally, what
 * personality label every future user sees — a real product decision
 * flagged for review rather than guessed. This function is implemented
 * and correct on its own documented terms (7 scores in, 1 archetype out)
 * so it's ready the moment a real 7-key input exists.
 */
export function deriveOverarchingArchetype(
  dimensionScores: DnaArchetypeDimensionScore[]
): OverarchingArchetypeKey {
  if (dimensionScores.length === 0) {
    throw new Error("deriveOverarchingArchetype: cannot derive an archetype from zero dimension scores.");
  }

  const highest = dimensionScores.reduce((best, current) => (current.score > best.score ? current : best));
  return DNA_ARCHETYPE_TO_OVERARCHING[highest.key];
}
