import type { KnowledgeDomain } from "../types/domain";
import type { KnowledgeEntry, KnowledgeRelatedEnumValue } from "../types/knowledge-entry";

/**
 * The entry shape as returned to callers — identical to `KnowledgeEntry`
 * (types/knowledge-entry.ts). Kept as its own named export because this
 * sprint's spec calls out `KnowledgeEntryDto` specifically, and to give
 * `../schemas/knowledge-entry.schema.ts` a DTO-named type to validate
 * against, per the dto/ + schemas/ split explanation-engine established.
 */
export type KnowledgeEntryDto = KnowledgeEntry;

/**
 * Input to create a new entry. `id`/`createdAt`/`updatedAt` are assigned
 * by a (future) repository, not supplied by the caller — same pattern as
 * `BusinessMatchResultCreateInput` in business-engine/schemas/matching.ts.
 */
export interface KnowledgeEntryCreateDto {
  domain: KnowledgeDomain;
  key: string;
  translationKey: string;
  relatedEntryKeys?: string[];
  relatedEnumValue?: KnowledgeRelatedEnumValue;
  tags?: string[];
  isActive?: boolean;
}
