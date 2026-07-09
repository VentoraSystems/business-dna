import type { RoadmapCreateDto, RoadmapDto, RoadmapUpdateDto } from "../dto";

/**
 * Full CRUD data-access contract for `Roadmap`, keyed by
 * `businessTypeId` — adapted to this feature's `create`/`update`/`delete`
 * shape for consistency with the other Business Assets repository
 * contracts.
 */
export interface RoadmapRepository {
  findByBusinessTypeId(businessTypeId: string): Promise<RoadmapDto | null>;
  list(): Promise<RoadmapDto[]>;
  create(businessTypeId: string, input: RoadmapCreateDto): Promise<RoadmapDto>;
  update(businessTypeId: string, input: RoadmapUpdateDto): Promise<RoadmapDto | null>;
  delete(businessTypeId: string): Promise<boolean>;
}
