import { describe, it, expect } from "vitest";
import { PlaceholderCompatibilityCalculator } from "../scoring/compatibility-calculator";
import { NotImplementedError } from "../utils/errors";

describe("PlaceholderCompatibilityCalculator", () => {
  it("calculate() throws NotImplementedError", async () => {
    const calculator = new PlaceholderCompatibilityCalculator();
    await expect(
      calculator.calculate({ dimensionScores: [], ruleResults: [] })
    ).rejects.toBeInstanceOf(NotImplementedError);
  });
});
