import { describe, it, expect } from "vitest";
import { clamp, normalizeToUnitRange, denormalizeFromUnitRange, weightedAverage } from "../utils/normalization-math";

describe("clamp", () => {
  it("keeps in-range values unchanged", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });
  it("clamps below the minimum", () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });
  it("clamps above the maximum", () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });
});

describe("normalizeToUnitRange", () => {
  it("maps the midpoint to 0.5", () => {
    expect(normalizeToUnitRange(5, 0, 10)).toBe(0.5);
  });
  it("returns 0 when the range has no width", () => {
    expect(normalizeToUnitRange(5, 10, 10)).toBe(0);
  });
});

describe("denormalizeFromUnitRange", () => {
  it("is the inverse of normalizeToUnitRange", () => {
    expect(denormalizeFromUnitRange(0.5, 0, 10)).toBe(5);
  });
});

describe("weightedAverage", () => {
  it("computes a simple weighted average", () => {
    expect(weightedAverage([{ value: 10, weight: 1 }, { value: 0, weight: 1 }])).toBe(5);
  });
  it("returns 0 when total weight is 0", () => {
    expect(weightedAverage([{ value: 10, weight: 0 }])).toBe(0);
  });
});
