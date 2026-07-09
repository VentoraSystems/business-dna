import { describe, it, expect } from "vitest";
import { blueprintSchema, blueprintCreateSchema, blueprintUpdateSchema } from "../schemas/blueprint.schema";
import emptyTemplate from "../templates/empty-blueprint.json";

describe("blueprintSchema", () => {
  it("accepts the empty template JSON as-is", () => {
    expect(blueprintSchema.safeParse(emptyTemplate).success).toBe(true);
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

  it("rejects a sales section with an invalid sales method", () => {
    const invalid = { ...emptyTemplate, sales: { salesMethods: ["carrierPigeon"] } };
    expect(blueprintSchema.safeParse(invalid).success).toBe(false);
  });

  it("accepts a valid sales method (reused from knowledge-engine's SalesMethodKey)", () => {
    const valid = { ...emptyTemplate, sales: { salesMethods: ["directSales"] } };
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
