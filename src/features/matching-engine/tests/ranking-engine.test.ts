import { describe, it, expect } from "vitest";
import { PlaceholderRankingEngine, DefaultRankingEngine } from "../services/ranking-engine";
import { NotImplementedError } from "../utils/errors";
import type { ScoredCandidate } from "../services/ranking-engine";
import type { BusinessCandidate } from "../types/business-candidate";

describe("PlaceholderRankingEngine", () => {
  it("rank() throws NotImplementedError", async () => {
    const ranking = new PlaceholderRankingEngine();
    await expect(ranking.rank([])).rejects.toBeInstanceOf(NotImplementedError);
  });
});

function makeScored(businessTypeId: string, overallScore: number): ScoredCandidate {
  const candidate: BusinessCandidate = { businessTypeId, slug: businessTypeId, translationKey: businessTypeId, dimensionProfile: {}, skillKeys: [] };
  return { candidate, compatibility: { overallScore, confidenceScore: 1 } };
}

describe("DefaultRankingEngine", () => {
  it("sorts by overallScore descending and assigns 1-based ranks", async () => {
    const ranking = new DefaultRankingEngine();
    const ranked = await ranking.rank([makeScored("low", 40), makeScored("high", 90), makeScored("mid", 65)]);

    expect(ranked.map((r) => r.candidate.businessTypeId)).toEqual(["high", "mid", "low"]);
    expect(ranked.map((r) => r.rank)).toEqual([1, 2, 3]);
  });

  it("caps output at the configured limit", async () => {
    const ranking = new DefaultRankingEngine(2);
    const ranked = await ranking.rank([makeScored("a", 10), makeScored("b", 30), makeScored("c", 20)]);

    expect(ranked).toHaveLength(2);
    expect(ranked.map((r) => r.candidate.businessTypeId)).toEqual(["b", "c"]);
  });

  it("defaults the limit to 10", async () => {
    const ranking = new DefaultRankingEngine();
    const scored = Array.from({ length: 15 }, (_, i) => makeScored(`c${i}`, i));
    const ranked = await ranking.rank(scored);
    expect(ranked).toHaveLength(10);
  });
});
