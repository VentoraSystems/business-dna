import type {
  BusinessGenomeMarketingComplexity,
  BusinessGenomeMarketingStrategy,
  BusinessGenomeSalesComplexity,
  BusinessGenomeSalesStrategy,
} from "../reused-from-business-library";

/**
 * Section 11 — Marketing DNA. Full reuse of business-library's
 * `marketingStrategy` (§26) and `marketingComplexity` (§17).
 */
export interface MarketingDna {
  marketingStrategy: BusinessGenomeMarketingStrategy;
  marketingComplexity: BusinessGenomeMarketingComplexity;
}

/**
 * Section 12 — Sales DNA. Full reuse of business-library's
 * `salesStrategy` (§27) and `salesComplexity` (§18).
 */
export interface SalesDna {
  salesStrategy: BusinessGenomeSalesStrategy;
  salesComplexity: BusinessGenomeSalesComplexity;
}
