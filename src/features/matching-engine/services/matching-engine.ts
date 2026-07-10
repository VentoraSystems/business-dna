import { NotImplementedError } from "../utils/errors";
import { MatchingPipelineStage } from "../types/pipeline";
import type { Locale } from "@/i18n/config";
import type { CompatibilityResult } from "../types/compatibility-result";
import type { RawAssessmentAnswers, NormalizedAssessmentProfile } from "../types/assessment-input";
import { UNIFORM_CONFIG, type WeightConfig } from "../scoring/weight-config";
import { matchingRules } from "../rules/rule-registry";
import { SKILL_KEYS } from "../scoring/dimension-mapping";
import { type AssessmentNormalizer, DefaultAssessmentNormalizer } from "./assessment-normalizer";
import {
  type BusinessCandidateProvider,
  businessCandidateProvider as defaultBusinessCandidateProvider,
} from "./business-candidate-provider";
import { type ScoreCalculator, DefaultScoreCalculator } from "../scoring/score-calculator";
import {
  type CompatibilityCalculator,
  DefaultCompatibilityCalculator,
} from "../scoring/compatibility-calculator";
import { type RuleEngine, NoOpRuleEngine } from "../rules/rule-engine";
import { type RankingEngine, DefaultRankingEngine, type RankedCandidate } from "./ranking-engine";
import { type ExplanationGenerator, PlaceholderExplanationGenerator } from "./explanation-generator";
import { totalQuestionCount as ASSESSMENT_TOTAL_QUESTION_COUNT } from "@/features/assessment/config/sections";

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

interface PerCandidateScoring {
  dimensionScores: Awaited<ReturnType<ScoreCalculator["calculateDimensionScores"]>>;
  ruleResults: Awaited<ReturnType<RuleEngine["evaluate"]>>;
}

/** rawValue >= this -> a "strength"; <= (1 - this) -> a "weakness". v1 stub thresholds — see assembleResults(). */
const STRENGTH_THRESHOLD = 0.7;
const WEAKNESS_THRESHOLD = 0.3;
/** A user's self-rating (0-1, from a 1-5 rating question) at or above this counts as "has this skill" for matchedSkills/missingSkills. */
const SKILL_MATCH_THRESHOLD = 0.5;

export class DefaultMatchingEngine implements MatchingEngine {
  constructor(private readonly deps: MatchingEngineDependencies) {}

  async run(request: MatchingRequest): Promise<CompatibilityResult[]> {
    const weights = request.weightConfig ?? UNIFORM_CONFIG;

    // Stage 1 — Assessment Answers.
    const rawAnswers = await this.deps.fetchRawAnswers(request.assessmentId);
    const answeredQuestionCount = Object.values(rawAnswers.answers).filter((v) => v !== null && v !== undefined).length;

    // Stage 2 — Normalization.
    const normalizedProfile = await this.deps.normalizer.normalize(rawAnswers);

    // Stage 3 — Feature Extraction.
    const assessmentFeatures = await this.deps.normalizer.extractFeatures(normalizedProfile);

    // Stage 4 — Business Candidate Retrieval.
    const candidates = await this.deps.candidateProvider.getCandidates({ isPublished: true });

    // Stages 5-6 — Weighted Scoring + Compatibility Calculation, per candidate.
    const perCandidateScoring = new Map<string, PerCandidateScoring>();
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
        perCandidateScoring.set(candidate.businessTypeId, { dimensionScores, ruleResults });

        if (this.deps.ruleEngine.isExcluded(ruleResults)) {
          return null;
        }

        const compatibility = await this.deps.compatibilityCalculator.calculate({
          dimensionScores,
          ruleResults,
          answeredQuestionCount,
          totalQuestionCount: ASSESSMENT_TOTAL_QUESTION_COUNT,
        });

        return { candidate, compatibility };
      })
    );

    // Stage 7 — Ranking. (required/exclusion rules can drop a candidate — see isExcluded() above; a no-op RuleEngine never does.)
    const ranked = await this.deps.rankingEngine.rank(
      scoredCandidates.filter((s): s is NonNullable<typeof s> => s !== null)
    );

    // Stage 8 — AI Explanation.
    const explanations = await Promise.all(
      ranked.map((rankedCandidate) =>
        this.deps.explanationGenerator.explainMatch({ candidate: rankedCandidate, locale: request.locale })
      )
    );

    // Stage 9 — Business Match Results.
    return this.assembleResults(ranked, perCandidateScoring, explanations, normalizedProfile);
  }

  private assembleResults(
    ranked: RankedCandidate[],
    perCandidateScoring: Map<string, PerCandidateScoring>,
    explanations: string[],
    normalizedProfile: NormalizedAssessmentProfile
  ): CompatibilityResult[] {
    return ranked.map((rankedCandidate, index) => {
      const scoring = perCandidateScoring.get(rankedCandidate.candidate.businessTypeId);
      const dimensionScores = scoring?.dimensionScores ?? [];
      const ruleResults = scoring?.ruleResults ?? [];

      const strengths: string[] = [];
      const weaknesses: string[] = [];
      for (const score of dimensionScores) {
        if (score.rawValue >= STRENGTH_THRESHOLD) strengths.push(score.dimension);
        else if (score.rawValue <= WEAKNESS_THRESHOLD) weaknesses.push(score.dimension);
      }

      const matchedSkills: string[] = [];
      const missingSkills: string[] = [];
      for (const skillKey of rankedCandidate.candidate.skillKeys) {
        const answer = SKILL_KEYS.includes(skillKey as (typeof SKILL_KEYS)[number])
          ? normalizedProfile.normalizedAnswers[skillKey]
          : undefined;
        const userRating = answer?.kind === "scalar" ? answer.value : undefined;
        if (userRating !== undefined && userRating >= SKILL_MATCH_THRESHOLD) {
          matchedSkills.push(skillKey);
        } else {
          missingSkills.push(skillKey);
        }
      }

      return {
        businessTypeId: rankedCandidate.candidate.businessTypeId,
        overallScore: rankedCandidate.compatibility.overallScore,
        dimensionScores,
        strengths,
        weaknesses,
        matchedSkills,
        missingSkills,
        // Empty by design — ranking has no notion of "related" yet, see RankingEngine's own docstring.
        recommendedBusinessTypes: [],
        confidenceScore: rankedCandidate.compatibility.confidenceScore,
        reasoning: {
          summary: explanations[index],
          ruleResults,
          generatedAt: new Date(),
        },
      };
    });
  }
}

/**
 * Composition root for the engine. Every dependency defaults to its real
 * v1 implementation where one exists (see README.md's "Scoring model" for
 * what each does); `explanationGenerator` and `fetchRawAnswers` are the two
 * exceptions and stay throwing placeholders by default:
 *  - `explanationGenerator` — AI Explanation is out of scope for this
 *    phase (see README.md). Pass a real or stub override to exercise the
 *    rest of the pipeline end-to-end without it.
 *  - `fetchRawAnswers` — must stay caller-supplied; defaulting it to a real
 *    implementation here would give this feature a hard dependency on
 *    `features/assessment`'s data layer, which the architecture
 *    deliberately avoids (see README.md's "Where this plugs into the rest
 *    of the app").
 */
export function createMatchingEngine(
  overrides: Partial<MatchingEngineDependencies> = {}
): MatchingEngine {
  return new DefaultMatchingEngine({
    normalizer: overrides.normalizer ?? new DefaultAssessmentNormalizer(),
    candidateProvider: overrides.candidateProvider ?? defaultBusinessCandidateProvider,
    scoreCalculator: overrides.scoreCalculator ?? new DefaultScoreCalculator(),
    compatibilityCalculator: overrides.compatibilityCalculator ?? new DefaultCompatibilityCalculator(),
    ruleEngine: overrides.ruleEngine ?? new NoOpRuleEngine(),
    rankingEngine: overrides.rankingEngine ?? new DefaultRankingEngine(),
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
