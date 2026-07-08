import { describe, it, expect } from "vitest";
import { PlaceholderScoreCalculator } from "../scoring/score-calculator";
import { UNWEIGHTED_CONFIG } from "../scoring/weight-config";
import { NotImplementedError } from "../utils/errors";

describe("PlaceholderScoreCalculator", () => {
  it("calculateDimensionScores() throws NotImplementedError", async () => {
    const calculator = new PlaceholderScoreCalculator();
    await expect(
      calculator.calculateDimensionScores(
        { assessmentId: "a1", userId: "u1", locale: "en", dimensionInputs: {} },
        { businessTypeId: "bt1", slug: "x", translationKey: "x", dimensionProfile: {}, skillKeys: [] },
        UNWEIGHTED_CONFIG
      )
    ).rejects.toBeInstanceOf(NotImplementedError);
  });
});
