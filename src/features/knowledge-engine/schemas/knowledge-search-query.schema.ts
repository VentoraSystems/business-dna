import { z } from "zod";
import { KnowledgeDomain } from "../types/domain";
import type { KnowledgeSearchQueryDto } from "../dto/knowledge-search-query.dto";

export const knowledgeSearchQuerySchema: z.ZodType<KnowledgeSearchQueryDto> = z.object({
  query: z.string().optional(),
  domain: z.nativeEnum(KnowledgeDomain).optional(),
  tags: z.array(z.string()).optional(),
  limit: z.number().int().positive().optional(),
});
