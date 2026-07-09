import { describe, it, expect } from "vitest";
import { ENTREPRENEUR_DNA_MATCH_KEYS } from "../types/sections/entrepreneur-dna-match";
import { DNA_ARCHETYPE_KEYS } from "@/features/assessment/components/results/config";

/**
 * `ENTREPRENEUR_DNA_MATCH_KEYS` is a deliberate MIRROR (not a
 * cross-feature import — see entrepreneur-dna-match.ts's docstring for
 * why) of `DnaArchetypeKey` in
 * src/features/assessment/components/results/config.ts. This test is
 * the automated guard against drift: if a future edit changes the
 * results page's 7-key vocabulary without updating this mirror, this
 * test — not just a comment — fails.
 */
describe("ENTREPRENEUR_DNA_MATCH_KEYS mirrors the results page's DnaArchetypeKey", () => {
  it("has the exact same keys, in the same order, as DNA_ARCHETYPE_KEYS", () => {
    expect(ENTREPRENEUR_DNA_MATCH_KEYS).toEqual(DNA_ARCHETYPE_KEYS);
  });
});
