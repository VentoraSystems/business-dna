import { describe, it, expect } from "vitest";
import { roadmapSchema, roadmapCreateSchema, roadmapUpdateSchema } from "../schemas/roadmap.schema";
import emptyTemplate from "../templates/empty-roadmap.json";

describe("roadmapSchema", () => {
  it("accepts the empty template JSON as-is", () => {
    expect(roadmapSchema.safeParse(emptyTemplate).success).toBe(true);
  });

  it("has exactly 9 stages in the empty template", () => {
    expect(emptyTemplate.stages).toHaveLength(9);
  });

  it("rejects a Roadmap missing the required top-level aiMetadata key", () => {
    const { aiMetadata: _aiMetadata, ...withoutAiMetadata } = emptyTemplate;
    expect(roadmapSchema.safeParse(withoutAiMetadata).success).toBe(false);
  });

  it("rejects a stage with an invalid stage key", () => {
    const invalid = {
      ...emptyTemplate,
      stages: [{ ...emptyTemplate.stages[0], stage: "idea" }],
    };
    expect(roadmapSchema.safeParse(invalid).success).toBe(false);
  });

  it("accepts a stage with a valid kpis entry (reused from business-dna's BusinessDnaKpiKey)", () => {
    const valid = {
      ...emptyTemplate,
      stages: [{ ...emptyTemplate.stages[0], kpis: ["mrr", "cac"] }],
    };
    expect(roadmapSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a stage with an invalid kpis entry", () => {
    const invalid = {
      ...emptyTemplate,
      stages: [{ ...emptyTemplate.stages[0], kpis: ["not-a-real-kpi"] }],
    };
    expect(roadmapSchema.safeParse(invalid).success).toBe(false);
  });
});

describe("roadmapCreateSchema / roadmapUpdateSchema", () => {
  it("create accepts the empty template", () => {
    expect(roadmapCreateSchema.safeParse(emptyTemplate).success).toBe(true);
  });

  it("update accepts an empty object", () => {
    expect(roadmapUpdateSchema.safeParse({}).success).toBe(true);
  });
});
