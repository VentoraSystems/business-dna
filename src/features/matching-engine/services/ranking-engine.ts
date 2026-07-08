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
