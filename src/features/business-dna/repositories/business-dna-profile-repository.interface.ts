import type {
  BusinessDnaProfileCreateDto,
  BusinessDnaProfileDto,
  BusinessDnaProfileUpdateDto,
} from "../dto";

export interface BusinessDnaProfileListFilters {
  isActive?: boolean;
}

/**
 * Full CRUD data-access contract for `BusinessDnaProfile` — the
 * write-capable counterpart to
 * `../interfaces/business-dna-profile-source.interface.ts`'s read-only
 * `BusinessDnaProfileSource`. See ./business-dna-profile-repository.ts
 * for this sprint's stub implementation.
 */
export interface BusinessDnaProfileRepository {
  findById(id: string): Promise<BusinessDnaProfileDto | null>;
  findBySlug(slug: string): Promise<BusinessDnaProfileDto | null>;
  list(filters?: BusinessDnaProfileListFilters): Promise<BusinessDnaProfileDto[]>;
  create(input: BusinessDnaProfileCreateDto): Promise<BusinessDnaProfileDto>;
  update(id: string, input: BusinessDnaProfileUpdateDto): Promise<BusinessDnaProfileDto | null>;
  delete(id: string): Promise<boolean>;
}
