import { translationKeySchema } from "@/features/business-engine/schemas/primitives";
import type { ResourceType } from "../reused-from-business-engine";
import { ResourceCategoryKey } from "@/features/resources/types/sections";

export { translationKeySchema };

/**
 * Section 18 — Resources.
 *
 * RECONCILED as of the Architecture Reconciliation sprint: this
 * section's 7 categories are no longer an independently-declared string
 * list — they're now a typed SUBSET of `features/resources`' canonical
 * 16-category `ResourceCategoryKey` (built in a later sprint than this
 * section originally was), referenced by import rather than duplicated.
 * The 7 values themselves are unchanged (`books`/`courses`/`youtube`/
 * `communities`/`templates`/`documents`/`checklists`), so every existing
 * document (e.g. `business-library/technology/ai-automation-agency/business-dna.json`)
 * still validates without any content change — only the *source* of the
 * vocabulary changed, not the vocabulary.
 *
 * Still overlaps two other existing concepts, cross-referenced rather
 * than duplicated where they genuinely match:
 *
 *  - Business Engine's `BusinessResource` (`resourceType`:
 *    article/guide/video/playbook/checklist — see
 *    `business-engine/schemas/enums.ts` → `resourceTypeSchema`, itself
 *    now documenting the same taxonomy-unification decision, subject to
 *    a Prisma-migration constraint that keeps its own values unchanged —
 *    see that file's docstring). Two of this section's 7 categories map
 *    cleanly onto it (`checklists` → `"checklist"`, `youtube` →
 *    `"video"`); the rest (`books`, `courses`, `communities`,
 *    `templates`, `documents`) have no `ResourceType` equivalent, so
 *    `relatedResourceType` below is optional and only set where a real
 *    mapping exists.
 *  - Knowledge Engine's domain list (`src/features/knowledge-engine`) —
 *    none of its 18 domains models "a curated resource" directly; this
 *    section's `translationKey` convention (reused from
 *    `business-engine/schemas/primitives.ts`, the same shape
 *    `BusinessResource` itself uses) is what a future Knowledge Engine
 *    cross-reference would key off of.
 */
export const BUSINESS_DNA_RESOURCE_CATEGORY_KEYS = [
  ResourceCategoryKey.Books,
  ResourceCategoryKey.Courses,
  ResourceCategoryKey.YouTube,
  ResourceCategoryKey.Communities,
  ResourceCategoryKey.Templates,
  ResourceCategoryKey.Documents,
  ResourceCategoryKey.Checklists,
] as const;

export type BusinessDnaResourceCategory = (typeof BUSINESS_DNA_RESOURCE_CATEGORY_KEYS)[number];

export interface BusinessDnaResource {
  category: BusinessDnaResourceCategory;
  /** Points into messages/*.json — same convention as `BusinessResource.translationKey` (business-engine), not a `LocalizedText` pair. */
  translationKey: string;
  /** Set only for `youtube` (→ `"video"`) and `checklists` (→ `"checklist"`) — see this file's top docstring. */
  relatedResourceType?: ResourceType;
  url?: string;
}

export interface ResourcesSection {
  resources: BusinessDnaResource[];
}
