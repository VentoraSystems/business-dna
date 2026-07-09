import type { BusinessInsightsCreateDto, BusinessInsightsDto, BusinessInsightsUpdateDto } from "../dto";
import type { BusinessInsightsRepository } from "./business-insights-repository.interface";

/**
 * An EMPTY, in-memory stub — not a `NotImplementedError`-throwing
 * placeholder. Matches features/business-dna's, features/blueprint's,
 * features/financial's, features/marketing's, features/roadmap's, and
 * features/resources' precedent exactly (all of last sprint's five
 * Business Assets features use this same `Map`-based, non-throwing
 * pattern — see e.g. `features/blueprint/repositories/blueprint-repository.ts`):
 * there is no Prisma table for `BusinessInsights` content yet, and this
 * sprint authors zero real content, so the repository itself has
 * nothing wrong with it — the data is just legitimately empty. A future
 * Prisma-backed implementation would sit behind this same interface.
 */
export class InMemoryBusinessInsightsRepository implements BusinessInsightsRepository {
  private readonly store = new Map<string, BusinessInsightsDto>();

  async findByBusinessTypeId(businessTypeId: string): Promise<BusinessInsightsDto | null> {
    return this.store.get(businessTypeId) ?? null;
  }

  async list(): Promise<BusinessInsightsDto[]> {
    return Array.from(this.store.values());
  }

  async create(businessTypeId: string, input: BusinessInsightsCreateDto): Promise<BusinessInsightsDto> {
    this.store.set(businessTypeId, input);
    return input;
  }

  async update(businessTypeId: string, input: BusinessInsightsUpdateDto): Promise<BusinessInsightsDto | null> {
    const existing = this.store.get(businessTypeId);
    if (!existing) return null;
    const updated: BusinessInsightsDto = { ...existing, ...input };
    this.store.set(businessTypeId, updated);
    return updated;
  }

  async delete(businessTypeId: string): Promise<boolean> {
    return this.store.delete(businessTypeId);
  }
}

export const businessInsightsRepository: BusinessInsightsRepository = new InMemoryBusinessInsightsRepository();
