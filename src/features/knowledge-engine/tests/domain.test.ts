import { describe, it, expect } from "vitest";
import { ALL_KNOWLEDGE_DOMAINS, KnowledgeDomain } from "../types/domain";

describe("KnowledgeDomain", () => {
  it("has the expected 18 members", () => {
    expect(ALL_KNOWLEDGE_DOMAINS).toHaveLength(18);
  });

  it("includes the 3 domains that reuse an existing enum elsewhere", () => {
    expect(ALL_KNOWLEDGE_DOMAINS).toContain(KnowledgeDomain.Industries);
    expect(ALL_KNOWLEDGE_DOMAINS).toContain(KnowledgeDomain.BusinessModels);
    expect(ALL_KNOWLEDGE_DOMAINS).toContain(KnowledgeDomain.Skills);
  });

  it("includes every net-new domain", () => {
    expect(ALL_KNOWLEDGE_DOMAINS).toEqual(
      expect.arrayContaining([
        KnowledgeDomain.RevenueModels,
        KnowledgeDomain.CustomerTypes,
        KnowledgeDomain.PricingModels,
        KnowledgeDomain.MarketingChannels,
        KnowledgeDomain.SalesMethods,
        KnowledgeDomain.DistributionChannels,
        KnowledgeDomain.BusinessTools,
        KnowledgeDomain.AITools,
        KnowledgeDomain.LegalStructures,
        KnowledgeDomain.FundingOptions,
        KnowledgeDomain.BusinessRisks,
        KnowledgeDomain.KPIs,
        KnowledgeDomain.GrowthStrategies,
        KnowledgeDomain.HiringStrategies,
        KnowledgeDomain.BusinessTerminology,
      ])
    );
  });

  it("has no duplicate values", () => {
    expect(new Set(ALL_KNOWLEDGE_DOMAINS).size).toBe(ALL_KNOWLEDGE_DOMAINS.length);
  });
});
