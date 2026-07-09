/**
 * Every type this feature reuses from elsewhere rather than redeclares,
 * centralized in one file per the pattern `features/business-dna`
 * established (`types/reused-from-business-library.ts`). Nothing here
 * is imported for its own sake — each is used by exactly one Blueprint
 * section in ../types/sections.ts, cross-referenced in README.md's reuse
 * table.
 *
 * v2 CHANGE: `BusinessDnaResourcesSection` (business-dna's narrower,
 * 7-category `ResourcesSection`) is no longer imported here — Blueprint
 * v2's "Resources" section (24) now references `features/resources`'
 * `ResourceItem` (the new 16-category canonical superset) instead. See
 * README.md's "Specification History" section for why this is a
 * deliberate v2 change, and a correction of this epic's stated premise
 * that v1 already referenced `features/resources` (it did not — v1
 * aliased business-dna's `ResourcesSection` directly).
 */
export type {
  FounderFit,
  MarketingDna,
  FinancialDna,
  RiskDna,
  SuccessDna,
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
export type { ResourceItem } from "@/features/resources/types/sections";
