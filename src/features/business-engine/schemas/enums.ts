import { z } from "zod";

/**
 * These mirror the enums in prisma/schema.prisma exactly. They're
 * hand-written rather than derived from the Prisma client because Zod
 * schemas need to exist for validation at the API boundary independent of
 * whether `prisma generate` has run — and because a small, explicit list
 * here is what documents "these are the only valid values" to anyone
 * reading the code, same as the schema itself does for the database.
 *
 * If you add a value to an enum in schema.prisma, add it here too — there
 * is intentionally no other place these are defined.
 */

export const businessDifficultySchema = z.enum(["low", "moderate", "high"]);
export const riskLevelSchema = z.enum(["low", "moderate", "high"]);
export const automationLevelSchema = z.enum(["low", "moderate", "high"]);
export const scalabilityLevelSchema = z.enum(["low", "moderate", "high"]);
export const aiResistanceSchema = z.enum(["low", "moderate", "high"]);
export const revenueSpeedSchema = z.enum(["slow", "moderate", "fast"]);

export const businessModelTypeSchema = z.enum([
  "ecommerce",
  "saas",
  "service",
  "marketplace",
  "content",
  "physicalProduct",
  "subscription",
  "agency",
]);

export const industryTypeSchema = z.enum([
  "health",
  "tech",
  "food",
  "education",
  "fashion",
  "finance",
  "travel",
  "sustainability",
  "entertainment",
  "homeServices",
  "professionalServices",
]);

export const lifestyleModeSchema = z.enum(["remote", "hybrid", "inPerson"]);
export const teamSizePreferenceSchema = z.enum(["solo", "small", "large"]);
export const travelRequirementSchema = z.enum(["none", "occasional", "frequent"]);
export const salesChannelSchema = z.enum(["b2b", "b2c", "both"]);
export const onlineOfflineModeSchema = z.enum(["online", "offline", "hybrid"]);

/**
 * Mirrors `prisma/schema.prisma`'s `ResourceType` enum exactly (backs
 * `BusinessResource.resourceType` — a real database column). Per the
 * Architecture Reconciliation sprint's decision on the Resources
 * taxonomy: these values are NOT being unified onto `features/resources`'
 * canonical 16-category `ResourceCategoryKey`, because doing so would
 * require a Prisma migration (a schema.prisma enum change plus a data
 * migration for existing `BusinessResource` rows) — out of scope for a
 * sprint whose brief was reconciling TypeScript-level vocabularies, not
 * touching Prisma. Documented mapping onto `ResourceCategoryKey`
 * instead, so the relationship is explicit even though the values stay
 * independent:
 *
 *   - `"video"`     → `ResourceCategoryKey.YouTube`     (clean match)
 *   - `"checklist"` → `ResourceCategoryKey.Checklists`  (clean match)
 *   - `"article"`   → closest is `ResourceCategoryKey.Blogs` (not exact)
 *   - `"guide"`      → closest is `ResourceCategoryKey.Documents` (not exact)
 *   - `"playbook"`   → closest is `ResourceCategoryKey.Templates` (not exact)
 *
 * See `features/business-dna/types/sections/resources.ts` for the same
 * taxonomy-unification decision applied where a Prisma migration wasn't
 * required (that section's category list is now a genuine subset of
 * `ResourceCategoryKey`, not just a documented mapping).
 */
export const resourceTypeSchema = z.enum(["article", "guide", "video", "playbook", "checklist"]);

export type BusinessDifficulty = z.infer<typeof businessDifficultySchema>;
export type RiskLevel = z.infer<typeof riskLevelSchema>;
export type AutomationLevel = z.infer<typeof automationLevelSchema>;
export type ScalabilityLevel = z.infer<typeof scalabilityLevelSchema>;
export type AIResistance = z.infer<typeof aiResistanceSchema>;
export type RevenueSpeed = z.infer<typeof revenueSpeedSchema>;
export type BusinessModelType = z.infer<typeof businessModelTypeSchema>;
export type IndustryType = z.infer<typeof industryTypeSchema>;
export type LifestyleMode = z.infer<typeof lifestyleModeSchema>;
export type TeamSizePreference = z.infer<typeof teamSizePreferenceSchema>;
export type TravelRequirement = z.infer<typeof travelRequirementSchema>;
export type SalesChannel = z.infer<typeof salesChannelSchema>;
export type OnlineOfflineMode = z.infer<typeof onlineOfflineModeSchema>;
export type ResourceType = z.infer<typeof resourceTypeSchema>;
