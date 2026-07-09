import { z } from "zod";
import type { KnowledgeSearchResultDto } from "../dto/knowledge-search-result.dto";
import { knowledgeEntrySchema } from "./knowledge-entry.schema";

export const knowledgeSearchResultSchema: z.ZodType<KnowledgeSearchResultDto> = z.object({
  entries: z.array(knowledgeEntrySchema),
  totalCount: z.number().int().nonnegative(),
});
