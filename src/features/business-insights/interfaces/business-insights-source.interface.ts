import type { BusinessInsightsDto } from "../dto/business-insights.dto";

/**
 * The read-only query surface future consumers (Matching Engine,
 * AI Co-Founder) should import against instead of the full CRUD
 * `BusinessInsightsRepository` — mirrors the other Business Assets
 * features' `*Source` split between interfaces/ and repositories/.
 *
 * Keyed by `businessTypeId` (not an independent id) — a Business
 * Insights document is one-per-BusinessType, the same relationship the
 * other Business Assets have to their BusinessType.
 */
export interface BusinessInsightsSource {
  getByBusinessTypeId(businessTypeId: string): Promise<BusinessInsightsDto | null>;
  list(): Promise<BusinessInsightsDto[]>;
}
