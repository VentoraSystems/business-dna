import { describe, it, expect } from "vitest";
import { PlaceholderGrowthOpportunityAnalyzer } from "../services/growth-opportunity-analyzer";
import { NotImplementedError } from "../utils/errors";
import { fakeExplanationEngineInput } from "./fixtures";

describe("PlaceholderGrowthOpportunityAnalyzer", () => {
  it("analyze() throws NotImplementedError", async () => {
    const analyzer = new PlaceholderGrowthOpportunityAnalyzer();
    await expect(analyzer.analyze([], fakeExplanationEngineInput)).rejects.toBeInstanceOf(
      NotImplementedError
    );
  });
});
