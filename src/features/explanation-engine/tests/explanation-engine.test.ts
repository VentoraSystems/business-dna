import { describe, it, expect } from "vitest";
import { createExplanationEngine } from "../services/explanation-engine";
import { fakeExplanationEngineInput } from "./fixtures";

describe("createExplanationEngine", () => {
  it("throws at the Strength Detection stage by default", async () => {
    const engine = createExplanationEngine();
    await expect(engine.run(fakeExplanationEngineInput)).rejects.toMatchObject({
      stage: "strengthDetection",
    });
  });

  it("proceeds to the Weakness Detection stage once a real StrengthAnalyzer is supplied", async () => {
    const engine = createExplanationEngine({
      strengthAnalyzer: { analyze: async () => [] },
    });
    await expect(engine.run(fakeExplanationEngineInput)).rejects.toMatchObject({
      stage: "weaknessDetection",
    });
  });

  it("proceeds to the Growth Analysis stage once Strength and Weakness are supplied", async () => {
    const engine = createExplanationEngine({
      strengthAnalyzer: { analyze: async () => [] },
      weaknessAnalyzer: { detect: async () => [] },
    });
    await expect(engine.run(fakeExplanationEngineInput)).rejects.toMatchObject({
      stage: "growthAnalysis",
    });
  });
});
