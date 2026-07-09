import { describe, it, expect } from "vitest";
import { PlaceholderStrengthAnalyzer } from "../services/strength-analyzer";
import { NotImplementedError } from "../utils/errors";
import { fakeExplanationEngineInput } from "./fixtures";

describe("PlaceholderStrengthAnalyzer", () => {
  it("analyze() throws NotImplementedError", async () => {
    const analyzer = new PlaceholderStrengthAnalyzer();
    await expect(analyzer.analyze(fakeExplanationEngineInput)).rejects.toBeInstanceOf(NotImplementedError);
  });
});
