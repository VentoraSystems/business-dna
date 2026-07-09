import type { ExplanationEngineInput } from "../dto/explanation-engine-input.dto";
import type { StrengthReason } from "../dto/strength-reason.dto";

/** Strength Detection stage: expands `compatibilityResult.strengths` into structured StrengthReasons. */
export interface StrengthAnalyzer {
  analyze(input: ExplanationEngineInput): Promise<StrengthReason[]>;
}
