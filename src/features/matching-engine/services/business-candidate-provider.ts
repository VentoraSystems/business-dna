import type { BusinessCandidate, BusinessCandidateFilters } from "../types/business-candidate";
import { MatchingDimension } from "../scoring/dimensions";
import { normalizeToUnitRange } from "../utils/normalization-math";
import { RATING_RANGE, THREE_LEVEL_TO_UNIT, TIMELINE_MONTHS_RANGE, WORK_MODE_TO_UNIT, ONLINE_OFFLINE_TO_UNIT, WEEKLY_HOURS_RANGE, BUDGET_RANGE } from "../scoring/dimension-mapping";
import {
  businessRepository as defaultBusinessRepository,
  type BusinessRepository,
} from "@/features/business-engine/repositories";
import type { FullBusinessType } from "@/features/business-engine/types/business-type";

/**
 * Retrieves candidate BusinessTypes for scoring. Uses
 * `BusinessRepository.listFull()` (see repositories/business-repository.ts)
 * rather than `.list()` — the summary include used for catalog browsing
 * doesn't carry the lifestyle/risk/budget/skills relations
 * `toCandidate()` needs to build a scorable `dimensionProfile`.
 *
 * `toCandidate()`'s mapping follows the Step 1 dimension mapping (see
 * README.md's "Scoring model" section) — the same constants
 * `AssessmentNormalizer.extractFeatures()` uses on the assessment side, so
 * a 0-1 value means the same thing on both sides of every
 * `ScoreCalculator` comparison.
 */
export interface BusinessCandidateProvider {
  getCandidates(filters?: BusinessCandidateFilters): Promise<BusinessCandidate[]>;
}

export class RepositoryBusinessCandidateProvider implements BusinessCandidateProvider {
  constructor(private readonly repository: BusinessRepository = defaultBusinessRepository) {}

  async getCandidates(filters?: BusinessCandidateFilters): Promise<BusinessCandidate[]> {
    const businessTypes = await this.repository.listFull({
      categoryId: filters?.categoryId,
      isPublished: filters?.isPublished ?? true,
      take: filters?.take,
    });

    return businessTypes.map((businessType) => this.toCandidate(businessType));
  }

  private toCandidate(businessType: FullBusinessType): BusinessCandidate {
    const dimensionProfile: Partial<Record<MatchingDimension, number>> = {};
    const set = (dimension: MatchingDimension, value: number | undefined) => {
      if (value === undefined) return;
      dimensionProfile[dimension] = value;
    };

    const skillImportance = (key: string): number | undefined => {
      const row = businessType.skills.find((s) => s.skill.key === key);
      return row ? normalizeToUnitRange(row.importance, RATING_RANGE.min, RATING_RANGE.max) : undefined;
    };
    const average = (values: (number | undefined)[]): number | undefined => {
      const present = values.filter((v): v is number => v !== undefined);
      if (present.length === 0) return undefined;
      return present.reduce((sum, v) => sum + v, 0) / present.length;
    };

    // 1. skills — average importance across every RequiredSkill this candidate references.
    set(
      MatchingDimension.Skills,
      average(businessType.skills.map((s) => normalizeToUnitRange(s.importance, RATING_RANGE.min, RATING_RANGE.max)))
    );

    // 2. budget — midpoint of [minInvestment, maxInvestment].
    if (businessType.budget) {
      const midpoint = (businessType.budget.minInvestment + businessType.budget.maxInvestment) / 2;
      set(MatchingDimension.Budget, normalizeToUnitRange(midpoint, BUDGET_RANGE.min, BUDGET_RANGE.max));
    }

    // 3. lifestyle — freedomLevel + weekly-hours midpoint, mirroring the assessment side's freedom+workingHours average.
    if (businessType.lifestyle) {
      const { freedomLevel, minWeeklyHours, maxWeeklyHours } = businessType.lifestyle;
      const freedomValue = freedomLevel != null ? normalizeToUnitRange(freedomLevel, RATING_RANGE.min, RATING_RANGE.max) : undefined;
      const hoursMidpoint = minWeeklyHours != null && maxWeeklyHours != null ? (minWeeklyHours + maxWeeklyHours) / 2 : undefined;
      const hoursValue = hoursMidpoint != null ? normalizeToUnitRange(hoursMidpoint, WEEKLY_HOURS_RANGE.min, WEEKLY_HOURS_RANGE.max) : undefined;
      set(MatchingDimension.Lifestyle, average([freedomValue, hoursValue]));
    }

    // 4. risk
    if (businessType.risk) {
      set(MatchingDimension.Risk, THREE_LEVEL_TO_UNIT[businessType.risk.riskLevel]);
    }

    // 5. timeline
    if (businessType.timeline?.timeToBreakEvenMonths != null) {
      set(
        MatchingDimension.Timeline,
        normalizeToUnitRange(businessType.timeline.timeToBreakEvenMonths, TIMELINE_MONTHS_RANGE.min, TIMELINE_MONTHS_RANGE.max)
      );
    }

    // 6/7. industryPreference / businessModelPreference — set-membership dimensions handled via
    // industryCode/businessModelCode below, not dimensionProfile (see types/business-candidate.ts).

    // 8. communicationStyle — the "communication" skill key, not matchingHints' freeform tags (see README.md's flagged assumption — those tags aren't seeded into Prisma).
    set(MatchingDimension.CommunicationStyle, skillImportance("communication"));

    // 9. leadership — the "management" skill key.
    set(MatchingDimension.Leadership, skillImportance("management"));

    // 10. creativity — average of "design"/"content" skill keys, whichever are present.
    set(MatchingDimension.Creativity, average([skillImportance("design"), skillImportance("content")]));

    // 11. technicalAbility — average of "programming"/"ai" skill keys.
    set(MatchingDimension.TechnicalAbility, average([skillImportance("programming"), skillImportance("ai")]));

    // 12. salesOrientation — the "sales" skill key.
    set(MatchingDimension.SalesOrientation, skillImportance("sales"));

    // 13. location
    if (businessType.lifestyle) {
      set(MatchingDimension.Location, WORK_MODE_TO_UNIT[businessType.lifestyle.workMode]);
    }

    // 14. workStyle
    if (businessType.lifestyle) {
      set(MatchingDimension.WorkStyle, ONLINE_OFFLINE_TO_UNIT[businessType.lifestyle.onlineOffline]);
    }

    return {
      businessTypeId: businessType.id,
      slug: businessType.slug,
      translationKey: businessType.translationKey,
      dimensionProfile,
      skillKeys: businessType.skills.map((s) => s.skill.key),
      industryCode: businessType.category.industry.code,
      businessModelCode: businessType.businessModel,
    };
  }
}

export const businessCandidateProvider: BusinessCandidateProvider =
  new RepositoryBusinessCandidateProvider();
