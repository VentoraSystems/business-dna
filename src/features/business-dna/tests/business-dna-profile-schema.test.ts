import { describe, it, expect } from "vitest";
import {
  businessDnaProfileSchema,
  businessDnaProfileCreateSchema,
  businessDnaProfileUpdateSchema,
} from "../schemas/business-dna-profile.schema";
import emptyTemplate from "../templates/empty-business-dna-profile.json";

describe("businessDnaProfileSchema", () => {
  it("accepts the empty template JSON as-is", () => {
    const result = businessDnaProfileSchema.safeParse(emptyTemplate);
    expect(result.success).toBe(true);
  });

  it("rejects a profile missing a required top-level section", () => {
    const { identity: _identity, ...withoutIdentity } = emptyTemplate;
    expect(businessDnaProfileSchema.safeParse(withoutIdentity).success).toBe(false);
  });

  it("rejects an identity with an invalid status", () => {
    const invalid = {
      ...emptyTemplate,
      identity: { ...emptyTemplate.identity, status: "not-a-real-status" },
    };
    expect(businessDnaProfileSchema.safeParse(invalid).success).toBe(false);
  });

  it("rejects a budget where maxInvestment is below minInvestment (business-library's own refine rule)", () => {
    const invalid = {
      ...emptyTemplate,
      financialDna: {
        ...emptyTemplate.financialDna,
        budget: { minInvestment: 5000, maxInvestment: 1000, currency: "EUR" },
      },
    };
    expect(businessDnaProfileSchema.safeParse(invalid).success).toBe(false);
  });

  it("rejects a Skill DNA rating above 10 (this section's own 1-10 scale)", () => {
    const invalid = {
      ...emptyTemplate,
      skillDna: { ratings: [{ key: "sales", rating: 11 }] },
    };
    expect(businessDnaProfileSchema.safeParse(invalid).success).toBe(false);
  });

  it("accepts a Skill DNA rating of 10 (the top of this section's 1-10 scale, unlike business-library's 1-5)", () => {
    const valid = {
      ...emptyTemplate,
      skillDna: { ratings: [{ key: "sales", rating: 10 }] },
    };
    expect(businessDnaProfileSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a marketing strategy with zero channels (business-library's own min(1) rule)", () => {
    const invalid = {
      ...emptyTemplate,
      marketingDna: {
        ...emptyTemplate.marketingDna,
        marketingStrategy: { ...emptyTemplate.marketingDna.marketingStrategy, channels: [] },
      },
    };
    expect(businessDnaProfileSchema.safeParse(invalid).success).toBe(false);
  });
});

describe("businessDnaProfileCreateSchema", () => {
  it("accepts the empty template JSON (a full profile is what create() expects)", () => {
    expect(businessDnaProfileCreateSchema.safeParse(emptyTemplate).success).toBe(true);
  });
});

describe("businessDnaProfileUpdateSchema", () => {
  it("accepts an empty object (every section optional for an update)", () => {
    expect(businessDnaProfileUpdateSchema.safeParse({}).success).toBe(true);
  });

  it("accepts updating a single section", () => {
    const partial = { skillDna: { ratings: [{ key: "leadership", rating: 7 }] } };
    expect(businessDnaProfileUpdateSchema.safeParse(partial).success).toBe(true);
  });
});
