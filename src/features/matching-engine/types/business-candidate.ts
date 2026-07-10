import type { MatchingDimension } from "../scoring/dimensions";

/**
 * A BusinessType as the matching engine sees it — deliberately a narrower,
 * scoring-oriented shape than `FullBusinessType`
 * (features/business-engine/types/business-type.ts), which is meant for
 * display. `BusinessCandidateProvider` is responsible for the mapping
 * between the two; see services/business-candidate-provider.ts.
 */
export interface BusinessCandidate {
  businessTypeId: string;
  slug: string;
  translationKey: string;
  /**
   * The candidate's position on each dimension, 0-1, so it can be compared
   * directly against a user's `AssessmentFeatureVector.dimensionInputs`.
   * Deriving these values from the catalog's normalized attributes
   * (BusinessBudget, BusinessRisk, BusinessLifestyle, BusinessSkill, etc.)
   * is exactly the mapping this scaffold does not implement yet.
   */
  dimensionProfile: Partial<Record<MatchingDimension, number>>;
  /** RequiredSkill keys this BusinessType's BusinessSkill rows reference. */
  skillKeys: string[];
  /**
   * Raw industry/businessModel codes, kept alongside `dimensionProfile`
   * rather than folded into it as a 0-1 number. `industryPreference` and
   * `businessModelPreference` are set-membership comparisons (does this
   * candidate's single industry/businessModel appear in the user's
   * multi-select answer?), not numeric distances — there's no ordering
   * over "tech"/"health"/"finance"/etc. that a scalar diff could express
   * honestly, unlike e.g. remote/hybrid/inPerson, which really is a
   * spectrum (see dimension-mapping.ts). `ScoreCalculator` reads these two
   * fields directly for those two dimensions instead of diffing
   * `dimensionProfile`.
   */
  industryCode?: string;
  businessModelCode?: string;
}

export interface BusinessCandidateFilters {
  categoryId?: string;
  isPublished?: boolean;
  take?: number;
}
