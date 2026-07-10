import { describe, it, expect } from "vitest";
import { createMatchingEngine } from "../services/matching-engine";
import { NotImplementedError } from "../utils/errors";
import { MatchingDimension } from "../scoring/dimensions";
import type { BusinessCandidateProvider } from "../services/business-candidate-provider";
import type { RawAssessmentAnswers } from "../types/assessment-input";
import type { BusinessCandidate } from "../types/business-candidate";

describe("createMatchingEngine", () => {
  it("throws NotImplementedError at the Assessment Answers stage when no fetchRawAnswers is supplied", async () => {
    const engine = createMatchingEngine();
    await expect(
      engine.run({ assessmentId: "a1", userId: "u1", locale: "en" })
    ).rejects.toBeInstanceOf(NotImplementedError);
  });

  it("throws NotImplementedError at the AI Explanation stage once fetchRawAnswers and a candidate source are supplied (ExplanationGenerator is out of scope for this phase)", async () => {
    const fakeCandidateProvider: BusinessCandidateProvider = {
      getCandidates: async () => [
        {
          businessTypeId: "bt1",
          slug: "example",
          translationKey: "businessTypes.example",
          dimensionProfile: { [MatchingDimension.Budget]: 0.5 },
          skillKeys: [],
        },
      ],
    };

    const engine = createMatchingEngine({
      fetchRawAnswers: async () => ({ assessmentId: "a1", userId: "u1", locale: "en", answers: { budget: 10_000 } }),
      candidateProvider: fakeCandidateProvider,
    });

    await expect(
      engine.run({ assessmentId: "a1", userId: "u1", locale: "en" })
    ).rejects.toMatchObject({ stage: "aiExplanation" });
  });

  it("runs the full pipeline end-to-end and returns real ranked CompatibilityResults when every stage is supplied", async () => {
    const candidates: BusinessCandidate[] = [
      {
        businessTypeId: "close-match",
        slug: "close-match",
        translationKey: "businessTypes.closeMatch",
        dimensionProfile: { [MatchingDimension.Budget]: 0.2, [MatchingDimension.Risk]: 0.8 },
        skillKeys: ["programming"],
      },
      {
        businessTypeId: "far-match",
        slug: "far-match",
        translationKey: "businessTypes.farMatch",
        dimensionProfile: { [MatchingDimension.Budget]: 0.9, [MatchingDimension.Risk]: 0.1 },
        skillKeys: ["sales"],
      },
    ];
    const fakeCandidateProvider: BusinessCandidateProvider = { getCandidates: async () => candidates };

    const rawAnswers: RawAssessmentAnswers = {
      assessmentId: "a1",
      userId: "u1",
      locale: "en",
      answers: { budget: 10_000, riskTolerance: 80, programming: 5 }, // budget -> 0.2, riskTolerance -> 0.8
    };

    const engine = createMatchingEngine({
      fetchRawAnswers: async () => rawAnswers,
      candidateProvider: fakeCandidateProvider,
      explanationGenerator: {
        explainMatch: async () => "stub explanation for a unit test — not a real AI call",
        explainStrengths: async () => "",
        explainWeaknesses: async () => "",
        suggestImprovements: async () => "",
        summarizeBusiness: async () => "",
      },
    });

    const results = await engine.run({ assessmentId: "a1", userId: "u1", locale: "en" });

    expect(results).toHaveLength(2);
    // "close-match" (budget 0.2, risk 0.8) should exactly match this user's normalized answers (0.2, 0.8) -> rank 1.
    expect(results[0]?.businessTypeId).toBe("close-match");
    expect(results[0]?.overallScore).toBeGreaterThan(results[1]?.overallScore ?? 0);
    expect(results[0]?.overallScore).toBeCloseTo(100, 5);
    expect(results[0]?.reasoning.summary).toContain("stub explanation");
    expect(results[0]?.matchedSkills).toEqual(["programming"]); // user rated programming 5/5
    expect(results[1]?.missingSkills).toEqual(["sales"]); // user never answered a "sales" rating
  });
});
