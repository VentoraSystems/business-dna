import type { BlueprintDto } from "../dto/blueprint.dto";

/**
 * The read-only query surface future consumers (Matching Engine,
 * AI Co-Founder) should import against instead of the full CRUD
 * `BlueprintRepository` — mirrors features/business-dna's
 * `BusinessDnaProfileSource` split between interfaces/ and repositories/.
 *
 * Keyed by `businessTypeId` (not an independent id) — a Blueprint is
 * always one-per-BusinessType, the same relationship
 * `BusinessBlueprintTemplate` already has in business-engine (see
 * `src/features/business-engine/schemas/templates.ts`).
 */
export interface BlueprintSource {
  getByBusinessTypeId(businessTypeId: string): Promise<BlueprintDto | null>;
  list(): Promise<BlueprintDto[]>;
}
