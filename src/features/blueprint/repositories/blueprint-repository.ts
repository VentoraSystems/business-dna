import type { BlueprintCreateDto, BlueprintDto, BlueprintUpdateDto } from "../dto";
import type { BlueprintRepository } from "./blueprint-repository.interface";

/**
 * An EMPTY, in-memory stub — not a `NotImplementedError`-throwing
 * placeholder. Matches features/business-dna's precedent exactly (see
 * that feature's README → "Repository: empty implementation, not a
 * throwing one") for the same reason: there is no Prisma table for
 * `Blueprint` content yet, and this sprint authors zero real content, so
 * the repository itself has nothing wrong with it — the data is just
 * legitimately empty. A future Prisma-backed implementation would sit
 * behind this same interface.
 */
export class InMemoryBlueprintRepository implements BlueprintRepository {
  private readonly store = new Map<string, BlueprintDto>();

  async findByBusinessTypeId(businessTypeId: string): Promise<BlueprintDto | null> {
    return this.store.get(businessTypeId) ?? null;
  }

  async list(): Promise<BlueprintDto[]> {
    return Array.from(this.store.values());
  }

  async create(businessTypeId: string, input: BlueprintCreateDto): Promise<BlueprintDto> {
    this.store.set(businessTypeId, input);
    return input;
  }

  async update(businessTypeId: string, input: BlueprintUpdateDto): Promise<BlueprintDto | null> {
    const existing = this.store.get(businessTypeId);
    if (!existing) return null;
    const updated: BlueprintDto = { ...existing, ...input };
    this.store.set(businessTypeId, updated);
    return updated;
  }

  async delete(businessTypeId: string): Promise<boolean> {
    return this.store.delete(businessTypeId);
  }
}

export const blueprintRepository: BlueprintRepository = new InMemoryBlueprintRepository();
