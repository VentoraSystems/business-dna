import type { KnowledgeDomain } from "../types/domain";
import type { KnowledgeEntryCreateDto, KnowledgeEntryDto } from "../dto/knowledge-entry.dto";
import type { KnowledgeSearchQueryDto } from "../dto/knowledge-search-query.dto";
import type { KnowledgeSearchResultDto } from "../dto/knowledge-search-result.dto";

/**
 * Pure data access contract for `KnowledgeEntry` rows. No implementation
 * exists yet — nothing calls this, nothing implements it, and unlike
 * matching-engine/explanation-engine there is deliberately no
 * `Placeholder*` class here either (this sprint's spec asks for
 * repository interfaces only). A future Prisma-backed implementation
 * (mirroring `PrismaBusinessMatchRepository` in
 * features/business-engine/repositories/business-match-repository.ts)
 * would sit behind this interface without `KnowledgeEngine`'s own
 * contract needing to change.
 */
export interface KnowledgeRepository {
  findByDomain(domain: KnowledgeDomain): Promise<KnowledgeEntryDto[]>;
  findByKey(domain: KnowledgeDomain, key: string): Promise<KnowledgeEntryDto | null>;
  search(query: KnowledgeSearchQueryDto): Promise<KnowledgeSearchResultDto>;
  findRelated(entryId: string): Promise<KnowledgeEntryDto[]>;
  create(input: KnowledgeEntryCreateDto): Promise<KnowledgeEntryDto>;
}
