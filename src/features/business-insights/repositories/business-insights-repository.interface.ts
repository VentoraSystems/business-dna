import type { BusinessInsightsCreateDto, BusinessInsightsDto, BusinessInsightsUpdateDto } from "../dto";

/**
 * Full CRUD data-access contract for `BusinessInsights`, keyed by
 * `businessTypeId` — adapted to this feature's `create`/`update`/`delete`
 * shape for consistency with the other Business Assets repository
 * contracts.
 */
export interface BusinessInsightsRepository {
  findByBusinessTypeId(businessTypeId: string): Promise<BusinessInsightsDto | null>;
  list(): Promise<BusinessInsightsDto[]>;
  create(businessTypeId: string, input: BusinessInsightsCreateDto): Promise<BusinessInsightsDto>;
  update(businessTypeId: string, input: BusinessInsightsUpdateDto): Promise<BusinessInsightsDto | null>;
  delete(businessTypeId: string): Promise<boolean>;
}
