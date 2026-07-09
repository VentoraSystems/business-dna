import { describe, it, expect } from "vitest";
import { PlaceholderConfidenceExplainer } from "../services/confidence-explainer";
import { NotImplementedError } from "../utils/errors";
import { fakeExplanationEngineInput } from "./fixtures";

describe("PlaceholderConfidenceExplainer", () => {
  it("explain() throws NotImplementedError", async () => {
    const explainer = new PlaceholderConfidenceExplainer();
    await expect(explainer.explain(fakeExplanationEngineInput)).rejects.toBeInstanceOf(
      NotImplementedError
    );
  });
});
