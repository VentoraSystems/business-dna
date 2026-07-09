import type { OverallSummary } from "./overall-summary.dto";
import type { MatchReason } from "./match-reason.dto";
import type { StrengthReason } from "./strength-reason.dto";
import type { GrowthArea } from "./growth-area.dto";
import type { Warning } from "./warning.dto";
import type { RecommendedAction } from "./recommended-action.dto";
import type { ConfidenceExplanation } from "./confidence-explanation.dto";
import type { RiskExplanation } from "./risk-explanation.dto";
import type { FinancialExplanation } from "./financial-explanation.dto";
import type { TimelineExplanation } from "./timeline-explanation.dto";

/**
 * The final, normalized output of the Explanation Engine for one
 * `ExplanationEngineInput` — the Explanation Result stage. Every field is
 * structured data (codes, enums, numeric contributions, translationKey
 * references), not free text, so it stays deterministic today and is
 * ready for a future AI layer, multiple explanation styles, and multiple
 * languages to build on without a shape change (see
 * ../README.md → "Extension points"). The one exception is
 * `OverallSummary.aiNarrative`, explicitly reserved and left undefined
 * until that future AI layer exists.
 */
export interface ExplanationResult {
  overallSummary: OverallSummary;
  matchReasons: MatchReason[];
  strengthReasons: StrengthReason[];
  growthAreas: GrowthArea[];
  warnings: Warning[];
  recommendedActions: RecommendedAction[];
  confidenceExplanation: ConfidenceExplanation;
  riskExplanation: RiskExplanation;
  financialExplanation: FinancialExplanation;
  timelineExplanation: TimelineExplanation;
  generatedAt?: Date;
}
