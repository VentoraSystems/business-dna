import aiAutomationAgency from "../../../../business-library/examples/ai-automation-agency";
import type { ExplanationEngineInput } from "../dto/explanation-engine-input.dto";

/**
 * A minimal, valid `ExplanationEngineInput` for tests that only need to
 * assert a placeholder throws `NotImplementedError` — none of these
 * placeholders read their input, so this doesn't need to be realistic
 * beyond typechecking. `businessGenome` reuses the Business Genome
 * Library's one real reference example (see
 * business-library/examples/ai-automation-agency.ts) instead of
 * fabricating fake business data for this feature's tests.
 */
export const fakeExplanationEngineInput: ExplanationEngineInput = {
  assessmentFeatures: {
    assessmentId: "assessment-1",
    userId: "user-1",
    locale: "en",
    dimensionInputs: {},
  },
  businessGenome: aiAutomationAgency,
  compatibilityResult: {
    businessTypeId: "business-type-1",
    overallScore: 0,
    dimensionScores: [],
    strengths: [],
    weaknesses: [],
    matchedSkills: [],
    missingSkills: [],
    recommendedBusinessTypes: [],
    confidenceScore: 0,
    reasoning: { ruleResults: [] },
  },
  locale: "en",
};
