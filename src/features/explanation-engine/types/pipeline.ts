/**
 * The explanation pipeline, as a sequence of named stages — mirrors
 * `features/matching-engine/types/pipeline.ts` so both features refer to
 * their stages the same way (logging, error context via
 * `NotImplementedError`, tests, and the README all key off these names
 * instead of ad-hoc strings).
 *
 * Two stages don't have a service of their own, and two services don't
 * map to exactly one stage — both are called out below rather than
 * papered over:
 *
 *   Assessment                    → input only (ExplanationEngineInput.assessmentFeatures);
 *                                    already computed by the Matching Engine, not re-derived here.
 *         │
 *         ▼
 *   Business Genome               → input only (ExplanationEngineInput.businessGenome);
 *                                    read from business-library, not re-derived here.
 *         │
 *         ▼
 *   Dimension Analysis            → no dedicated service; reads
 *                                    ExplanationEngineInput.compatibilityResult.dimensionScores
 *                                    directly, since ScoreCalculator (matching-engine) already
 *                                    computed them. Consumed by the stages below.
 *         │
 *         ▼
 *   Strength Detection            → StrengthAnalyzer.analyze()      → StrengthReason[]
 *         │
 *         ▼
 *   Weakness Detection            → WeaknessAnalyzer.detect()       → DetectedWeakness[]
 *         │
 *         ▼
 *   Growth Analysis               → GrowthOpportunityAnalyzer.analyze() → GrowthArea[]
 *         │
 *         ▼
 *   Warning Analysis              → WarningAnalyzer.analyze()       → Warning[]
 *                                    ContextualExplainer.explainRisk/explainFinancials/
 *                                    explainTimeline() also run here — see README
 *                                    "Judgement calls" for why these three ride along
 *                                    with this stage instead of getting their own.
 *         │
 *         ▼
 *   Action Planning                → ActionPlanner.plan()            → RecommendedAction[]
 *         │
 *         ▼
 *   Explanation Result             → ExplanationEngine assembles everything above, plus:
 *                                    SummaryBuilder.build()          → overallSummary, matchReasons[]
 *                                    ConfidenceExplainer.explain()   → confidenceExplanation
 *                                    → ExplanationResult (see ../dto/explanation-result.dto)
 */
export enum ExplanationPipelineStage {
  Assessment = "assessment",
  BusinessGenome = "businessGenome",
  DimensionAnalysis = "dimensionAnalysis",
  StrengthDetection = "strengthDetection",
  WeaknessDetection = "weaknessDetection",
  GrowthAnalysis = "growthAnalysis",
  WarningAnalysis = "warningAnalysis",
  ActionPlanning = "actionPlanning",
  ExplanationResult = "explanationResult",
}

export const EXPLANATION_PIPELINE_STAGE_ORDER: readonly ExplanationPipelineStage[] = [
  ExplanationPipelineStage.Assessment,
  ExplanationPipelineStage.BusinessGenome,
  ExplanationPipelineStage.DimensionAnalysis,
  ExplanationPipelineStage.StrengthDetection,
  ExplanationPipelineStage.WeaknessDetection,
  ExplanationPipelineStage.GrowthAnalysis,
  ExplanationPipelineStage.WarningAnalysis,
  ExplanationPipelineStage.ActionPlanning,
  ExplanationPipelineStage.ExplanationResult,
];
