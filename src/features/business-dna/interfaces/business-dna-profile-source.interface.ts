import type { BusinessDnaProfileDto } from "../dto/business-dna-profile.dto";

/**
 * The read-only query surface future consumers (Matching Engine,
 * Blueprint/Financial/Marketing generators, AI Co-Founder) should
 * import against, instead of the full CRUD `BusinessDnaProfileRepository`
 * (see ../repositories/business-dna-profile-repository.interface.ts).
 * Deliberately narrower — a generator reading a profile to ground its
 * output has no business calling `create`/`update`/`delete`.
 */
export interface BusinessDnaProfileSource {
  getById(id: string): Promise<BusinessDnaProfileDto | null>;
  getBySlug(slug: string): Promise<BusinessDnaProfileDto | null>;
  list(filters?: { isActive?: boolean }): Promise<BusinessDnaProfileDto[]>;
}
