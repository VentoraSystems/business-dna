import { NotImplementedError } from "../utils/errors";
import { MatchingPipelineStage } from "../types/pipeline";
import type { BusinessCandidate } from "../types/business-candidate";
import type { CompatibilityCalculationOutput } from "../scoring/compatibility-calculator";

export interface ScoredCandidate {
  candidate: BusinessCandidate;
  compatibility: CompatibilityCalculationOutput;
}

export interface RankedCandidate extends ScoredCandidate {
  rank: number;
}

/**
 * Orders scored candidates and decides how many to surface. Kept separate
 * from `CompatibilityCalculator` because ranking may eventually need
 * information beyond a single candidate's score — e.g. diversity across
 * categories (don't show 5 near-identical SaaS ideas), or a cutoff based
 * on `confidenceScore` — concerns that only make sense with the whole
 * candidate set in view at once.
 */
export interface RankingEngine {
  rank(scoredCandidates: ScoredCandidate[]): Promise<RankedCandidate[]>;
}

export class PlaceholderRankingEngine implements RankingEngine {
  async rank(_scoredCandidates: ScoredCandidate[]): Promise<RankedCandidate[]> {
    throw new NotImplementedError(
      MatchingPipelineStage.Ranking,
      "RankingEngine.rank — no ranking/ordering logic exists yet."
    );
  }
}

/** How many ranked candidates a v1 run surfaces — see README.md for why 10. */
export const DEFAULT_RANKING_LIMIT = 10;

/**
 * v1 implementation: sort by `overallScore` descending and take the top N
 * (default 10 — the catalog only has 21 candidates today, so 10 is enough
 * to feel like a curated shortlist without being so small it hides a
 * legitimately close second-place match; revisit once the catalog is much
 * larger or once diversity/confidence-cutoff logic exists, per this
 * interface's own docstring). No diversity, dedup, or confidence
 * filtering yet — a real future ranking model plugs in here without the
 * interface needing to change.
 */
export class DefaultRankingEngine implements RankingEngine {
  constructor(private readonly limit: number = DEFAULT_RANKING_LIMIT) {}

  async rank(scoredCandidates: ScoredCandidate[]): Promise<RankedCandidate[]> {
    return [...scoredCandidates]
      .sort((a, b) => b.compatibility.overallScore - a.compatibility.overallScore)
      .slice(0, this.limit)
      .map((scored, index) => ({ ...scored, rank: index + 1 }));
  }
}
