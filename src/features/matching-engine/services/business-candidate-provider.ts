import { NotImplementedError } from "../utils/errors";
import { MatchingPipelineStage } from "../types/pipeline";
import type { BusinessCandidate, BusinessCandidateFilters } from "../types/business-candidate";
import {
  businessRepository as defaultBusinessRepository,
  type BusinessRepository,
} from "@/features/business-engine/repositories";

/**
 * Retrieves candidate BusinessTypes for scoring. This is the one service
 * in this feature that's wired to a real dependency
 * (`BusinessRepository` from the Business Engine) rather than throwing
 * immediately — fetching rows is legitimate infrastructure, not matching
 * logic. What it does *not* do is decide how a catalog BusinessType's
 * attributes translate into `BusinessCandidate.dimensionProfile` — that
 * mapping is exactly the part of "the matching algorithm" this scaffold
 * must not invent, so it's left as an explicit `NotImplementedError`
 * below. Note that until the catalog has any published `BusinessType`
 * rows (see prisma/seed-business-engine.ts, still empty), this returns an
 * empty list regardless.
 */
export interface BusinessCandidateProvider {
  getCandidates(filters?: BusinessCandidateFilters): Promise<BusinessCandidate[]>;
}

export class RepositoryBusinessCandidateProvider implements BusinessCandidateProvider {
  constructor(private readonly repository: BusinessRepository = defaultBusinessRepository) {}

  async getCandidates(filters?: BusinessCandidateFilters): Promise<BusinessCandidate[]> {
    const businessTypes = await this.repository.list({
      categoryId: filters?.categoryId,
      isPublished: filters?.isPublished ?? true,
      take: filters?.take,
    });

    return businessTypes.map((businessType) => this.toCandidate(businessType));
  }

  private toCandidate(businessType: { id: string; slug: string; translationKey: string }): BusinessCandidate {
    // Deliberately not implemented: deriving `dimensionProfile` and
    // `skillKeys` requires reading BusinessLifestyle/BusinessRisk/
    // BusinessBudget/BusinessSkill etc. for this BusinessType and deciding
    // how each maps onto a 0-1 dimension value. That mapping is scoring
    // logic, not retrieval, and belongs to whoever designs the actual
    // matching algorithm.
    throw new NotImplementedError(
      MatchingPipelineStage.BusinessCandidateRetrieval,
      `BusinessCandidateProvider — retrieval works (see .list() above), but mapping BusinessType "${businessType.slug}" to a scorable BusinessCandidate does not exist yet.`
    );
  }
}

export const businessCandidateProvider: BusinessCandidateProvider =
  new RepositoryBusinessCandidateProvider();
