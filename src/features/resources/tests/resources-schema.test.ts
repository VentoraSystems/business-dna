import { describe, it, expect } from "vitest";
import { resourcesSchema, resourcesCreateSchema, resourcesUpdateSchema } from "../schemas/resources.schema";
import emptyTemplate from "../templates/empty-resources.json";

describe("resourcesSchema", () => {
  it("accepts the empty template JSON as-is", () => {
    expect(resourcesSchema.safeParse(emptyTemplate).success).toBe(true);
  });

  it("rejects a Resources missing the required top-level aiMetadata key", () => {
    const { aiMetadata: _aiMetadata, ...withoutAiMetadata } = emptyTemplate;
    expect(resourcesSchema.safeParse(withoutAiMetadata).success).toBe(false);
  });

  it("rejects a resource item with an invalid category", () => {
    const invalid = {
      ...emptyTemplate,
      resources: [{ category: "not-a-real-category", titleTranslationKey: "x" }],
    };
    expect(resourcesSchema.safeParse(invalid).success).toBe(false);
  });

  it("accepts a resource item from all 16 categories", () => {
    const valid = {
      ...emptyTemplate,
      resources: [
        "books",
        "courses",
        "communities",
        "podcasts",
        "youtube",
        "newsletters",
        "blogs",
        "templates",
        "checklists",
        "software",
        "aiTools",
        "promptLibraries",
        "documents",
        "certifications",
        "events",
        "experts",
      ].map((category) => ({ category, titleTranslationKey: "x" })),
    };
    expect(resourcesSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a resource item missing its required titleTranslationKey", () => {
    const invalid = {
      ...emptyTemplate,
      resources: [{ category: "books" }],
    };
    expect(resourcesSchema.safeParse(invalid).success).toBe(false);
  });
});

describe("resourcesCreateSchema / resourcesUpdateSchema", () => {
  it("create accepts the empty template", () => {
    expect(resourcesCreateSchema.safeParse(emptyTemplate).success).toBe(true);
  });

  it("update accepts an empty object", () => {
    expect(resourcesUpdateSchema.safeParse({}).success).toBe(true);
  });
});
