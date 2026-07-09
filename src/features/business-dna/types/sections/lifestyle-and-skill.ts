import type { BusinessGenomeLifestyle } from "../reused-from-business-library";

/**
 * Section 5 — Lifestyle DNA. Full reuse: identical shape to
 * `businessGenomeLifestyleSchema` (business-library §21).
 */
export type LifestyleDna = BusinessGenomeLifestyle;

/**
 * Section 6 — Skill DNA. GENUINELY NEW — see README.md's mapping table,
 * "Known conflict: Skill DNA scale," for the full reasoning. In short:
 *
 *  - This section uses a **1-10** integer scale. business-library's
 *    `requiredSkills` (§7) and `ratingScaleSchema` use **1-5**. This is
 *    a real, unresolved scale conflict — values are NOT silently
 *    rescaled between the two; a future decision must reconcile them
 *    (or decide they're allowed to coexist, each serving a different
 *    purpose).
 *  - Of the 12 keys below, 8 share a *name* with business-library's
 *    `skillKeySchema` (sales, marketing, communication, negotiation,
 *    finance, programming, ai, management) — but at the different
 *    scale above, so even the shared names aren't drop-in compatible
 *    values. 4 keys (leadership, operations, technology, automation)
 *    have NO equivalent in `skillKeySchema` at all. Conversely,
 *    `skillKeySchema` has 2 keys (`design`, `content`) with no
 *    equivalent here. This is a partial, not total, name overlap —
 *    documented precisely rather than rounded off to "the same list."
 */
export enum BusinessDnaSkillKey {
  Sales = "sales",
  Marketing = "marketing",
  Leadership = "leadership",
  Communication = "communication",
  Negotiation = "negotiation",
  Finance = "finance",
  Operations = "operations",
  Technology = "technology",
  Automation = "automation",
  AI = "ai",
  Programming = "programming",
  Management = "management",
}

export const ALL_BUSINESS_DNA_SKILL_KEYS: readonly BusinessDnaSkillKey[] = Object.values(BusinessDnaSkillKey);

/** This section's scale — 1-10, deliberately distinct from business-library's 1-5 `ratingScaleSchema`. */
export const BUSINESS_DNA_SKILL_SCALE_MIN = 1;
export const BUSINESS_DNA_SKILL_SCALE_MAX = 10;

export interface BusinessDnaSkillRating {
  key: BusinessDnaSkillKey;
  /** Integer, 1-10 — see this file's top docstring for the scale conflict with business-library. */
  rating: number;
}

export interface SkillDna {
  ratings: BusinessDnaSkillRating[];
}
