import { NotImplementedError } from "../utils/errors";
import { MatchingPipelineStage } from "../types/pipeline";
import type { Locale } from "@/i18n/config";
import type { CompatibilityResult } from "../types/compatibility-result";
import type { RawAssessmentAnswers } from "../types/assessment-input";
import { UNWEIGHTED_CONFIG, type WeightConfig } from "../scoring/weight-config";
import { matchingRules } from "../rules/rule-registry";
import { type AssessmentNormalizer, PlaceholderAssessmentNormalizer } from "./assessment-normalizer";
import {
  type BusinessCandidateProvider,
  businessCandidateProvider as defaultBusinessCandidateProvider,
} from "./business-candidate-provider";
import { type ScoreCalculator, PlaceholderScoreCalculator } from "../scoring/score-calculator";
import {
  type CompatibilityCalculator,
  PlaceholderCompatibilityCalculator,
} from "../scoring/compatibility-calculator";
import { type RuleEngine, PlaceholderRuleEngine } from "../rules/rule-engine";
import { type RankingEngine, PlaceholderRankingEngine } from "./ranking-engine";
import { type ExplanationGenerator, PlaceholderExplanationGenerator } from "./explanation-generator";

export interface MatchingRequest {
  assessmentId: string;
  userId: string;
  locale: Locale;
  /** Injectable so a caller (or a test) can supply a specific weight set instead of the unassigned default. */
  weightConfig?: WeightConfig;
}

/**
 * Orchestrates every stage in order. This is intentionally the *only*
 * place that knows the full pipeline sequence — every other service only
 * knows its own stage. Swapping an implementation (e.g. a real
 * ScoreCalculator once one exists) means passing a different constructor
 * argument here; nothing about the orchestration itself should need to
 * change.
 */
export interface MatchingEngine {
  run(request: MatchingRequest): Promise<CompatibilityResult[]>;
}

export interface MatchingEngineDependencies {
  normalizer: AssessmentNormalizer;
  candidateProvider: BusinessCandidateProvider;
  scoreCalculator: ScoreCalculator;
  compatibilityCalculator: CompatibilityCalculator;
  ruleEngine: RuleEngine;
  rankingEngine: RankingEngine;
  explanationGenerator: ExplanationGenerator;
  /** Where raw assessment answers are fetched from — see the note on `fetchRawAnswers` below. */
  fetchRawAnswers: (assessmentId: string) => Promise<RawAssessmentAnswers>;
}

export class DefaultMatchingEngine implements MatchingEngine {
  constructor(private readonly deps: MatchingEngineDependencies) {}

  async run(request: MatchingRequest): Promise<CompatibilityResult[]> {
    const weights = request.weightConfig ?? UNWEIGHTED_CONFIG;

    // Stage 1 — Assessment Answers.
    const rawAnswers = await this.deps.fetchRawAnswers(request.assessmentId);

    // Stage 2 — Normalization.
    const normalizedProfile = await this.deps.normalizer.normalize(rawAnswers);

    // Stage 3 — Feature Extraction.
    const assessmentFeatures = await this.deps.normalizer.extractFeatures(normalizedProfile);

    // Stage 4 — Business Candidate Retrieval.
    const candidates = await this.deps.candidateProvider.getCandidates({ isPublished: true });

    // Stages 5-6 — Weighted Scoring + Compatibility Calculation, per candidate.
    const scoredCandidates = await Promise.all(
      candidates.map(async (candidate) => {
        const dimensionScores = await this.deps.scoreCalculator.calculateDimensionScores(
          assessmentFeatures,
          candidate,
          weights
        );
        const ruleResults = await this.deps.ruleEngine.evaluate(matchingRules, {
          assessmentFeatures,
          candidate,
        });
        const compatibility = await this.deps.compatibilityCalculator.calculate({
          dimensionScores,
          ruleResults,
        });

        return { candidate, compatibility, dimensionScores, ruleResults };
      })
    );

    // Stage 7 — Ranking.
    const ranked = await this.deps.rankingEngine.rank(
      scoredCandidates.map(({ candidate, compatibility }) => ({ candidate, compatibility }))
    );

    // Stage 8 — AI Explanation.
    const explanations = await Promise.all(
      ranked.map((rankedCandidate) =>
        this.deps.explanationGenerator.explainMatch({ candidate: rankedCandidate, locale: request.locale })
      )
    );

    // Stage 9 — Business Match Results. Assembling CompatibilityResult[]
    // from the stages above is the only step left un-implemented on
    // purpose here, since every input above already throws — this call
    // documents *where* assembly happens without fabricating a result
    // shape from stages that don't produce real data yet.
    return this.assembleResults(ranked, scoredCandidates, explanations);
  }

  private assembleResults(
    _ranked: Awaited<ReturnType<RankingEngine["rank"]>>,
    _scoredCandidates: unknown[],
    _explanations: string[]
  ): CompatibilityResult[] {
    throw new NotImplementedError(
      MatchingPipelineStage.BusinessMatchResults,
      "DefaultMatchingEngine.assembleResults — every upstream stage is a placeholder, so there is nothing real to assemble yet."
    );
  }
}

/**
 * Composition root for the engine. Every dependency defaults to its
 * placeholder implementation; pass overrides (e.g. in a test) for
 * whichever stage you're exercising.
 */
export function createMatchingEngine(
  overrides: Partial<MatchingEngineDependencies> = {}
): MatchingEngine {
  return new DefaultMatchingEngine({
    normalizer: overrides.normalizer ?? new PlaceholderAssessmentNormalizer(),
    candidateProvider: overrides.candidateProvider ?? defaultBusinessCandidateProvider,
    scoreCalculator: overrides.scoreCalculator ?? new PlaceholderScoreCalculator(),
    compatibilityCalculator: overrides.compatibilityCalculator ?? new PlaceholderCompatibilityCalculator(),
    ruleEngine: overrides.ruleEngine ?? new PlaceholderRuleEngine(),
    rankingEngine: overrides.rankingEngine ?? new PlaceholderRankingEngine(),
    explanationGenerator: overrides.explanationGenerator ?? new PlaceholderExplanationGenerator(),
    fetchRawAnswers:
      overrides.fetchRawAnswers ??
      (() => {
        throw new NotImplementedError(
          MatchingPipelineStage.AssessmentAnswers,
          "createMatchingEngine() was not given a fetchRawAnswers implementation. This should read a completed Assessment's answers (see features/assessment) and is left to the caller so this feature doesn't take on a hard dependency direction."
        );
      }),
  });
}
