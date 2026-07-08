import type { Locale } from "@/i18n/config";
import type { MatchingDimension } from "../scoring/dimensions";

/**
 * The pipeline's actual starting point: an assessment's answers exactly as
 * stored by the Assessment feature (see
 * src/features/assessment/actions/assessment-actions.ts →
 * `SessionWithAnswers`), keyed by `AssessmentQuestion.key`. Deliberately a
 * loose `unknown` value type here rather than importing the Assessment
 * feature's `AnswerValue` — this feature should be able to describe "raw
 * answers" without taking on a hard dependency on the Assessment feature's
 * internal types.
 */
export interface RawAssessmentAnswers {
  assessmentId: string;
  userId: string;
  locale: Locale;
  /** Keyed by AssessmentQuestion.key. */
  answers: Record<string, unknown>;
}

/**
 * Output of the Normalization stage: every answer converted to a
 * consistent numeric representation (0-1 for scalars, arrays of category
 * keys preserved as-is for multi-select answers) regardless of whether the
 * source question was a slider, a rating, or a choice. This is what makes
 * every downstream stage able to reason about answers uniformly.
 */
export interface NormalizedAssessmentProfile {
  assessmentId: string;
  userId: string;
  locale: Locale;
  /** Keyed by AssessmentQuestion.key. */
  normalizedAnswers: Record<string, NormalizedAnswerValue>;
}

export type NormalizedAnswerValue =
  | { kind: "scalar"; value: number } // 0-1, from a slider or rating question
  | { kind: "category"; value: string } // a single_choice answer, kept as its option key
  | { kind: "categorySet"; value: string[] } // a multiple_choice/cards answer
  | { kind: "text"; value: string }; // a short_text/long_text answer, unscored but kept for context

/**
 * One dimension's input signal, extracted from one or more normalized
 * answers. `contributingQuestionKeys` exists so
 * `ExplanationGenerator`/`CompatibilityResult.reasoning` can say *why* a
 * dimension scored the way it did in terms the user will recognize from
 * the Assessment, instead of an opaque number.
 */
export interface DimensionInput {
  dimension: MatchingDimension;
  /** 0-1 — this user's normalized position on this dimension. */
  value: number;
  contributingQuestionKeys: string[];
}

/**
 * Output of the Feature Extraction stage, and the assessment-side input to
 * Weighted Scoring. One `DimensionInput` per dimension the extractor was
 * able to derive a value for — a dimension can be absent if the relevant
 * questions weren't answered.
 */
export interface AssessmentFeatureVector {
  assessmentId: string;
  userId: string;
  locale: Locale;
  dimensionInputs: Partial<Record<MatchingDimension, DimensionInput>>;
}
