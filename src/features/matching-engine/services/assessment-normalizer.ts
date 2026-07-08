import { NotImplementedError } from "../utils/errors";
import { MatchingPipelineStage } from "../types/pipeline";
import type { RawAssessmentAnswers, NormalizedAssessmentProfile, AssessmentFeatureVector } from "../types/assessment-input";

/**
 * Covers the first two pipeline stages, both about transforming the
 * assessment side of the match before any BusinessType is involved:
 *
 *  - `normalize()`      — Normalization: raw, mixed-scale answers → a
 *                          consistent 0-1 / categorical representation.
 *  - `extractFeatures()` — Feature Extraction: normalized answers →
 *                          one signal per MatchingDimension.
 *
 * Kept as one interface (rather than two) because in practice a real
 * implementation will likely want to normalize and extract in the same
 * pass over the answers — but the two methods stay separate so each stage
 * can still be tested, logged, and reasoned about independently.
 */
export interface AssessmentNormalizer {
  normalize(raw: RawAssessmentAnswers): Promise<NormalizedAssessmentProfile>;
  extractFeatures(normalized: NormalizedAssessmentProfile): Promise<AssessmentFeatureVector>;
}

export class PlaceholderAssessmentNormalizer implements AssessmentNormalizer {
  async normalize(_raw: RawAssessmentAnswers): Promise<NormalizedAssessmentProfile> {
    throw new NotImplementedError(
      MatchingPipelineStage.Normalization,
      "AssessmentNormalizer.normalize — no answer-normalization logic exists yet."
    );
  }

  async extractFeatures(_normalized: NormalizedAssessmentProfile): Promise<AssessmentFeatureVector> {
    throw new NotImplementedError(
      MatchingPipelineStage.FeatureExtraction,
      "AssessmentNormalizer.extractFeatures — no dimension-extraction logic exists yet."
    );
  }
}
