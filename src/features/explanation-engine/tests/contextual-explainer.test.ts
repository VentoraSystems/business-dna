import { describe, it, expect } from "vitest";
import { PlaceholderContextualExplainer } from "../services/contextual-explainer";
import { NotImplementedError } from "../utils/errors";
import { fakeExplanationEngineInput } from "./fixtures";

describe("PlaceholderContextualExplainer", () => {
  const explainer = new PlaceholderContextualExplainer();

  it("explainRisk() throws NotImplementedError", async () => {
    await expect(explainer.explainRisk(fakeExplanationEngineInput)).rejects.toBeInstanceOf(
      NotImplementedError
    );
  });

  it("explainFinancials() throws NotImplementedError", async () => {
    await expect(explainer.explainFinancials(fakeExplanationEngineInput)).rejects.toBeInstanceOf(
      NotImplementedError
    );
  });

  it("explainTimeline() throws NotImplementedError", async () => {
    await expect(explainer.explainTimeline(fakeExplanationEngineInput)).rejects.toBeInstanceOf(
      NotImplementedError
    );
  });
});
