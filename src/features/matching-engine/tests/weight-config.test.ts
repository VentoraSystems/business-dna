import { describe, it, expect } from "vitest";
import { UNWEIGHTED_CONFIG, getDimensionWeight } from "../scoring/weight-config";
import { MatchingDimension } from "../scoring/dimensions";

describe("UNWEIGHTED_CONFIG", () => {
  it("has no weights assigned", () => {
    expect(UNWEIGHTED_CONFIG.weights).toEqual({});
  });

  it("getDimensionWeight defaults to 0 for every dimension", () => {
    for (const dimension of Object.values(MatchingDimension)) {
      expect(getDimensionWeight(UNWEIGHTED_CONFIG, dimension)).toBe(0);
    }
  });
});
