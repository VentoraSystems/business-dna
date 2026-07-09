import type { ResourcesCreateDto, ResourcesDto, ResourcesUpdateDto } from "../dto";
import type { ResourcesRepository } from "./resources-repository.interface";

/**
 * An EMPTY, in-memory stub — not a `NotImplementedError`-throwing
 * placeholder. Matches features/business-dna's, features/blueprint's,
 * features/financial's, features/marketing's, and features/roadmap's
 * precedent exactly: there is no Prisma table for `Resources` content
 * yet, and this sprint authors zero real content, so the repository
 * itself has nothing wrong with it — the data is just legitimately
 * empty. A future Prisma-backed implementation would sit behind this
 * same interface.
 */
export class InMemoryResourcesRepository implements ResourcesRepository {
  private readonly store = new Map<string, ResourcesDto>();

  async findByBusinessTypeId(businessTypeId: string): Promise<ResourcesDto | null> {
    return this.store.get(businessTypeId) ?? null;
  }

  async list(): Promise<ResourcesDto[]> {
    return Array.from(this.store.values());
  }

  async create(businessTypeId: string, input: ResourcesCreateDto): Promise<ResourcesDto> {
    this.store.set(businessTypeId, input);
    return input;
  }

  async update(businessTypeId: string, input: ResourcesUpdateDto): Promise<ResourcesDto | null> {
    const existing = this.store.get(businessTypeId);
    if (!existing) return null;
    const updated: ResourcesDto = { ...existing, ...input };
    this.store.set(businessTypeId, updated);
    return updated;
  }

  async delete(businessTypeId: string): Promise<boolean> {
    return this.store.delete(businessTypeId);
  }
}

export const resourcesRepository: ResourcesRepository = new InMemoryResourcesRepository();
