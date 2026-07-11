import { describe, it, expect } from "vitest";
import { DEFAULT_CONFIG, getDimensionWeight } from "../scoring/weight-config";
import { ALL_MATCHING_DIMENSIONS, MatchingDimension } from "../scoring/dimensions";

describe("DEFAULT_CONFIG", () => {
  it("has a weight for every one of the 14 dimensions", () => {
    expect(Object.keys(DEFAULT_CONFIG.weights)).toHaveLength(ALL_MATCHING_DIMENSIONS.length);
  });

  it("weights budget 5x every other dimension", () => {
    expect(DEFAULT_CONFIG.weights[MatchingDimension.Budget]).toBe(5);
    for (const dimension of ALL_MATCHING_DIMENSIONS) {
      if (dimension === MatchingDimension.Budget) continue;
      expect(DEFAULT_CONFIG.weights[dimension]).toBe(1);
    }
  });

  it("getDimensionWeight reflects the same per-dimension values", () => {
    expect(getDimensionWeight(DEFAULT_CONFIG, MatchingDimension.Budget)).toBe(5);
    expect(getDimensionWeight(DEFAULT_CONFIG, MatchingDimension.Risk)).toBe(1);
  });

  it("getDimensionWeight still defaults to 0 for a config that omits a dimension", () => {
    expect(getDimensionWeight({ version: "empty", weights: {} }, MatchingDimension.Budget)).toBe(0);
  });
});
