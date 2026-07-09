import { describe, it, expect } from "vitest";
import { PlaceholderSummaryBuilder } from "../services/summary-builder";
import { NotImplementedError } from "../utils/errors";
import { fakeExplanationEngineInput } from "./fixtures";

describe("PlaceholderSummaryBuilder", () => {
  it("build() throws NotImplementedError", async () => {
    const builder = new PlaceholderSummaryBuilder();
    await expect(builder.build(fakeExplanationEngineInput)).rejects.toBeInstanceOf(NotImplementedError);
  });
});
