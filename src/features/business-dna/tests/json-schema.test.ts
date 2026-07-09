import { describe, it, expect } from "vitest";
import { generateBusinessDnaProfileJsonSchema } from "../schemas/business-dna-profile.json-schema";

describe("generateBusinessDnaProfileJsonSchema", () => {
  it("produces a standard json-schema.org document with all 21 top-level sections", () => {
    const jsonSchema = generateBusinessDnaProfileJsonSchema();
    expect(jsonSchema).toHaveProperty("$schema");

    const definitions = (jsonSchema as { definitions?: Record<string, unknown> }).definitions;
    const root = definitions?.BusinessDnaProfile as { properties?: Record<string, unknown> } | undefined;
    expect(root?.properties && Object.keys(root.properties)).toHaveLength(21);
  });
});
