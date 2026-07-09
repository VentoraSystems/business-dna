import type { RoadmapCreateDto, RoadmapDto, RoadmapUpdateDto } from "../dto";
import type { RoadmapRepository } from "./roadmap-repository.interface";

/**
 * An EMPTY, in-memory stub — not a `NotImplementedError`-throwing
 * placeholder. Matches features/business-dna's, features/blueprint's,
 * features/financial's, and features/marketing's precedent exactly:
 * there is no Prisma table for `Roadmap` content yet, and this sprint
 * authors zero real content, so the repository itself has nothing wrong
 * with it — the data is just legitimately empty. A future Prisma-backed
 * implementation would sit behind this same interface.
 */
export class InMemoryRoadmapRepository implements RoadmapRepository {
  private readonly store = new Map<string, RoadmapDto>();

  async findByBusinessTypeId(businessTypeId: string): Promise<RoadmapDto | null> {
    return this.store.get(businessTypeId) ?? null;
  }

  async list(): Promise<RoadmapDto[]> {
    return Array.from(this.store.values());
  }

  async create(businessTypeId: string, input: RoadmapCreateDto): Promise<RoadmapDto> {
    this.store.set(businessTypeId, input);
    return input;
  }

  async update(businessTypeId: string, input: RoadmapUpdateDto): Promise<RoadmapDto | null> {
    const existing = this.store.get(businessTypeId);
    if (!existing) return null;
    const updated: RoadmapDto = { ...existing, ...input };
    this.store.set(businessTypeId, updated);
    return updated;
  }

  async delete(businessTypeId: string): Promise<boolean> {
    return this.store.delete(businessTypeId);
  }
}

export const roadmapRepository: RoadmapRepository = new InMemoryRoadmapRepository();
