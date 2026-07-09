import type { KnowledgeDomain } from "../types/domain";

/** A search request against the Knowledge Engine. No matching/ranking logic exists yet — this only describes the request shape. */
export interface KnowledgeSearchQueryDto {
  /** Free-text search string — how it's matched (exact, fuzzy, full-text) is left to a future implementation. */
  query?: string;
  domain?: KnowledgeDomain;
  tags?: string[];
  limit?: number;
}
