import type { Locale } from "@/i18n/config";
import type { AssessmentFeatureVector } from "@/features/matching-engine/types/assessment-input";
import type { CompatibilityResult } from "@/features/matching-engine/types/compatibility-result";
// Long relative path is deliberately confined to this one file — every
// other module in this feature that needs `BusinessGenome` imports it from
// here (or from ../dto's barrel) instead of reaching into business-library
// directly. See business-library/schema.ts for the canonical definition.
import type { BusinessGenome } from "../../../../business-library/schema";

/**
 * Everything the Explanation Engine needs to explain one (user, Assessment,
 * BusinessType) match. Deliberately just a wrapper around types that
 * already exist elsewhere — this sprint does not re-derive dimension
 * scores, a compatibility score, strengths, weaknesses, matched/missing
 * skills, or genome data; all of that already lives on
 * `compatibilityResult` (matching-engine) and `businessGenome`
 * (business-library).
 *
 * Note: `compatibilityResult.reasoning.ruleResults` (typed
 * `RuleEvaluationResult[]`, see matching-engine/rules/rule-types) is what
 * `SummaryBuilder` reads to build `matchReasons` — it is not duplicated as
 * a separate field here.
 */
export interface ExplanationEngineInput {
  assessmentFeatures: AssessmentFeatureVector;
  businessGenome: BusinessGenome;
  compatibilityResult: CompatibilityResult;
  locale: Locale;
}

export type { BusinessGenome };
