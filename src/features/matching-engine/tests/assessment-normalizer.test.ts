import { describe, it, expect } from "vitest";
import { PlaceholderAssessmentNormalizer, DefaultAssessmentNormalizer } from "../services/assessment-normalizer";
import { NotImplementedError } from "../utils/errors";
import { MatchingDimension } from "../scoring/dimensions";
import type { RawAssessmentAnswers } from "../types/assessment-input";

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

const SAMPLE_RAW_ANSWERS: RawAssessmentAnswers = {
  assessmentId: "a1",
  userId: "u1",
  locale: "en",
  answers: {
    budget: 10_000, // slider 0-50000 -> 0.2
    riskTolerance: 80, // slider 0-100 -> 0.8
    freedom: 4, // rating 1-5 -> 0.75
    workingHours: 45, // slider 10-80 -> 0.5
    desiredTimeline: "sixMonths", // -> 6 months / 24 -> 0.25
    leadership: 5, // rating 1-5 -> 1
    creativity: 1, // rating 1-5 -> 0
    programming: 5,
    ai: 3,
    sellingPreference: 4,
    marketing: 3,
    sales: 3,
    finance: 3,
    management: 3,
    design: 3,
    content: 3,
    negotiation: 3,
    communication: 5, // -> 1
    remote: "hybrid", // -> 0.5
    onlineVsOffline: "online", // -> 0
    industries: ["tech", "finance"],
    businessModels: ["saas"],
  },
};

describe("DefaultAssessmentNormalizer", () => {
  const normalizer = new DefaultAssessmentNormalizer();

  it("normalize() converts sliders/ratings to 0-1 scalars and preserves choice answers", async () => {
    const profile = await normalizer.normalize(SAMPLE_RAW_ANSWERS);
    expect(profile.normalizedAnswers.budget).toEqual({ kind: "scalar", value: 0.2 });
    expect(profile.normalizedAnswers.riskTolerance).toEqual({ kind: "scalar", value: 0.8 });
    expect(profile.normalizedAnswers.freedom).toEqual({ kind: "scalar", value: 0.75 });
    expect(profile.normalizedAnswers.desiredTimeline).toEqual({ kind: "category", value: "sixMonths" });
    expect(profile.normalizedAnswers.industries).toEqual({ kind: "categorySet", value: ["tech", "finance"] });
  });

  it("extractFeatures() produces a 0-1 value per dimension per the Step 1 mapping", async () => {
    const profile = await normalizer.normalize(SAMPLE_RAW_ANSWERS);
    const features = await normalizer.extractFeatures(profile);

    expect(features.dimensionInputs[MatchingDimension.Budget]?.value).toBeCloseTo(0.2, 5);
    expect(features.dimensionInputs[MatchingDimension.Risk]?.value).toBeCloseTo(0.8, 5);
    expect(features.dimensionInputs[MatchingDimension.Timeline]?.value).toBeCloseTo(6 / 24, 5);
    expect(features.dimensionInputs[MatchingDimension.Leadership]?.value).toBeCloseTo(1, 5);
    expect(features.dimensionInputs[MatchingDimension.Creativity]?.value).toBeCloseTo(0, 5);
    expect(features.dimensionInputs[MatchingDimension.CommunicationStyle]?.value).toBeCloseTo(1, 5);
    expect(features.dimensionInputs[MatchingDimension.Location]?.value).toBeCloseTo(0.5, 5); // hybrid
    expect(features.dimensionInputs[MatchingDimension.WorkStyle]?.value).toBeCloseTo(0, 5); // online
    expect(features.rawCategorySelections?.[MatchingDimension.IndustryPreference]).toEqual(["tech", "finance"]);
    expect(features.rawCategorySelections?.[MatchingDimension.BusinessModelPreference]).toEqual(["saas"]);
  });

  it("encodes a 'noPreference' choice as the dimension midpoint rather than skipping it", async () => {
    const profile = await normalizer.normalize({
      ...SAMPLE_RAW_ANSWERS,
      answers: { ...SAMPLE_RAW_ANSWERS.answers, remote: "noPreference" },
    });
    const features = await normalizer.extractFeatures(profile);
    expect(features.dimensionInputs[MatchingDimension.Location]?.value).toBe(0.5);
  });

  it("omits a dimension entirely when its source question wasn't answered", async () => {
    const { desiredTimeline: _omit, ...answers } = SAMPLE_RAW_ANSWERS.answers;
    const profile = await normalizer.normalize({ ...SAMPLE_RAW_ANSWERS, answers });
    const features = await normalizer.extractFeatures(profile);
    expect(features.dimensionInputs[MatchingDimension.Timeline]).toBeUndefined();
  });
});
