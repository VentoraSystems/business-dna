import { NotImplementedError } from "../utils/errors";
import { MatchingPipelineStage } from "../types/pipeline";
import type {
  RawAssessmentAnswers,
  NormalizedAssessmentProfile,
  NormalizedAnswerValue,
  AssessmentFeatureVector,
  DimensionInput,
} from "../types/assessment-input";
import { MatchingDimension } from "../scoring/dimensions";
import { normalizeToUnitRange } from "../utils/normalization-math";
import {
  DESIRED_TIMELINE_MONTHS,
  NO_PREFERENCE_VALUE,
  ONLINE_OFFLINE_TO_UNIT,
  RATING_RANGE,
  TIMELINE_MONTHS_RANGE,
  WORK_MODE_TO_UNIT,
} from "../scoring/dimension-mapping";
import { flattenedQuestions } from "@/features/assessment/config/sections";
import type { QuestionConfig } from "@/features/assessment/types";

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

const QUESTIONS_BY_KEY: ReadonlyMap<string, QuestionConfig> = new Map(
  flattenedQuestions.map((question) => [question.key, question])
);

/**
 * v1 implementation of the Normalization + Feature Extraction stages, per
 * the Step 1 dimension mapping (see README.md's "Scoring model" section).
 *
 * Deliberately imports `@/features/assessment/config/sections` — a narrow,
 * one-directional exception to this feature's usual decoupling from the
 * Assessment feature (see README.md's "Where this plugs into the rest of
 * the app"). Interpreting a raw answer correctly (is "40" a slider value on
 * a 10-80 scale, or a rating on a 1-5 scale?) genuinely requires knowing
 * the question's type/bounds; importing the single source of truth for
 * that config is safer than hand-duplicating a shadow copy of it here that
 * could silently drift. Only the config (types/bounds), never assessment's
 * Prisma models or server actions, is imported.
 */
export class DefaultAssessmentNormalizer implements AssessmentNormalizer {
  async normalize(raw: RawAssessmentAnswers): Promise<NormalizedAssessmentProfile> {
    const normalizedAnswers: Record<string, NormalizedAnswerValue> = {};

    for (const [key, rawValue] of Object.entries(raw.answers)) {
      if (rawValue === null || rawValue === undefined) continue;

      const question = QUESTIONS_BY_KEY.get(key);
      if (!question) continue; // Unknown key — ignore rather than fail the whole assessment on stale/unrecognized data.

      normalizedAnswers[key] = this.normalizeAnswer(question, rawValue);
    }

    return {
      assessmentId: raw.assessmentId,
      userId: raw.userId,
      locale: raw.locale,
      normalizedAnswers,
    };
  }

  private normalizeAnswer(question: QuestionConfig, rawValue: unknown): NormalizedAnswerValue {
    switch (question.type) {
      case "slider":
        return { kind: "scalar", value: normalizeToUnitRange(Number(rawValue), question.min, question.max) };
      case "rating":
        return {
          kind: "scalar",
          value: normalizeToUnitRange(Number(rawValue), question.min ?? RATING_RANGE.min, question.max ?? RATING_RANGE.max),
        };
      case "single_choice":
        return { kind: "category", value: String(rawValue) };
      case "multiple_choice":
      case "cards":
        return { kind: "categorySet", value: Array.isArray(rawValue) ? rawValue.map(String) : [] };
      case "short_text":
      case "long_text":
        return { kind: "text", value: String(rawValue) };
    }
  }

  async extractFeatures(normalized: NormalizedAssessmentProfile): Promise<AssessmentFeatureVector> {
    const answers = normalized.normalizedAnswers;
    const dimensionInputs: Partial<Record<MatchingDimension, DimensionInput>> = {};
    const rawCategorySelections: Partial<Record<MatchingDimension, string[]>> = {};

    const scalarOf = (key: string): number | undefined => {
      const answer = answers[key];
      return answer?.kind === "scalar" ? answer.value : undefined;
    };
    const categoryOf = (key: string): string | undefined => {
      const answer = answers[key];
      return answer?.kind === "category" ? answer.value : undefined;
    };
    const categorySetOf = (key: string): string[] | undefined => {
      const answer = answers[key];
      return answer?.kind === "categorySet" ? answer.value : undefined;
    };
    const average = (values: (number | undefined)[]): number | undefined => {
      const present = values.filter((v): v is number => v !== undefined);
      if (present.length === 0) return undefined;
      return present.reduce((sum, v) => sum + v, 0) / present.length;
    };
    const set = (dimension: MatchingDimension, value: number | undefined, contributingQuestionKeys: string[]) => {
      if (value === undefined) return;
      dimensionInputs[dimension] = { dimension, value, contributingQuestionKeys };
    };

    // 1. skills — average of all 10 skills-section self-ratings.
    set(
      MatchingDimension.Skills,
      average(["marketing", "sales", "programming", "ai", "finance", "management", "design", "content", "negotiation", "communication"].map(scalarOf)),
      ["marketing", "sales", "programming", "ai", "finance", "management", "design", "content", "negotiation", "communication"]
    );

    // 2. budget
    set(MatchingDimension.Budget, scalarOf("budget"), ["budget"]);

    // 3. lifestyle — freedom + workload balance.
    set(MatchingDimension.Lifestyle, average([scalarOf("freedom"), scalarOf("workingHours")]), ["freedom", "workingHours"]);

    // 4. risk
    set(MatchingDimension.Risk, scalarOf("riskTolerance"), ["riskTolerance"]);

    // 5. timeline — desiredTimeline (categorical) -> representative months -> 0-1.
    const desiredTimeline = categoryOf("desiredTimeline");
    const desiredTimelineMonths = desiredTimeline ? DESIRED_TIMELINE_MONTHS[desiredTimeline] : undefined;
    if (desiredTimelineMonths !== undefined) {
      set(
        MatchingDimension.Timeline,
        normalizeToUnitRange(desiredTimelineMonths, TIMELINE_MONTHS_RANGE.min, TIMELINE_MONTHS_RANGE.max),
        ["desiredTimeline"]
      );
    }

    // 6/7. industryPreference / businessModelPreference — set-membership dimensions.
    // dimensionInputs carries a breadth scalar for introspection only;
    // ScoreCalculator reads rawCategorySelections for the real comparison.
    const industries = categorySetOf("industries");
    if (industries) {
      rawCategorySelections[MatchingDimension.IndustryPreference] = industries;
      set(MatchingDimension.IndustryPreference, industries.length / 11, ["industries"]);
    }
    const businessModels = categorySetOf("businessModels");
    if (businessModels) {
      rawCategorySelections[MatchingDimension.BusinessModelPreference] = businessModels;
      set(MatchingDimension.BusinessModelPreference, businessModels.length / 8, ["businessModels"]);
    }

    // 8. communicationStyle — reuses the skills-section self-rating (see dimension-mapping.ts / README): the
    // matchingHints.communicationStyle freeform tags aren't seeded into Prisma at all, so they're unusable
    // as a candidate-side signal in v1 (see BusinessCandidateProvider) — this dimension is scored via the
    // "communication" skill key instead, which is real, seeded data on both sides.
    set(MatchingDimension.CommunicationStyle, scalarOf("communication"), ["communication"]);

    // 9. leadership
    set(MatchingDimension.Leadership, scalarOf("leadership"), ["leadership"]);

    // 10. creativity
    set(MatchingDimension.Creativity, scalarOf("creativity"), ["creativity"]);

    // 11. technicalAbility
    set(MatchingDimension.TechnicalAbility, average([scalarOf("programming"), scalarOf("ai")]), ["programming", "ai"]);

    // 12. salesOrientation
    set(MatchingDimension.SalesOrientation, scalarOf("sellingPreference"), ["sellingPreference"]);

    // 13. location — remote/hybrid/inPerson is a genuine spectrum (see dimension-mapping.ts).
    const remote = categoryOf("remote");
    if (remote) {
      const value = remote === "noPreference" ? NO_PREFERENCE_VALUE : WORK_MODE_TO_UNIT[remote];
      set(MatchingDimension.Location, value, ["remote"]);
    }

    // 14. workStyle — online/hybrid/offline, same reasoning.
    const onlineVsOffline = categoryOf("onlineVsOffline");
    if (onlineVsOffline) {
      const value = onlineVsOffline === "noPreference" ? NO_PREFERENCE_VALUE : ONLINE_OFFLINE_TO_UNIT[onlineVsOffline];
      set(MatchingDimension.WorkStyle, value, ["onlineVsOffline"]);
    }

    return {
      assessmentId: normalized.assessmentId,
      userId: normalized.userId,
      locale: normalized.locale,
      dimensionInputs,
      rawCategorySelections,
    };
  }
}
