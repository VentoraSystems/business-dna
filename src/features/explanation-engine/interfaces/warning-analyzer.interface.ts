import type { ExplanationEngineInput } from "../dto/explanation-engine-input.dto";
import type { Warning } from "../dto/warning.dto";

/** Warning Analysis stage: surfaces structured cautions (budget, skill, risk, data quality, legal, market). */
export interface WarningAnalyzer {
  analyze(input: ExplanationEngineInput): Promise<Warning[]>;
}
