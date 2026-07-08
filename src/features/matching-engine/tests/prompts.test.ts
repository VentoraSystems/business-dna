import { describe, it, expect } from "vitest";
import {
  explainMatchPrompt,
  explainStrengthsPrompt,
  explainWeaknessesPrompt,
  improveCompatibilityPrompt,
  businessSummaryPrompt,
} from "../prompts";
import { NotImplementedError } from "../utils/errors";

const allPrompts = [
  explainMatchPrompt,
  explainStrengthsPrompt,
  explainWeaknessesPrompt,
  improveCompatibilityPrompt,
  businessSummaryPrompt,
];

describe("prompt templates", () => {
  it("each has a unique id and at least one required variable", () => {
    const ids = allPrompts.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const prompt of allPrompts) {
      expect(prompt.requiredVariables.length).toBeGreaterThan(0);
    }
  });

  it("build() throws NotImplementedError for every template — no prompt content exists yet", () => {
    for (const prompt of allPrompts) {
      expect(() => prompt.build({} as never)).toThrow(NotImplementedError);
    }
  });
});
