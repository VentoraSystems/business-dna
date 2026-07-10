import { describe, it, expect } from "vitest";
import { PlaceholderCompatibilityCalculator, DefaultCompatibilityCalculator } from "../scoring/compatibility-calculator";
import { NotImplementedError } from "../utils/errors";
import { MatchingDimension } from "../scoring/dimensions";
import type { DimensionScore } from "../scoring/dimension-score";

describe("PlaceholderCompatibilityCalculator", () => {
  it("calculate() throws NotImplementedError", async () => {
    const calculator = new PlaceholderCompatibilityCalculator();
    await expect(
      calculator.calculate({ dimensionScores: [], ruleResults: [] })
    ).rejects.toBeInstanceOf(NotImplementedError);
  });
});

describe("DefaultCompatibilityCalculator", () => {
  const calculator = new DefaultCompatibilityCalculator();

  const score = (dimension: MatchingDimension, rawValue: number, weight = 1): DimensionScore => ({
    dimension,
    rawValue,
    weight,
    weightedValue: rawValue * weight,
  });

  it("overallScore is the weighted average of rawValue, scaled to 0-100", async () => {
    const result = await calculator.calculate({
      dimensionScores: [score(MatchingDimension.Budget, 0.8), score(MatchingDimension.Risk, 0.4)],
      ruleResults: [],
    });
    expect(result.overallScore).toBeCloseTo(60, 5); // avg(0.8, 0.4) * 100
  });

  it("applies rule scoreAdjustments on top of the weighted average, clamped to [0, 100]", async () => {
    const result = await calculator.calculate({
      dimensionScores: [score(MatchingDimension.Budget, 0.9)],
      ruleResults: [
        { rule: { id: "r1", type: "bonus" as never, translationKey: "x", conditions: [], isActive: true }, passed: true, scoreAdjustment: 20 },
      ],
    });
    expect(result.overallScore).toBe(100); // 90 + 20, clamped
  });

  it("confidenceScore uses answeredQuestionCount/totalQuestionCount when supplied", async () => {
    const result = await calculator.calculate({
      dimensionScores: [score(MatchingDimension.Budget, 0.5)],
      ruleResults: [],
      answeredQuestionCount: 20,
      totalQuestionCount: 40,
    });
    expect(result.confidenceScore).toBe(0.5);
  });

  it("confidenceScore falls back to dimension coverage when question counts aren't supplied", async () => {
    const result = await calculator.calculate({
      dimensionScores: [score(MatchingDimension.Budget, 0.5), score(MatchingDimension.Risk, 0.5)],
      ruleResults: [],
    });
    expect(result.confidenceScore).toBeCloseTo(2 / 14, 5);
  });

  it("returns 0/0 for a candidate with no scored dimensions rather than dividing by zero", async () => {
    const result = await calculator.calculate({ dimensionScores: [], ruleResults: [] });
    expect(result.overallScore).toBe(0);
    expect(result.confidenceScore).toBe(0);
  });
});
