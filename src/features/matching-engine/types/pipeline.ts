/**
 * The matching pipeline, as a sequence of named stages. This exists so
 * every part of the engine — logging, error context (see
 * NotImplementedError), tests, and the README — refers to the same stage
 * names instead of ad-hoc strings.
 *
 *   Assessment Answers
 *         │
 *         ▼
 *   Normalization                 → AssessmentNormalizer.normalize()
 *         │
 *         ▼
 *   Feature Extraction            → AssessmentNormalizer.extractFeatures()
 *         │
 *         ▼
 *   Business Candidate Retrieval  → BusinessCandidateProvider.getCandidates()
 *         │
 *         ▼
 *   Weighted Scoring              → ScoreCalculator.calculateDimensionScores()
 *         │
 *         ▼
 *   Compatibility Calculation     → CompatibilityCalculator.calculate()
 *         │                         (RuleEngine.evaluate() also runs here)
 *         ▼
 *   Ranking                       → RankingEngine.rank()
 *         │
 *         ▼
 *   AI Explanation                → ExplanationGenerator.*
 *         │
 *         ▼
 *   Business Match Results        → CompatibilityResult[] (see ../types/compatibility-result)
 */
export enum MatchingPipelineStage {
  AssessmentAnswers = "assessmentAnswers",
  Normalization = "normalization",
  FeatureExtraction = "featureExtraction",
  BusinessCandidateRetrieval = "businessCandidateRetrieval",
  WeightedScoring = "weightedScoring",
  CompatibilityCalculation = "compatibilityCalculation",
  Ranking = "ranking",
  AIExplanation = "aiExplanation",
  BusinessMatchResults = "businessMatchResults",
}

export const MATCHING_PIPELINE_STAGE_ORDER: readonly MatchingPipelineStage[] = [
  MatchingPipelineStage.AssessmentAnswers,
  MatchingPipelineStage.Normalization,
  MatchingPipelineStage.FeatureExtraction,
  MatchingPipelineStage.BusinessCandidateRetrieval,
  MatchingPipelineStage.WeightedScoring,
  MatchingPipelineStage.CompatibilityCalculation,
  MatchingPipelineStage.Ranking,
  MatchingPipelineStage.AIExplanation,
  MatchingPipelineStage.BusinessMatchResults,
];
