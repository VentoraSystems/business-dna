import { describe, it, expect } from "vitest";
import { PlaceholderExplanationGenerator } from "../services/explanation-generator";
import { NotImplementedError } from "../utils/errors";
import type { RankedCandidate } from "../services/ranking-engine";

const fakeContext = {
  locale: "en" as const,
  candidate: {
    rank: 1,
    candidate: { businessTypeId: "bt1", slug: "x", translationKey: "x", dimensionProfile: {}, skillKeys: [] },
    compatibility: { overallScore: 0, confidenceScore: 0 },
  } satisfies RankedCandidate,
};

describe("PlaceholderExplanationGenerator", () => {
  const generator = new PlaceholderExplanationGenerator();

  it("explainMatch() throws NotImplementedError", async () => {
    await expect(generator.explainMatch(fakeContext)).rejects.toBeInstanceOf(NotImplementedError);
  });

  it("explainStrengths() throws NotImplementedError", async () => {
    await expect(generator.explainStrengths(fakeContext)).rejects.toBeInstanceOf(NotImplementedError);
  });

  it("explainWeaknesses() throws NotImplementedError", async () => {
    await expect(generator.explainWeaknesses(fakeContext)).rejects.toBeInstanceOf(NotImplementedError);
  });

  it("suggestImprovements() throws NotImplementedError", async () => {
    await expect(generator.suggestImprovements(fakeContext)).rejects.toBeInstanceOf(NotImplementedError);
  });

  it("summarizeBusiness() throws NotImplementedError", async () => {
    await expect(generator.summarizeBusiness(fakeContext)).rejects.toBeInstanceOf(NotImplementedError);
  });
});
