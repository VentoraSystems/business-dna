import type { KnowledgeDomain } from "../types/domain";
import type { KnowledgeEntryDto } from "../dto/knowledge-entry.dto";
import type { KnowledgeSearchQueryDto } from "../dto/knowledge-search-query.dto";
import type { KnowledgeSearchResultDto } from "../dto/knowledge-search-result.dto";

/**
 * The contract other features (Assessment, Matching, Blueprint,
 * Marketing, Financial Forecast, AI Co-Founder, Roadmaps, Resources —
 * see README.md "Future consumers") will eventually call to look up
 * structured entrepreneurial knowledge.
 *
 * One generic interface over a uniform `KnowledgeEntryDto`, not 17+
 * bespoke per-domain interfaces (one per `KnowledgeDomain` member) — see
 * README.md "Why one generic interface" for the reasoning. No
 * implementation exists yet; this sprint is contracts only.
 */
export interface KnowledgeEngine {
  getEntry(domain: KnowledgeDomain, key: string): Promise<KnowledgeEntryDto | null>;
  searchEntries(query: KnowledgeSearchQueryDto): Promise<KnowledgeSearchResultDto>;
  getRelatedEntries(entryId: string): Promise<KnowledgeEntryDto[]>;
  listDomains(): Promise<KnowledgeDomain[]>;
}
