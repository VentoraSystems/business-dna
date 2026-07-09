import type {
  BusinessDnaProfileCreateDto,
  BusinessDnaProfileDto,
  BusinessDnaProfileUpdateDto,
} from "../dto";
import type {
  BusinessDnaProfileListFilters,
  BusinessDnaProfileRepository,
} from "./business-dna-profile-repository.interface";

/**
 * An EMPTY, in-memory stub — not a `NotImplementedError`-throwing
 * placeholder like matching-engine/explanation-engine's services. See
 * this feature's README → "Why an empty implementation, not a throwing
 * one" for the full reasoning: unlike those features (which model an
 * unimplemented ALGORITHM stage — scoring, ranking, generation), this
 * repository models a content store that legitimately has zero rows
 * today (no Prisma table exists for `BusinessDnaProfile` yet, and this
 * sprint seeds no content). An ever-empty-until-you-create-something
 * in-memory `Map` is the more literal, more useful reading of this
 * sprint's explicit "empty repository implementation" instruction.
 *
 * Never persists anything beyond the process's lifetime — this is
 * scaffolding for tests and future callers to exercise the interface
 * against, not a real datastore. A future Prisma-backed implementation
 * (mirroring `PrismaBusinessMatchRepository` in
 * features/business-engine/repositories/business-match-repository.ts)
 * would replace this without `BusinessDnaProfileRepository`'s contract
 * needing to change.
 */
export class InMemoryBusinessDnaProfileRepository implements BusinessDnaProfileRepository {
  private readonly store = new Map<string, BusinessDnaProfileDto>();

  async findById(id: string): Promise<BusinessDnaProfileDto | null> {
    return this.store.get(id) ?? null;
  }

  async findBySlug(slug: string): Promise<BusinessDnaProfileDto | null> {
    for (const profile of this.store.values()) {
      if (profile.identity.slug === slug) return profile;
    }
    return null;
  }

  async list(filters?: BusinessDnaProfileListFilters): Promise<BusinessDnaProfileDto[]> {
    const all = Array.from(this.store.values());
    if (filters?.isActive === undefined) return all;
    return all.filter((profile) => (profile.identity.status === "published") === filters.isActive);
  }

  async create(input: BusinessDnaProfileCreateDto): Promise<BusinessDnaProfileDto> {
    const profile: BusinessDnaProfileDto = input;
    this.store.set(profile.identity.id, profile);
    return profile;
  }

  async update(id: string, input: BusinessDnaProfileUpdateDto): Promise<BusinessDnaProfileDto | null> {
    const existing = this.store.get(id);
    if (!existing) return null;
    const updated: BusinessDnaProfileDto = { ...existing, ...input };
    this.store.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.store.delete(id);
  }
}

export const businessDnaProfileRepository: BusinessDnaProfileRepository =
  new InMemoryBusinessDnaProfileRepository();
