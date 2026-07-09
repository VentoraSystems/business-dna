import { describe, it, expect } from "vitest";
import { knowledgeEntryCreateSchema } from "../schemas/knowledge-entry.schema";
import { KnowledgeDomain } from "../types/domain";
import type { KnowledgeEntryCreateDto } from "../dto/knowledge-entry.dto";
import type { IndustryType, BusinessModelType, SkillKey } from "../types/reused-vocabularies";

/**
 * These aren't "live data" tests — they assert that
 * `KnowledgeEntry.relatedEnumValue` genuinely accepts the imported
 * IndustryType/BusinessModelType/SkillKey values, at both levels:
 *
 *  - Compile time: assigning a real `IndustryType`/`BusinessModelType`/
 *    `SkillKey` value to `relatedEnumValue` below only typechecks because
 *    `KnowledgeRelatedEnumValue` (types/knowledge-entry.ts) includes them
 *    in its union. If a future edit dropped one of the three from that
 *    union, this file would fail `npm run typecheck`, not just this test.
 *  - Runtime: the corresponding Zod schema (which mirrors the same union)
 *    must also accept the same values.
 */
describe("KnowledgeEntry cross-references the reused enums", () => {
  it("accepts a real IndustryType value", () => {
    const industryValue: IndustryType = "tech";
    const entry: KnowledgeEntryCreateDto = {
      domain: KnowledgeDomain.Industries,
      key: "tech-industry-reference",
      translationKey: "knowledgeEngine.industries.tech",
      relatedEnumValue: industryValue,
    };
    expect(knowledgeEntryCreateSchema.safeParse(entry).success).toBe(true);
  });

  it("accepts a real BusinessModelType value", () => {
    const businessModelValue: BusinessModelType = "saas";
    const entry: KnowledgeEntryCreateDto = {
      domain: KnowledgeDomain.BusinessModels,
      key: "saas-business-model-reference",
      translationKey: "knowledgeEngine.businessModels.saas",
      relatedEnumValue: businessModelValue,
    };
    expect(knowledgeEntryCreateSchema.safeParse(entry).success).toBe(true);
  });

  it("accepts a real SkillKey value", () => {
    const skillValue: SkillKey = "marketing";
    const entry: KnowledgeEntryCreateDto = {
      domain: KnowledgeDomain.Skills,
      key: "marketing-skill-reference",
      translationKey: "knowledgeEngine.skills.marketing",
      relatedEnumValue: skillValue,
    };
    expect(knowledgeEntryCreateSchema.safeParse(entry).success).toBe(true);
  });
});
