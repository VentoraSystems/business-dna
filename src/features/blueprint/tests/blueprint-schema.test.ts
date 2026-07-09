import { describe, it, expect } from "vitest";
import { blueprintSchema, blueprintCreateSchema, blueprintUpdateSchema } from "../schemas/blueprint.schema";
import emptyTemplate from "../templates/empty-blueprint.json";

describe("blueprintSchema (v2, 25 sections)", () => {
  it("accepts the empty template JSON as-is", () => {
    expect(blueprintSchema.safeParse(emptyTemplate).success).toBe(true);
  });

  it("has all 25 v2 sections plus the internal-only aiMetadata field", () => {
    expect(Object.keys(emptyTemplate)).toHaveLength(26);
  });

  it("rejects a Blueprint missing a required top-level section", () => {
    const { executiveSummary: _executiveSummary, ...withoutExecutiveSummary } = emptyTemplate;
    expect(blueprintSchema.safeParse(withoutExecutiveSummary).success).toBe(false);
  });

  it("rejects an executive summary with an invalid difficulty", () => {
    const invalid = {
      ...emptyTemplate,
      executiveSummary: { ...emptyTemplate.executiveSummary, difficulty: "extreme" },
    };
    expect(blueprintSchema.safeParse(invalid).success).toBe(false);
  });

  it("rejects a sales system section with an invalid sales method", () => {
    const invalid = { ...emptyTemplate, salesSystem: { salesMethods: ["carrierPigeon"] } };
    expect(blueprintSchema.safeParse(invalid).success).toBe(false);
  });

  it("accepts a valid sales method (reused from knowledge-engine's SalesMethodKey)", () => {
    const valid = { ...emptyTemplate, salesSystem: { salesMethods: ["directSales"] } };
    expect(blueprintSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a 90-Day Action Plan week outside the 1-13 range", () => {
    const invalid = {
      ...emptyTemplate,
      ninetyDayActionPlan: { weeks: [{ weekNumber: 14, actionItemTranslationKeys: [] }], checklistTranslationKeys: [], milestoneTranslationKeys: [] },
    };
    expect(blueprintSchema.safeParse(invalid).success).toBe(false);
  });

  it("accepts a valid 90-Day Action Plan week", () => {
    const valid = {
      ...emptyTemplate,
      ninetyDayActionPlan: { weeks: [{ weekNumber: 1, actionItemTranslationKeys: [] }], checklistTranslationKeys: [], milestoneTranslationKeys: [] },
    };
    expect(blueprintSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a Resources entry with an invalid category (reused from features/resources' ResourceCategoryKey)", () => {
    const invalid = {
      ...emptyTemplate,
      resources: { resources: [{ category: "not-a-real-category", titleTranslationKey: "x" }] },
    };
    expect(blueprintSchema.safeParse(invalid).success).toBe(false);
  });

  it("accepts a valid Resources entry from features/resources' 16-category vocabulary", () => {
    const valid = {
      ...emptyTemplate,
      resources: { resources: [{ category: "books", titleTranslationKey: "x" }] },
    };
    expect(blueprintSchema.safeParse(valid).success).toBe(true);
  });
});

describe("blueprintCreateSchema", () => {
  it("accepts the empty template JSON", () => {
    expect(blueprintCreateSchema.safeParse(emptyTemplate).success).toBe(true);
  });
});

describe("blueprintUpdateSchema", () => {
  it("accepts an empty object (every section optional for an update)", () => {
    expect(blueprintUpdateSchema.safeParse({}).success).toBe(true);
  });
});
