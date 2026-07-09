import { describe, it, expect } from "vitest";
import {
  founderArchetypeSchema,
  skillKeySchema,
  businessGenomeMatchingMetadataSchema,
  type BusinessGenomeFounderProfile,
  type FounderArchetype,
  type SkillKey,
} from "../types/reused-from-business-library";
import type { FounderFit } from "../types/sections/identity-and-founder-fit";
import { founderFitSchema } from "../schemas/sections.schema";

/**
 * Compile-time assertions, not fabricated data: these only typecheck
 * because `FounderFit` is a genuine alias of business-library's own
 * `BusinessGenomeFounderProfile` (see
 * types/sections/identity-and-founder-fit.ts), and `founderArchetypeSchema`/
 * `skillKeySchema` are re-exported, not redeclared, in
 * types/reused-from-business-library.ts. If a future edit accidentally
 * redeclared either with a different shape, this file would fail
 * `npm run typecheck`.
 */
describe("business-library reuse type-checks correctly", () => {
  it("FounderFit is assignable to/from BusinessGenomeFounderProfile (full reuse, not a redeclaration)", () => {
    const archetype: FounderArchetype = "theBuilder";
    const founderFit: FounderFit = {
      idealArchetypes: [archetype],
      summary: { en: "test", ro: "test" },
    };
    const asGenomeFounderProfile: BusinessGenomeFounderProfile = founderFit;
    const backToFounderFit: FounderFit = asGenomeFounderProfile;

    expect(founderFitSchema.safeParse(founderFit).success).toBe(true);
    expect(backToFounderFit).toEqual(founderFit);
  });

  it("re-exported founderArchetypeSchema is the real business-library schema (accepts and rejects the same values)", () => {
    expect(founderArchetypeSchema.safeParse("theHustler").success).toBe(true);
    expect(founderArchetypeSchema.safeParse("theInventor").success).toBe(false);
  });

  it("re-exported skillKeySchema accepts a real SkillKey value", () => {
    const skill: SkillKey = "negotiation";
    expect(skillKeySchema.safeParse(skill).success).toBe(true);
  });

  it("re-exported businessGenomeMatchingMetadataSchema is fully partial (an empty object is valid)", () => {
    expect(businessGenomeMatchingMetadataSchema.safeParse({}).success).toBe(true);
  });
});
