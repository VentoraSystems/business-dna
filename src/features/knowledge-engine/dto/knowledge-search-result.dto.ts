import type { KnowledgeEntryDto } from "./knowledge-entry.dto";

/** The response shape for a KnowledgeSearchQueryDto. */
export interface KnowledgeSearchResultDto {
  entries: KnowledgeEntryDto[];
  totalCount: number;
}
