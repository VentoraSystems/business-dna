import { z } from "zod";
import { KnowledgeDomain } from "../types/domain";
import {
  industryTypeSchema,
  businessModelTypeSchema,
  skillKeySchema,
} from "../types/reused-vocabularies";
import {
  CUSTOMER_TYPE_KEYS,
  DISTRIBUTION_CHANNEL_KEYS,
  FUNDING_OPTION_KEYS,
  LEGAL_STRUCTURE_KEYS,
  MARKETING_CHANNEL_KEYS,
  PRICING_MODEL_KEYS,
  REVENUE_MODEL_KEYS,
  SALES_METHOD_KEYS,
} from "../types/vocabularies";
import type { KnowledgeEntryCreateDto, KnowledgeEntryDto } from "../dto/knowledge-entry.dto";

/**
 * Every schema `KnowledgeEntry.relatedEnumValue` can validate against —
 * the 3 reused enums plus this feature's 8 net-new closed vocabularies.
 * Mirrors `KnowledgeRelatedEnumValue` in ../types/knowledge-entry.ts
 * exactly; the `z.ZodType<T>` annotations below on the entry schemas
 * catch it if the two ever drift.
 */
export const knowledgeRelatedEnumValueSchema = z.union([
  industryTypeSchema,
  businessModelTypeSchema,
  skillKeySchema,
  z.enum(REVENUE_MODEL_KEYS),
  z.enum(CUSTOMER_TYPE_KEYS),
  z.enum(PRICING_MODEL_KEYS),
  z.enum(MARKETING_CHANNEL_KEYS),
  z.enum(SALES_METHOD_KEYS),
  z.enum(DISTRIBUTION_CHANNEL_KEYS),
  z.enum(LEGAL_STRUCTURE_KEYS),
  z.enum(FUNDING_OPTION_KEYS),
]);

export const knowledgeEntrySchema: z.ZodType<KnowledgeEntryDto> = z.object({
  id: z.string().min(1),
  domain: z.nativeEnum(KnowledgeDomain),
  key: z.string().min(1),
  translationKey: z.string().min(1),
  relatedEntryKeys: z.array(z.string()),
  relatedEnumValue: knowledgeRelatedEnumValueSchema.optional(),
  tags: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
  isActive: z.boolean(),
});

export const knowledgeEntryCreateSchema: z.ZodType<KnowledgeEntryCreateDto> = z.object({
  domain: z.nativeEnum(KnowledgeDomain),
  key: z.string().min(1),
  translationKey: z.string().min(1),
  relatedEntryKeys: z.array(z.string()).optional(),
  relatedEnumValue: knowledgeRelatedEnumValueSchema.optional(),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});
