/**
 * Section 7 — Entrepreneur DNA Match. GENUINELY NEW as a section, but
 * its 7-key vocabulary is NOT new — it deliberately mirrors
 * `DnaArchetypeKey` in
 * `src/features/assessment/components/results/config.ts` exactly
 * (builder/visionary/operator/creator/seller/leader/analyst), per this
 * sprint's instruction to reuse that exact key set rather than invent
 * an 8th archetype variant.
 *
 * This is a MIRROR, not a cross-feature import: `DnaArchetypeKey` lives
 * in assessment's `components/` layer (a UI-facing config file), and
 * importing a domain type from another feature's components/ directory
 * would be an odd dependency direction for this feature's `types/`.
 * `tests/entrepreneur-dna-match.test.ts` imports the real
 * `DNA_ARCHETYPE_KEYS` from that file and asserts it stays byte-for-byte
 * in sync with `ENTREPRENEUR_DNA_MATCH_KEYS` below — so drift between
 * the mirror and the source fails `npm test`, not just this comment.
 *
 * This is DIFFERENT from business-library's 6-key `founderArchetypeSchema`
 * (Section 2, Founder Fit, superseded/legacy — see that section's own
 * note) and the results page's 5-key "Primary/Overarching Archetype"
 * (`OverarchingArchetypeKey`, also in that same config.ts) — three
 * separate archetype vocabularies exist in this codebase. As of the
 * Architecture Reconciliation sprint, the 5-key one is documented as
 * DERIVED from this 7-key vocabulary (not merged with it — see
 * `deriveOverarchingArchetype()` in
 * `assessment/components/results/derive-overarching-archetype.ts`, not
 * implemented yet). See README.md → "Existing archetype vocabularies"
 * for the full, current picture.
 */
export const ENTREPRENEUR_DNA_MATCH_KEYS = [
  "builder",
  "visionary",
  "operator",
  "creator",
  "seller",
  "leader",
  "analyst",
] as const;

export type EntrepreneurDnaMatchKey = (typeof ENTREPRENEUR_DNA_MATCH_KEYS)[number];

export interface EntrepreneurDnaMatchScore {
  key: EntrepreneurDnaMatchKey;
  /**
   * 1-100, per this sprint's literal spec wording. Note the results
   * page's existing DNA Profile cards (`dna-profile-cards.tsx`) use a
   * 0-100 scale for the same seven keys — functionally almost the same
   * range, but a different stated minimum; not silently reconciled here
   * (see README.md's mapping table).
   */
  score: number;
}

export interface EntrepreneurDnaMatch {
  scores: EntrepreneurDnaMatchScore[];
}
