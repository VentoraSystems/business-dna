import type { MarketingCreateDto, MarketingDto, MarketingUpdateDto } from "../dto";

/**
 * Full CRUD data-access contract for `Marketing`, keyed by
 * `businessTypeId` — mirrors business-engine's `BusinessMarketingTemplate`
 * relationship, adapted to this feature's `create`/`update`/`delete`
 * shape for consistency with features/blueprint's and features/financial's
 * repository contracts.
 */
export interface MarketingRepository {
  findByBusinessTypeId(businessTypeId: string): Promise<MarketingDto | null>;
  list(): Promise<MarketingDto[]>;
  create(businessTypeId: string, input: MarketingCreateDto): Promise<MarketingDto>;
  update(businessTypeId: string, input: MarketingUpdateDto): Promise<MarketingDto | null>;
  delete(businessTypeId: string): Promise<boolean>;
}
