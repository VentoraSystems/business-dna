import { describe, it, expect } from "vitest";
import { PlaceholderScoreCalculator, DefaultScoreCalculator } from "../scoring/score-calculator";
import { UNIFORM_CONFIG } from "../scoring/weight-config";
import { MatchingDimension } from "../scoring/dimensions";
import { NotImplementedError } from "../utils/errors";
import type { AssessmentFeatureVector } from "../types/assessment-input";
import type { BusinessCandidate } from "../types/business-candidate";

describe("PlaceholderScoreCalculator", () => {
  it("calculateDimensionScores() throws NotImplementedError", async () => {
    const calculator = new PlaceholderScoreCalculator();
    await expect(
      calculator.calculateDimensionScores(
        { assessmentId: "a1", userId: "u1", locale: "en", dimensionInputs: {} },
        { businessTypeId: "bt1", slug: "x", translationKey: "x", dimensionProfile: {}, skillKeys: [] },
        UNIFORM_CONFIG
      )
    ).rejects.toBeInstanceOf(NotImplementedError);
  });
});

describe("DefaultScoreCalculator", () => {
  const calculator = new DefaultScoreCalculator();

  it("computes 1 - abs(diff) per shared numeric dimension, weighted", async () => {
    const assessmentFeatures: AssessmentFeatureVector = {
      assessmentId: "a1",
      userId: "u1",
      locale: "en",
      dimensionInputs: {
        [MatchingDimension.Budget]: { dimension: MatchingDimension.Budget, value: 0.8, contributingQuestionKeys: ["budget"] },
        [MatchingDimension.Risk]: { dimension: MatchingDimension.Risk, value: 0.2, contributingQuestionKeys: ["riskTolerance"] },
      },
    };
    const candidate: BusinessCandidate = {
      businessTypeId: "bt1",
      slug: "x",
      translationKey: "x",
      dimensionProfile: { [MatchingDimension.Budget]: 0.6, [MatchingDimension.Risk]: 0.9 },
      skillKeys: [],
    };

    const scores = await calculator.calculateDimensionScores(assessmentFeatures, candidate, UNIFORM_CONFIG);

    expect(scores).toHaveLength(2);
    const budget = scores.find((s) => s.dimension === MatchingDimension.Budget);
    expect(budget?.rawValue).toBeCloseTo(0.8, 5); // 1 - |0.8 - 0.6|
    expect(budget?.weight).toBe(1);
    expect(budget?.weightedValue).toBeCloseTo(0.8, 5);
    const risk = scores.find((s) => s.dimension === MatchingDimension.Risk);
    expect(risk?.rawValue).toBeCloseTo(0.3, 5); // 1 - |0.2 - 0.9|
  });

  it("skips a dimension present on only one side", async () => {
    const assessmentFeatures: AssessmentFeatureVector = {
      assessmentId: "a1",
      userId: "u1",
      locale: "en",
      dimensionInputs: {
        [MatchingDimension.Budget]: { dimension: MatchingDimension.Budget, value: 0.5, contributingQuestionKeys: ["budget"] },
      },
    };
    const candidate: BusinessCandidate = {
      businessTypeId: "bt1",
      slug: "x",
      translationKey: "x",
      dimensionProfile: {}, // no budget on the candidate side
      skillKeys: [],
    };

    const scores = await calculator.calculateDimensionScores(assessmentFeatures, candidate, UNIFORM_CONFIG);
    expect(scores).toEqual([]);
  });

  it("scores industryPreference/businessModelPreference as set membership, not numeric diff", async () => {
    const assessmentFeatures: AssessmentFeatureVector = {
      assessmentId: "a1",
      userId: "u1",
      locale: "en",
      dimensionInputs: {},
      rawCategorySelections: {
        [MatchingDimension.IndustryPreference]: ["tech", "finance"],
        [MatchingDimension.BusinessModelPreference]: ["saas"],
      },
    };
    const matchingCandidate: BusinessCandidate = {
      businessTypeId: "bt1",
      slug: "x",
      translationKey: "x",
      dimensionProfile: {},
      skillKeys: [],
      industryCode: "tech",
      businessModelCode: "service",
    };
    const nonMatchingCandidate: BusinessCandidate = {
      ...matchingCandidate,
      businessTypeId: "bt2",
      industryCode: "health",
    };

    const matchingScores = await calculator.calculateDimensionScores(assessmentFeatures, matchingCandidate, UNIFORM_CONFIG);
    expect(matchingScores.find((s) => s.dimension === MatchingDimension.IndustryPreference)?.rawValue).toBe(1);
    expect(matchingScores.find((s) => s.dimension === MatchingDimension.BusinessModelPreference)?.rawValue).toBe(0);

    const nonMatchingScores = await calculator.calculateDimensionScores(assessmentFeatures, nonMatchingCandidate, UNIFORM_CONFIG);
    expect(nonMatchingScores.find((s) => s.dimension === MatchingDimension.IndustryPreference)?.rawValue).toBe(0);
  });
});
