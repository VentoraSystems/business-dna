import type { MarketingDto } from "../dto/marketing.dto";

/**
 * The read-only query surface future consumers (Matching Engine,
 * AI Co-Founder) should import against instead of the full CRUD
 * `MarketingRepository` — mirrors features/blueprint's and
 * features/financial's `*Source` split between interfaces/ and
 * repositories/.
 *
 * Keyed by `businessTypeId` (not an independent id) — a Marketing
 * document is one-per-BusinessType, the same relationship
 * `BusinessMarketingTemplate` already has in business-engine (see
 * `src/features/business-engine/schemas/templates.ts`).
 */
export interface MarketingSource {
  getByBusinessTypeId(businessTypeId: string): Promise<MarketingDto | null>;
  list(): Promise<MarketingDto[]>;
}
