import { NotImplementedError } from "../utils/errors";
import { MatchingPipelineStage } from "../types/pipeline";
import type { AssessmentFeatureVector } from "../types/assessment-input";
import type { BusinessCandidate } from "../types/business-candidate";
import type { DimensionScore } from "./dimension-score";
import type { WeightConfig } from "./weight-config";

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
