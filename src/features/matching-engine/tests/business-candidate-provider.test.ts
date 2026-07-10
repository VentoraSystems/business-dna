import { describe, it, expect } from "vitest";
import { RepositoryBusinessCandidateProvider } from "../services/business-candidate-provider";
import { MatchingDimension } from "../scoring/dimensions";
import type { BusinessRepository } from "@/features/business-engine/repositories/business-repository";
import type { FullBusinessType } from "@/features/business-engine/types/business-type";

/** A minimal-but-representative FullBusinessType fixture, so this test never touches a real database. */
function makeFullBusinessType(overrides: Partial<FullBusinessType> = {}): FullBusinessType {
  return {
    id: "bt_1",
    slug: "example",
    translationKey: "businessTypes.example",
    categoryId: "cat_1",
    category: {
      id: "cat_1",
      slug: "technology-services",
      translationKey: "businessCategories.technologyServices",
      industryId: "ind_1",
      icon: null,
      sortOrder: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      industry: {
        id: "ind_1",
        code: "tech",
        slug: "tech",
        translationKey: "businessIndustries.tech",
        icon: null,
        sortOrder: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
    businessModel: "service",
    difficulty: "high",
    automationLevel: "low",
    scalabilityLevel: "moderate",
    aiResistance: "moderate",
    isActive: true,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    lifestyle: {
      id: "life_1",
      businessTypeId: "bt_1",
      workMode: "hybrid",
      travelRequirement: "none",
      teamSize: "small",
      salesChannel: "b2b",
      onlineOffline: "online",
      minWeeklyHours: 40,
      maxWeeklyHours: 55,
      freedomLevel: 2,
    },
    risk: { id: "risk_1", businessTypeId: "bt_1", riskLevel: "moderate", failureImpact: null, requiredConfidence: null },
    budget: {
      id: "budget_1",
      businessTypeId: "bt_1",
      minInvestment: 15_000,
      maxInvestment: 30_000,
      currency: "EUR",
      ongoingMonthlyCostMin: 6_000,
      ongoingMonthlyCostMax: 15_000,
    },
    revenue: {
      id: "rev_1",
      businessTypeId: "bt_1",
      targetMonthlyIncomeMin: 15_000,
      targetMonthlyIncomeMax: 45_000,
      revenueSpeed: "moderate",
    },
    timeline: { id: "tl_1", businessTypeId: "bt_1", timeToFirstCustomerWeeks: null, timeToBreakEvenMonths: 10, timeToScaleMonths: null },
    requirements: [],
    advantages: [],
    disadvantages: [],
    skills: [
      {
        id: "bs_1",
        businessTypeId: "bt_1",
        skillId: "skill_programming",
        importance: 5,
        skill: { id: "skill_programming", key: "programming", translationKey: "businessSkills.programming", createdAt: new Date() },
      },
      {
        id: "bs_2",
        businessTypeId: "bt_1",
        skillId: "skill_management",
        importance: 4,
        skill: { id: "skill_management", key: "management", translationKey: "businessSkills.management", createdAt: new Date() },
      },
      {
        id: "bs_3",
        businessTypeId: "bt_1",
        skillId: "skill_communication",
        importance: 4,
        skill: { id: "skill_communication", key: "communication", translationKey: "businessSkills.communication", createdAt: new Date() },
      },
    ],
    tags: [],
    tools: [],
    resources: [],
    ...overrides,
  } as FullBusinessType;
}

/** A minimal fake so this test never touches a real database. */
function createFakeRepository(rows: FullBusinessType[]): BusinessRepository {
  return {
    findFullById: async () => null,
    findFullBySlug: async () => null,
    list: async () => rows as never,
    listFull: async () => rows,
    count: async () => rows.length,
    listCategories: async () => [],
    listIndustries: async () => [],
  };
}

describe("RepositoryBusinessCandidateProvider", () => {
  it("returns an empty array when the catalog has no published BusinessTypes", async () => {
    const provider = new RepositoryBusinessCandidateProvider(createFakeRepository([]));
    const candidates = await provider.getCandidates();
    expect(candidates).toEqual([]);
  });

  it("maps a FullBusinessType into a scorable BusinessCandidate", async () => {
    const provider = new RepositoryBusinessCandidateProvider(createFakeRepository([makeFullBusinessType()]));
    const [candidate] = await provider.getCandidates();
    if (!candidate) throw new Error("expected a candidate");

    expect(candidate.businessTypeId).toBe("bt_1");
    expect(candidate.slug).toBe("example");
    expect(candidate.industryCode).toBe("tech");
    expect(candidate.businessModelCode).toBe("service");
    expect(candidate.skillKeys.sort()).toEqual(["communication", "management", "programming"]);

    // budget: midpoint (22500) normalized against [0, 50000] = 0.45
    expect(candidate.dimensionProfile[MatchingDimension.Budget]).toBeCloseTo(0.45, 5);
    // risk: "moderate" -> 0.5
    expect(candidate.dimensionProfile[MatchingDimension.Risk]).toBe(0.5);
    // location: "hybrid" -> 0.5
    expect(candidate.dimensionProfile[MatchingDimension.Location]).toBe(0.5);
    // workStyle: "online" -> 0
    expect(candidate.dimensionProfile[MatchingDimension.WorkStyle]).toBe(0);
    // leadership: "management" importance 4/5 normalized [1,5] = 0.75
    expect(candidate.dimensionProfile[MatchingDimension.Leadership]).toBeCloseTo(0.75, 5);
    // communicationStyle: "communication" importance 4/5 normalized [1,5] = 0.75
    expect(candidate.dimensionProfile[MatchingDimension.CommunicationStyle]).toBeCloseTo(0.75, 5);
    // technicalAbility: only "programming" present (5/5 -> 1), "ai" absent — average of the present ones.
    expect(candidate.dimensionProfile[MatchingDimension.TechnicalAbility]).toBeCloseTo(1, 5);
    // creativity: neither "design" nor "content" present -> dimension omitted entirely.
    expect(candidate.dimensionProfile[MatchingDimension.Creativity]).toBeUndefined();
    // salesOrientation: "sales" not present -> omitted.
    expect(candidate.dimensionProfile[MatchingDimension.SalesOrientation]).toBeUndefined();
  });

  it("omits a dimension rather than guessing when its source data is null", async () => {
    const businessType = makeFullBusinessType({ timeline: null, risk: null, budget: null, lifestyle: null });
    const provider = new RepositoryBusinessCandidateProvider(createFakeRepository([businessType]));
    const [candidate] = await provider.getCandidates();

    expect(candidate?.dimensionProfile[MatchingDimension.Timeline]).toBeUndefined();
    expect(candidate?.dimensionProfile[MatchingDimension.Risk]).toBeUndefined();
    expect(candidate?.dimensionProfile[MatchingDimension.Budget]).toBeUndefined();
    expect(candidate?.dimensionProfile[MatchingDimension.Lifestyle]).toBeUndefined();
    expect(candidate?.dimensionProfile[MatchingDimension.Location]).toBeUndefined();
  });
});
