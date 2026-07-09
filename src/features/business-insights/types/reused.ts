/**
 * Every type this feature reuses from elsewhere rather than redeclares.
 * See README.md's reuse table.
 *
 * - `IndustryType` (business-engine) — reused so "Industry Secrets" and
 *   "Market Signals" entries can be scoped to a real industry instead of
 *   inventing a parallel industry list.
 * - `ResourceItem` (features/resources, built last sprint) — reused so
 *   any resource-like reference anywhere in Business Insights points at
 *   that feature's 16-category canonical vocabulary instead of a new
 *   taxonomy.
 */
export { industryTypeSchema, type IndustryType } from "@/features/business-engine/schemas/enums";
export type { ResourceItem } from "@/features/resources/types/sections";
