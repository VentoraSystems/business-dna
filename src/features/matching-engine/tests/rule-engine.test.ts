import { describe, it, expect } from "vitest";
import { PlaceholderRuleEngine } from "../rules/rule-engine";
import { matchingRules } from "../rules/rule-registry";
import { NotImplementedError } from "../utils/errors";

describe("rule registry", () => {
  it("is empty — no rules have been authored yet", () => {
    expect(matchingRules).toEqual([]);
  });
});

describe("PlaceholderRuleEngine", () => {
  const engine = new PlaceholderRuleEngine();

  it("evaluate() throws NotImplementedError", async () => {
    await expect(
      engine.evaluate(matchingRules, {
        assessmentFeatures: { assessmentId: "a1", userId: "u1", locale: "en", dimensionInputs: {} },
        candidate: { businessTypeId: "bt1", slug: "x", translationKey: "x", dimensionProfile: {}, skillKeys: [] },
      })
    ).rejects.toBeInstanceOf(NotImplementedError);
  });

  it("isExcluded() throws NotImplementedError", () => {
    expect(() => engine.isExcluded([])).toThrow(NotImplementedError);
  });
});
