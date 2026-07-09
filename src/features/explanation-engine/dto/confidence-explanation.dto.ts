export enum ConfidenceFactorCategory {
  AnswerCompleteness = "answerCompleteness",
  DataFreshness = "dataFreshness",
  SampleSize = "sampleSize",
}

export interface ConfidenceFactor {
  category: ConfidenceFactorCategory;
  translationKey: string;
  /** -1 to 1 — negative reduces confidence, positive increases it. */
  impact: number;
}

/**
 * Explains *why* `CompatibilityResult.confidenceScore` is what it is,
 * produced by `ConfidenceExplainer.explain()`. Echoes the score rather
 * than recomputing it — this feature explains confidence, it doesn't
 * calculate it.
 */
export interface ConfidenceExplanation {
  /** Echoes CompatibilityResult.confidenceScore (0-1). */
  confidenceScore: number;
  factors: ConfidenceFactor[];
}
