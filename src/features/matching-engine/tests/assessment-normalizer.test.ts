import { describe, it, expect } from "vitest";
import { PlaceholderAssessmentNormalizer } from "../services/assessment-normalizer";
import { NotImplementedError } from "../utils/errors";

describe("PlaceholderAssessmentNormalizer", () => {
  const normalizer = new PlaceholderAssessmentNormalizer();

  it("normalize() throws NotImplementedError", async () => {
    await expect(
      normalizer.normalize({ assessmentId: "a1", userId: "u1", locale: "en", answers: {} })
    ).rejects.toBeInstanceOf(NotImplementedError);
  });

  it("extractFeatures() throws NotImplementedError", async () => {
    await expect(
      normalizer.extractFeatures({ assessmentId: "a1", userId: "u1", locale: "en", normalizedAnswers: {} })
    ).rejects.toBeInstanceOf(NotImplementedError);
  });
});
