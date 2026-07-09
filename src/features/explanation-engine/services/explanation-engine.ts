import type { ExplanationEngineInput } from "../dto/explanation-engine-input.dto";
import type { ExplanationResult } from "../dto/explanation-result.dto";
import { type ExplanationEngine } from "../interfaces/explanation-engine.interface";
import { type StrengthAnalyzer } from "../interfaces/strength-analyzer.interface";
import { type WeaknessAnalyzer } from "../interfaces/weakness-analyzer.interface";
import { type GrowthOpportunityAnalyzer } from "../interfaces/growth-opportunity-analyzer.interface";
import { type WarningAnalyzer } from "../interfaces/warning-analyzer.interface";
import { type ActionPlanner } from "../interfaces/action-planner.interface";
import { type ConfidenceExplainer } from "../interfaces/confidence-explainer.interface";
import { type ContextualExplainer } from "../interfaces/contextual-explainer.interface";
import { type SummaryBuilder } from "../interfaces/summary-builder.interface";
import { PlaceholderStrengthAnalyzer } from "./strength-analyzer";
import { PlaceholderWeaknessAnalyzer } from "./weakness-analyzer";
import { PlaceholderGrowthOpportunityAnalyzer } from "./growth-opportunity-analyzer";
import { PlaceholderWarningAnalyzer } from "./warning-analyzer";
import { PlaceholderActionPlanner } from "./action-planner";
import { PlaceholderConfidenceExplainer } from "./confidence-explainer";
import { PlaceholderContextualExplainer } from "./contextual-explainer";
import { PlaceholderSummaryBuilder } from "./summary-builder";

export interface ExplanationEngineDependencies {
  strengthAnalyzer: StrengthAnalyzer;
  weaknessAnalyzer: WeaknessAnalyzer;
  growthOpportunityAnalyzer: GrowthOpportunityAnalyzer;
  warningAnalyzer: WarningAnalyzer;
  actionPlanner: ActionPlanner;
  confidenceExplainer: ConfidenceExplainer;
  contextualExplainer: ContextualExplainer;
  summaryBuilder: SummaryBuilder;
}

/**
 * Orchestrates every stage in order — mirrors
 * `DefaultMatchingEngine.run()` in matching-engine/services/matching-engine.ts.
 * This is intentionally the only place that knows the full pipeline
 * sequence; every other service only knows its own stage. See
 * ../types/pipeline.ts for the full stage diagram, including why
 * Assessment/Business Genome/Dimension Analysis have no dedicated service
 * and why ContextualExplainer rides along with Warning Analysis.
 */
export class DefaultExplanationEngine implements ExplanationEngine {
  constructor(private readonly deps: ExplanationEngineDependencies) {}

  async run(input: ExplanationEngineInput): Promise<ExplanationResult> {
    // Stages 1-3 — Assessment, Business Genome, Dimension Analysis are
    // already available on `input` (assessmentFeatures, businessGenome,
    // compatibilityResult.dimensionScores) — nothing to fetch or compute.

    // Stage 4 — Strength Detection.
    const strengthReasons = await this.deps.strengthAnalyzer.analyze(input);

    // Stage 5 — Weakness Detection.
    const weaknesses = await this.deps.weaknessAnalyzer.detect(input);

    // Stage 6 — Growth Analysis.
    const growthAreas = await this.deps.growthOpportunityAnalyzer.analyze(weaknesses, input);

    // Stage 7 — Warning Analysis, plus the three contextual explanations
    // that ride along with it (see ../README.md → "Judgement calls").
    const [warnings, riskExplanation, financialExplanation, timelineExplanation] = await Promise.all([
      this.deps.warningAnalyzer.analyze(input),
      this.deps.contextualExplainer.explainRisk(input),
      this.deps.contextualExplainer.explainFinancials(input),
      this.deps.contextualExplainer.explainTimeline(input),
    ]);

    // Stage 8 — Action Planning.
    const recommendedActions = await this.deps.actionPlanner.plan(growthAreas, warnings, input);

    // Stage 9 — Explanation Result.
    const [{ overallSummary, matchReasons }, confidenceExplanation] = await Promise.all([
      this.deps.summaryBuilder.build(input),
      this.deps.confidenceExplainer.explain(input),
    ]);

    return {
      overallSummary,
      matchReasons,
      strengthReasons,
      growthAreas,
      warnings,
      recommendedActions,
      confidenceExplanation,
      riskExplanation,
      financialExplanation,
      timelineExplanation,
    };
  }
}

/**
 * Composition root for the engine. Every dependency defaults to its
 * placeholder implementation; pass overrides (e.g. in a test) for
 * whichever stage you're exercising — mirrors `createMatchingEngine()`.
 */
export function createExplanationEngine(
  overrides: Partial<ExplanationEngineDependencies> = {}
): ExplanationEngine {
  return new DefaultExplanationEngine({
    strengthAnalyzer: overrides.strengthAnalyzer ?? new PlaceholderStrengthAnalyzer(),
    weaknessAnalyzer: overrides.weaknessAnalyzer ?? new PlaceholderWeaknessAnalyzer(),
    growthOpportunityAnalyzer:
      overrides.growthOpportunityAnalyzer ?? new PlaceholderGrowthOpportunityAnalyzer(),
    warningAnalyzer: overrides.warningAnalyzer ?? new PlaceholderWarningAnalyzer(),
    actionPlanner: overrides.actionPlanner ?? new PlaceholderActionPlanner(),
    confidenceExplainer: overrides.confidenceExplainer ?? new PlaceholderConfidenceExplainer(),
    contextualExplainer: overrides.contextualExplainer ?? new PlaceholderContextualExplainer(),
    summaryBuilder: overrides.summaryBuilder ?? new PlaceholderSummaryBuilder(),
  });
}
