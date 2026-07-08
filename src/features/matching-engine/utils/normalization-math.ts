/**
 * Pure, generic numeric helpers. These know nothing about assessments,
 * businesses, or dimensions — they're the same kind of utility you'd reach
 * for in any scoring system. The actual decisions about *which* values to
 * normalize and *how* to combine them belong to the (not yet implemented)
 * services in ../services and ../scoring, not here.
 */

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Linearly maps `value` from [inMin, inMax] to [0, 1], clamped at both ends. */
export function normalizeToUnitRange(value: number, inMin: number, inMax: number): number {
  if (inMax === inMin) return 0;
  return clamp((value - inMin) / (inMax - inMin), 0, 1);
}

/** Inverse of normalizeToUnitRange — maps a [0, 1] value back to [outMin, outMax]. */
export function denormalizeFromUnitRange(value: number, outMin: number, outMax: number): number {
  return outMin + clamp(value, 0, 1) * (outMax - outMin);
}

export interface WeightedValue {
  value: number;
  weight: number;
}

/**
 * Weighted average of a set of (value, weight) pairs. Returns 0 when total
 * weight is 0 rather than dividing by zero — callers decide what "no
 * signal" should mean for their dimension.
 */
export function weightedAverage(values: readonly WeightedValue[]): number {
  const totalWeight = values.reduce((sum, v) => sum + v.weight, 0);
  if (totalWeight === 0) return 0;
  const weightedSum = values.reduce((sum, v) => sum + v.value * v.weight, 0);
  return weightedSum / totalWeight;
}
