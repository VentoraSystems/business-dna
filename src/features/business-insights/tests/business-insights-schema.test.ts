import { describe, it, expect } from "vitest";
import {
  businessInsightsSchema,
  businessInsightsCreateSchema,
  businessInsightsUpdateSchema,
} from "../schemas/business-insights.schema";
import emptyTemplate from "../templates/empty-business-insights.json";

describe("businessInsightsSchema", () => {
  it("accepts the empty template JSON as-is", () => {
    expect(businessInsightsSchema.safeParse(emptyTemplate).success).toBe(true);
  });

  it("has all 16 sections", () => {
    expect(Object.keys(emptyTemplate)).toHaveLength(16);
  });

  it("rejects a BusinessInsights missing a required top-level section", () => {
    const { hiddenOpportunities: _hiddenOpportunities, ...withoutHiddenOpportunities } = emptyTemplate;
    expect(businessInsightsSchema.safeParse(withoutHiddenOpportunities).success).toBe(false);
  });

  it("rejects an insight item missing its required titleTranslationKey", () => {
    const invalid = { ...emptyTemplate, hiddenRisks: { items: [{ detailTranslationKey: "x" }] } };
    expect(businessInsightsSchema.safeParse(invalid).success).toBe(false);
  });

  it("rejects an industry-scoped item with an invalid industry", () => {
    const invalid = {
      ...emptyTemplate,
      industrySecrets: { items: [{ titleTranslationKey: "x", industry: "not-a-real-industry" }] },
    };
    expect(businessInsightsSchema.safeParse(invalid).success).toBe(false);
  });

  it("accepts an industry-scoped item with a valid industry (reused from business-engine's IndustryType)", () => {
    const valid = {
      ...emptyTemplate,
      marketSignals: { items: [{ titleTranslationKey: "x", industry: "tech" }] },
    };
    expect(businessInsightsSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a relatedResources entry with an invalid category (reused from features/resources' ResourceCategoryKey)", () => {
    const invalid = {
      ...emptyTemplate,
      fastestWins: {
        items: [{ titleTranslationKey: "x", relatedResources: [{ category: "not-a-real-category", titleTranslationKey: "y" }] }],
      },
    };
    expect(businessInsightsSchema.safeParse(invalid).success).toBe(false);
  });

  it("accepts a relatedResources entry from features/resources' 16-category vocabulary", () => {
    const valid = {
      ...emptyTemplate,
      fastestWins: {
        items: [{ titleTranslationKey: "x", relatedResources: [{ category: "books", titleTranslationKey: "y" }] }],
      },
    };
    expect(businessInsightsSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a FAQ item missing its required questionTranslationKey", () => {
    const invalid = { ...emptyTemplate, frequentlyAskedQuestions: { items: [{ answerTranslationKey: "x" }] } };
    expect(businessInsightsSchema.safeParse(invalid).success).toBe(false);
  });
});

describe("businessInsightsCreateSchema / businessInsightsUpdateSchema", () => {
  it("create accepts the empty template", () => {
    expect(businessInsightsCreateSchema.safeParse(emptyTemplate).success).toBe(true);
  });

  it("update accepts an empty object", () => {
    expect(businessInsightsUpdateSchema.safeParse({}).success).toBe(true);
  });
});
