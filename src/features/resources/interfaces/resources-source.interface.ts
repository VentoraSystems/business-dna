import type { ResourcesDto } from "../dto/resources.dto";

/**
 * The read-only query surface future consumers (Matching Engine,
 * AI Co-Founder) should import against instead of the full CRUD
 * `ResourcesRepository` — mirrors the other Business Assets features'
 * `*Source` split between interfaces/ and repositories/.
 *
 * Keyed by `businessTypeId` (not an independent id) — a Resources
 * document is one-per-BusinessType, the same relationship the other
 * Business Assets have to their BusinessType.
 */
export interface ResourcesSource {
  getByBusinessTypeId(businessTypeId: string): Promise<ResourcesDto | null>;
  list(): Promise<ResourcesDto[]>;
}
