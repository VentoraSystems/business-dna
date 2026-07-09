/**
 * Every type this feature reuses from elsewhere rather than redeclares,
 * centralized in one file per the pattern `features/business-dna`
 * established (`types/reused-from-business-library.ts`). Nothing here
 * is imported for its own sake — each is used by exactly one Blueprint
 * section in ../types/sections.ts, cross-referenced in README.md's reuse
 * table.
 */
export type {
  FounderFit,
  MarketingDna,
  FinancialDna,
  RiskDna,
  SuccessDna,
  ResourcesSection as BusinessDnaResourcesSection,
} from "@/features/business-dna/types/sections";
export { BusinessDnaKpiKey } from "@/features/business-dna/types/sections/kpis";
export {
  industryTypeSchema,
  businessModelTypeSchema,
  type IndustryType,
  type BusinessModelType,
} from "@/features/business-engine/schemas/enums";
export type {
  CustomerTypeKey,
  PricingModelKey,
  RevenueModelKey,
  SalesMethodKey,
} from "@/features/knowledge-engine/types/vocabularies";
