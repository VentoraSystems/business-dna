import { describe, it, expect } from "vitest";
import { PlaceholderWeaknessAnalyzer } from "../services/weakness-analyzer";
import { NotImplementedError } from "../utils/errors";
import { fakeExplanationEngineInput } from "./fixtures";

describe("PlaceholderWeaknessAnalyzer", () => {
  it("detect() throws NotImplementedError", async () => {
    const analyzer = new PlaceholderWeaknessAnalyzer();
    await expect(analyzer.detect(fakeExplanationEngineInput)).rejects.toBeInstanceOf(NotImplementedError);
  });
});
