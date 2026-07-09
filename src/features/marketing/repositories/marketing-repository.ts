import type { MarketingCreateDto, MarketingDto, MarketingUpdateDto } from "../dto";
import type { MarketingRepository } from "./marketing-repository.interface";

/**
 * An EMPTY, in-memory stub — not a `NotImplementedError`-throwing
 * placeholder. Matches features/business-dna's, features/blueprint's, and
 * features/financial's precedent exactly: there is no Prisma table for
 * `Marketing` content yet, and this sprint authors zero real content, so
 * the repository itself has nothing wrong with it — the data is just
 * legitimately empty. A future Prisma-backed implementation would sit
 * behind this same interface.
 */
export class InMemoryMarketingRepository implements MarketingRepository {
  private readonly store = new Map<string, MarketingDto>();

  async findByBusinessTypeId(businessTypeId: string): Promise<MarketingDto | null> {
    return this.store.get(businessTypeId) ?? null;
  }

  async list(): Promise<MarketingDto[]> {
    return Array.from(this.store.values());
  }

  async create(businessTypeId: string, input: MarketingCreateDto): Promise<MarketingDto> {
    this.store.set(businessTypeId, input);
    return input;
  }

  async update(businessTypeId: string, input: MarketingUpdateDto): Promise<MarketingDto | null> {
    const existing = this.store.get(businessTypeId);
    if (!existing) return null;
    const updated: MarketingDto = { ...existing, ...input };
    this.store.set(businessTypeId, updated);
    return updated;
  }

  async delete(businessTypeId: string): Promise<boolean> {
    return this.store.delete(businessTypeId);
  }
}

export const marketingRepository: MarketingRepository = new InMemoryMarketingRepository();
