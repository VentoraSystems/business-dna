import { describe, it, expect } from "vitest";
import { financialSchema, financialCreateSchema, financialUpdateSchema } from "../schemas/financial.schema";
import emptyTemplate from "../templates/empty-financial.json";

describe("financialSchema", () => {
  it("accepts the empty template JSON as-is", () => {
    expect(financialSchema.safeParse(emptyTemplate).success).toBe(true);
  });

  it("rejects a Financial missing a required top-level section", () => {
    const { startupCosts: _startupCosts, ...withoutStartupCosts } = emptyTemplate;
    expect(financialSchema.safeParse(withoutStartupCosts).success).toBe(false);
  });

  it("rejects an assumptionsSchema with an invalid assumption type", () => {
    const invalid = {
      ...emptyTemplate,
      pricingAssumptions: { assumptionsSchema: { price: "not-a-real-type" } },
    };
    expect(financialSchema.safeParse(invalid).success).toBe(false);
  });

  it("accepts a valid assumptionsSchema entry (reused from BusinessFinancialTemplate's vocabulary)", () => {
    const valid = {
      ...emptyTemplate,
      pricingAssumptions: { assumptionsSchema: { price: "currency" } },
    };
    expect(financialSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a financial risk with an invalid severity", () => {
    const invalid = {
      ...emptyTemplate,
      financialRisks: { risks: [{ descriptionTranslationKey: "x", severity: "catastrophic" }] },
    };
    expect(financialSchema.safeParse(invalid).success).toBe(false);
  });
});

describe("financialCreateSchema / financialUpdateSchema", () => {
  it("create accepts the empty template", () => {
    expect(financialCreateSchema.safeParse(emptyTemplate).success).toBe(true);
  });

  it("update accepts an empty object", () => {
    expect(financialUpdateSchema.safeParse({}).success).toBe(true);
  });
});
