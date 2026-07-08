import type { MatchingRule } from "./rule-types";

/**
 * Every rule the matching engine should evaluate. Empty by design — no
 * rule has been authored yet. When rules are added, prefer loading them
 * from a database table (mirroring how `BusinessQuestionWeight` works in
 * the Business Engine) over hard-coding them here; this array is a
 * reasonable place to start, or to fall back to in a test environment.
 */
export const matchingRules: readonly MatchingRule[] = [];
