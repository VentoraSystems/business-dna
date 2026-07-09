import { z } from "zod";
import type { ExplanationResult } from "../dto/explanation-result.dto";
import { overallSummarySchema } from "./overall-summary.schema";
import { matchReasonSchema } from "./match-reason.schema";
import { strengthReasonSchema } from "./strength-reason.schema";
import { growthAreaSchema } from "./growth-area.schema";
import { warningSchema } from "./warning.schema";
import { recommendedActionSchema } from "./recommended-action.schema";
import { confidenceExplanationSchema } from "./confidence-explanation.schema";
import { riskExplanationSchema } from "./risk-explanation.schema";
import { financialExplanationSchema } from "./financial-explanation.schema";
import { timelineExplanationSchema } from "./timeline-explanation.schema";

export const explanationResultSchema: z.ZodType<ExplanationResult> = z.object({
  overallSummary: overallSummarySchema,
  matchReasons: z.array(matchReasonSchema),
  strengthReasons: z.array(strengthReasonSchema),
  growthAreas: z.array(growthAreaSchema),
  warnings: z.array(warningSchema),
  recommendedActions: z.array(recommendedActionSchema),
  confidenceExplanation: confidenceExplanationSchema,
  riskExplanation: riskExplanationSchema,
  financialExplanation: financialExplanationSchema,
  timelineExplanation: timelineExplanationSchema,
  generatedAt: z.date().optional(),
});
