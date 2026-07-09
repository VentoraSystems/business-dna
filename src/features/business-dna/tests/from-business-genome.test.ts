import { describe, it, expect } from "vitest";
import { fromBusinessGenome } from "../utils/from-business-genome";
import { NotImplementedError } from "../utils/errors";
import aiAutomationAgency from "../../../../business-library/examples/ai-automation-agency";

describe("fromBusinessGenome", () => {
  it("throws NotImplementedError — no mapping logic exists yet", () => {
    expect(() => fromBusinessGenome(aiAutomationAgency)).toThrow(NotImplementedError);
  });
});
