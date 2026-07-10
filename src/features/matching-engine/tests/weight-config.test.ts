import { describe, it, expect } from "vitest";
import { UNIFORM_CONFIG, getDimensionWeight } from "../scoring/weight-config";
import { ALL_MATCHING_DIMENSIONS, MatchingDimension } from "../scoring/dimensions";

describe("UNIFORM_CONFIG", () => {
  it("assigns weight 1 to every one of the 14 dimensions", () => {
    expect(Object.keys(UNIFORM_CONFIG.weights)).toHaveLength(ALL_MATCHING_DIMENSIONS.length);
    for (const dimension of ALL_MATCHING_DIMENSIONS) {
      expect(UNIFORM_CONFIG.weights[dimension]).toBe(1);
    }
  });

  it("getDimensionWeight returns 1 for every dimension", () => {
    for (const dimension of Object.values(MatchingDimension)) {
      expect(getDimensionWeight(UNIFORM_CONFIG, dimension)).toBe(1);
    }
  });

  it("getDimensionWeight still defaults to 0 for a config that omits a dimension", () => {
    expect(getDimensionWeight({ version: "empty", weights: {} }, MatchingDimension.Budget)).toBe(0);
  });
});
