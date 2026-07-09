import { MatchingDimension } from "@/features/matching-engine/scoring/dimensions";
import type {
  DifficultyLevel,
  DnaArchetypeKey,
  RevenueSpeed,
  ScalabilityLevel,
  WorkStyleKey,
} from "./config";
import { GROWTH_OPPORTUNITY_IDS, OPPORTUNITY_SAMPLE_IDS, STRENGTH_IDS } from "./config";

/**
 * PLACEHOLDER DATA — UI scaffolding only.
 *
 * Nothing on this page is computed by the Matching Engine or the Business
 * Genome Library. Every number and key below is a hand-picked sample used
 * to render the "Entrepreneur DNA Results" layout before real scoring
 * exists. Replace this object wholesale once assessment scoring and
 * business matching are implemented — do not creep real logic in here.
 */
export interface MockDnaResults {
  primaryArchetype: DnaArchetypeKey;
  compatibilityScore: number;
  confidenceScore: number;
  dnaProfile: { key: DnaArchetypeKey; score: number }[];
  strengths: (typeof STRENGTH_IDS)[number][];
  growthOpportunities: (typeof GROWTH_OPPORTUNITY_IDS)[number][];
  workStyle: { key: WorkStyleKey; score: number }[];
  opportunities: {
    id: (typeof OPPORTUNITY_SAMPLE_IDS)[number];
    compatibility: number;
    difficulty: DifficultyLevel;
    budgetMin: number;
    budgetMax: number;
    revenueSpeed: RevenueSpeed;
    scalability: ScalabilityLevel;
  }[];
}

export const MOCK_DNA_RESULTS: MockDnaResults = {
  primaryArchetype: "visionary",
  compatibilityScore: 82,
  confidenceScore: 74,
  dnaProfile: [
    { key: "builder", score: 64 },
    { key: "visionary", score: 91 },
    { key: "operator", score: 58 },
    { key: "creator", score: 77 },
    { key: "seller", score: 69 },
    { key: "leader", score: 72 },
    { key: "analyst", score: 55 },
  ],
  strengths: [...STRENGTH_IDS],
  growthOpportunities: [...GROWTH_OPPORTUNITY_IDS],
  workStyle: [
    { key: MatchingDimension.Risk, score: 70 },
    { key: MatchingDimension.Leadership, score: 65 },
    { key: MatchingDimension.CommunicationStyle, score: 80 },
    { key: MatchingDimension.TechnicalAbility, score: 50 },
    { key: MatchingDimension.Creativity, score: 88 },
    { key: "automationAffinity", score: 60 },
    { key: "businessExperience", score: 40 },
    { key: "timeAvailability", score: 75 },
  ],
  opportunities: [
    {
      id: "sample1",
      compatibility: 88,
      difficulty: "medium",
      budgetMin: 5_000,
      budgetMax: 15_000,
      revenueSpeed: "fast",
      scalability: "high",
    },
    {
      id: "sample2",
      compatibility: 76,
      difficulty: "low",
      budgetMin: 1_000,
      budgetMax: 5_000,
      revenueSpeed: "moderate",
      scalability: "medium",
    },
    {
      id: "sample3",
      compatibility: 69,
      difficulty: "high",
      budgetMin: 20_000,
      budgetMax: 50_000,
      revenueSpeed: "slow",
      scalability: "high",
    },
  ],
};
