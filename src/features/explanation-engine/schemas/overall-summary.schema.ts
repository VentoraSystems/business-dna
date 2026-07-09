import { z } from "zod";
import type { OverallSummary } from "../dto/overall-summary.dto";

export const overallSummarySchema: z.ZodType<OverallSummary> = z.object({
  translationKey: z.string().min(1),
  values: z.record(z.union([z.string(), z.number()])),
  aiNarrative: z.string().optional(),
});
