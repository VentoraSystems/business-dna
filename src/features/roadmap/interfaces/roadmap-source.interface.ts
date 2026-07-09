import type { RoadmapDto } from "../dto/roadmap.dto";

/**
 * The read-only query surface future consumers (Matching Engine,
 * AI Co-Founder) should import against instead of the full CRUD
 * `RoadmapRepository` — mirrors features/blueprint's, features/financial's,
 * and features/marketing's `*Source` split between interfaces/ and
 * repositories/.
 *
 * Keyed by `businessTypeId` (not an independent id) — a Roadmap is
 * one-per-BusinessType, the same relationship the other Business Assets
 * have to their BusinessType.
 */
export interface RoadmapSource {
  getByBusinessTypeId(businessTypeId: string): Promise<RoadmapDto | null>;
  list(): Promise<RoadmapDto[]>;
}
