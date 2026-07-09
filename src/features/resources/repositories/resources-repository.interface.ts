import type { ResourcesCreateDto, ResourcesDto, ResourcesUpdateDto } from "../dto";

/**
 * Full CRUD data-access contract for `Resources`, keyed by
 * `businessTypeId` — adapted to this feature's `create`/`update`/`delete`
 * shape for consistency with the other Business Assets repository
 * contracts.
 */
export interface ResourcesRepository {
  findByBusinessTypeId(businessTypeId: string): Promise<ResourcesDto | null>;
  list(): Promise<ResourcesDto[]>;
  create(businessTypeId: string, input: ResourcesCreateDto): Promise<ResourcesDto>;
  update(businessTypeId: string, input: ResourcesUpdateDto): Promise<ResourcesDto | null>;
  delete(businessTypeId: string): Promise<boolean>;
}
