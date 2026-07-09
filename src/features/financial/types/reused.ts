/**
 * Every type this feature reuses from elsewhere rather than redeclares.
 * See README.md's reuse table for how each is used.
 */
export {
  financialAssumptionTypeSchema,
  type FinancialAssumptionType,
} from "@/features/business-engine/schemas/templates";
export type { FinancialDna } from "@/features/business-dna/types/sections";
export { BusinessDnaKpiKey } from "@/features/business-dna/types/sections/kpis";
