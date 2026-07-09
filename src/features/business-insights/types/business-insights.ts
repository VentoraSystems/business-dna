import type {
  BestPractices,
  BusinessInsightsAiMetadata,
  CommonMistakes,
  FailureStories,
  FastestWins,
  FounderAdvice,
  FrequentlyAskedQuestions,
  HiddenCosts,
  HiddenOpportunities,
  HiddenRisks,
  IndustrySecrets,
  MarketSignals,
  Myths,
  Patterns,
  ScalingAdvice,
  SuccessStories,
} from "./sections";

/** Top-level Business Insights document — the "soft knowledge" layer, distinct from features/business-dna's strict typed contract. See README.md's "Purpose". */
export interface BusinessInsights {
  hiddenOpportunities: HiddenOpportunities;
  hiddenRisks: HiddenRisks;
  commonMistakes: CommonMistakes;
  fastestWins: FastestWins;
  scalingAdvice: ScalingAdvice;
  founderAdvice: FounderAdvice;
  patterns: Patterns;
  industrySecrets: IndustrySecrets;
  hiddenCosts: HiddenCosts;
  marketSignals: MarketSignals;
  successStories: SuccessStories;
  failureStories: FailureStories;
  frequentlyAskedQuestions: FrequentlyAskedQuestions;
  myths: Myths;
  bestPractices: BestPractices;
  aiMetadata: BusinessInsightsAiMetadata;
}
