import { describe, it, expect } from "vitest";
import { PlaceholderRankingEngine } from "../services/ranking-engine";
import { NotImplementedError } from "../utils/errors";

describe("PlaceholderRankingEngine", () => {
  it("rank() throws NotImplementedError", async () => {
    const ranking = new PlaceholderRankingEngine();
    await expect(ranking.rank([])).rejects.toBeInstanceOf(NotImplementedError);
  });
});
