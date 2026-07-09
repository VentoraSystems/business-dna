import { describe, it, expect } from "vitest";
import { knowledgeEntrySchema, knowledgeEntryCreateSchema } from "../schemas/knowledge-entry.schema";
import { knowledgeSearchQuerySchema } from "../schemas/knowledge-search-query.schema";
import { knowledgeSearchResultSchema } from "../schemas/knowledge-search-result.schema";
import { KnowledgeDomain } from "../types/domain";

const validEntry = {
  id: "entry-1",
  domain: KnowledgeDomain.BusinessTerminology,
  key: "runway",
  translationKey: "knowledgeEngine.businessTerminology.runway",
  relatedEntryKeys: ["burnRate"],
  tags: ["finance"],
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  isActive: true,
};

describe("knowledgeEntrySchema", () => {
  it("accepts a well-formed entry with no relatedEnumValue (an open-catalog domain)", () => {
    expect(knowledgeEntrySchema.safeParse(validEntry).success).toBe(true);
  });

  it("rejects an entry missing a required field", () => {
    const { translationKey: _translationKey, ...withoutTranslationKey } = validEntry;
    expect(knowledgeEntrySchema.safeParse(withoutTranslationKey).success).toBe(false);
  });

  it("rejects an entry with an invalid domain", () => {
    const invalid = { ...validEntry, domain: "notARealDomain" };
    expect(knowledgeEntrySchema.safeParse(invalid).success).toBe(false);
  });

  it("rejects an entry whose relatedEnumValue isn't in any known vocabulary", () => {
    const invalid = {
      ...validEntry,
      domain: KnowledgeDomain.Industries,
      relatedEnumValue: "definitely-not-a-real-industry",
    };
    expect(knowledgeEntrySchema.safeParse(invalid).success).toBe(false);
  });
});

describe("knowledgeEntryCreateSchema", () => {
  it("accepts a minimal create input (only the required fields)", () => {
    const input = {
      domain: KnowledgeDomain.BusinessTerminology,
      key: "runway",
      translationKey: "knowledgeEngine.businessTerminology.runway",
    };
    expect(knowledgeEntryCreateSchema.safeParse(input).success).toBe(true);
  });

  it("rejects a create input missing `key`", () => {
    const input = {
      domain: KnowledgeDomain.BusinessTerminology,
      translationKey: "knowledgeEngine.businessTerminology.runway",
    };
    expect(knowledgeEntryCreateSchema.safeParse(input).success).toBe(false);
  });
});

describe("knowledgeSearchQuerySchema", () => {
  it("accepts an empty query object (every field optional)", () => {
    expect(knowledgeSearchQuerySchema.safeParse({}).success).toBe(true);
  });

  it("rejects a non-positive limit", () => {
    expect(knowledgeSearchQuerySchema.safeParse({ limit: 0 }).success).toBe(false);
  });
});

describe("knowledgeSearchResultSchema", () => {
  it("accepts a result containing valid entries", () => {
    const result = { entries: [validEntry], totalCount: 1 };
    expect(knowledgeSearchResultSchema.safeParse(result).success).toBe(true);
  });

  it("rejects a negative totalCount", () => {
    const result = { entries: [], totalCount: -1 };
    expect(knowledgeSearchResultSchema.safeParse(result).success).toBe(false);
  });
});
