import { describe, it, expect } from "vitest";
import { PlaceholderWarningAnalyzer } from "../services/warning-analyzer";
import { NotImplementedError } from "../utils/errors";
import { fakeExplanationEngineInput } from "./fixtures";

describe("PlaceholderWarningAnalyzer", () => {
  it("analyze() throws NotImplementedError", async () => {
    const analyzer = new PlaceholderWarningAnalyzer();
    await expect(analyzer.analyze(fakeExplanationEngineInput)).rejects.toBeInstanceOf(NotImplementedError);
  });
});
