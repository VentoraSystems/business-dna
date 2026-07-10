import { NotImplementedError } from "../utils/errors";
import { MatchingPipelineStage } from "../types/pipeline";
import type { AssessmentFeatureVector } from "../types/assessment-input";
import type { BusinessCandidate } from "../types/business-candidate";
import type { DimensionScore } from "./dimension-score";
import type { WeightConfig } from "./weight-config";
import { getDimensionWeight } from "./weight-config";
import { ALL_MATCHING_DIMENSIONS, MatchingDimension } from "./dimensions";

/**
 * Produces one `DimensionScore` per dimension shared by the user's
 * `AssessmentFeatureVector` and the candidate's `dimensionProfile`. This is
 * the Weighted Scoring stage — it does not decide what the weights should
 * be (that's `WeightConfig`, currently unassigned) or what the final
 * overall score is (that's `CompatibilityCalculator`).
 */
export interface ScoreCalculator {
  calculateDimensionScores(
    assessmentFeatures: AssessmentFeatureVector,
    candidate: BusinessCandidate,
    weights: WeightConfig
  ): Promise<DimensionScore[]>;
}

export class PlaceholderScoreCalculator implements ScoreCalculator {
  async calculateDimensionScores(
    _assessmentFeatures: AssessmentFeatureVector,
    _candidate: BusinessCandidate,
    _weights: WeightConfig
  ): Promise<DimensionScore[]> {
    throw new NotImplementedError(
      MatchingPipelineStage.WeightedScoring,
      "ScoreCalculator.calculateDimensionScores — no per-dimension comparison logic exists yet."
    );
  }
}

/** The two dimensions ScoreCalculator treats as set membership rather than a numeric diff — see types/business-candidate.ts. */
const SET_MEMBERSHIP_DIMENSIONS: ReadonlySet<MatchingDimension> = new Set([
  MatchingDimension.IndustryPreference,
  MatchingDimension.BusinessModelPreference,
]);

/**
 * v1 implementation: `rawValue = 1 - abs(userValue - candidateValue)` for
 * every ordinary numeric dimension — deliberately simple, per this phase's
 * scope (see README.md's "Scoring model" section for the full reasoning
 * and the two dimensions handled differently).
 */
export class DefaultScoreCalculator implements ScoreCalculator {
  async calculateDimensionScores(
    assessmentFeatures: AssessmentFeatureVector,
    candidate: BusinessCandidate,
    weights: WeightConfig
  ): Promise<DimensionScore[]> {
    const scores: DimensionScore[] = [];

    for (const dimension of ALL_MATCHING_DIMENSIONS) {
      const rawValue = SET_MEMBERSHIP_DIMENSIONS.has(dimension)
        ? this.membershipRawValue(dimension, assessmentFeatures, candidate)
        : this.numericDiffRawValue(dimension, assessmentFeatures, candidate);

      if (rawValue === undefined) continue;

      const weight = getDimensionWeight(weights, dimension);
      scores.push({ dimension, rawValue, weight, weightedValue: rawValue * weight });
    }

    return scores;
  }

  private numericDiffRawValue(
    dimension: MatchingDimension,
    assessmentFeatures: AssessmentFeatureVector,
    candidate: BusinessCandidate
  ): number | undefined {
    const userValue = assessmentFeatures.dimensionInputs[dimension]?.value;
    const candidateValue = candidate.dimensionProfile[dimension];
    if (userValue === undefined || candidateValue === undefined) return undefined;
    return 1 - Math.abs(userValue - candidateValue);
  }

  private membershipRawValue(
    dimension: MatchingDimension,
    assessmentFeatures: AssessmentFeatureVector,
    candidate: BusinessCandidate
  ): number | undefined {
    const selections = assessmentFeatures.rawCategorySelections?.[dimension];
    const candidateCode =
      dimension === MatchingDimension.IndustryPreference ? candidate.industryCode : candidate.businessModelCode;
    if (!selections || selections.length === 0 || !candidateCode) return undefined;
    return selections.includes(candidateCode) ? 1 : 0;
  }
}
