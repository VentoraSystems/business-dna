import type { BlueprintCreateDto, BlueprintDto, BlueprintUpdateDto } from "../dto";

/**
 * Full CRUD data-access contract for `Blueprint`, keyed by
 * `businessTypeId` — mirrors business-engine's `BlueprintRepository`
 * (`findByBusinessTypeId`/`upsert`/`delete`, see
 * `src/features/business-engine/repositories/blueprint-repository.ts`),
 * adapted to this feature's `create`/`update`/`delete` shape for
 * consistency with features/business-dna's repository contract.
 */
export interface BlueprintRepository {
  findByBusinessTypeId(businessTypeId: string): Promise<BlueprintDto | null>;
  list(): Promise<BlueprintDto[]>;
  create(businessTypeId: string, input: BlueprintCreateDto): Promise<BlueprintDto>;
  update(businessTypeId: string, input: BlueprintUpdateDto): Promise<BlueprintDto | null>;
  delete(businessTypeId: string): Promise<boolean>;
}
