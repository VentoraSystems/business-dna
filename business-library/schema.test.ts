import { describe, it, expect } from "vitest";
import { businessGenomeSchema, validateBusinessGenome, BUSINESS_GENOME_SCHEMA_VERSION } from "./schema";
import aiAutomationAgency from "./examples/ai-automation-agency";

describe("Business Genome schema", () => {
  it("validates the AI Automation Agency reference example", () => {
    const result = validateBusinessGenome(aiAutomationAgency);
    expect(result.success).toBe(true);
    expect(result.errors).toBeUndefined();
  });

  it("exposes the current schema version", () => {
    expect(BUSINESS_GENOME_SCHEMA_VERSION).toBe("1.0.0");
  });

  it("rejects a document missing required sections", () => {
    const result = validateBusinessGenome({ schemaVersion: BUSINESS_GENOME_SCHEMA_VERSION });
    expect(result.success).toBe(false);
    expect(result.errors?.length).toBeGreaterThan(0);
  });

  it("rejects a document with an invalid enum value", () => {
    const invalid = {
      ...aiAutomationAgency,
      difficulty: { level: "extreme" }, // not a valid level
    };
    const result = businessGenomeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("rejects a budget where maxInvestment is below minInvestment", () => {
    const invalid = {
      ...aiAutomationAgency,
      budget: { ...aiAutomationAgency.budget, minInvestment: 10000, maxInvestment: 1000 },
    };
    const result = businessGenomeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("matchingMetadata is entirely optional", () => {
    const withoutMetadata = { ...aiAutomationAgency, matchingMetadata: {} };
    const result = businessGenomeSchema.safeParse(withoutMetadata);
    expect(result.success).toBe(true);
  });
});
