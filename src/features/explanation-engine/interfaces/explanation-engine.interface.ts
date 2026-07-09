import type { ExplanationEngineInput } from "../dto/explanation-engine-input.dto";
import type { ExplanationResult } from "../dto/explanation-result.dto";

/**
 * The top-level orchestrator — mirrors matching-engine's `MatchingEngine`.
 * This is the only place in the feature that knows the full stage
 * sequence; every other service only knows its own stage, which is what
 * makes each one independently replaceable later.
 */
export interface ExplanationEngine {
  run(input: ExplanationEngineInput): Promise<ExplanationResult>;
}
