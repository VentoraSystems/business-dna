import { z } from "zod";
import {
  ConfidenceFactorCategory,
  type ConfidenceExplanation,
  type ConfidenceFactor,
} from "../dto/confidence-explanation.dto";

export const confidenceFactorSchema: z.ZodType<ConfidenceFactor> = z.object({
  category: z.nativeEnum(ConfidenceFactorCategory),
  translationKey: z.string().min(1),
  impact: z.number().min(-1).max(1),
});

export const confidenceExplanationSchema: z.ZodType<ConfidenceExplanation> = z.object({
  confidenceScore: z.number().min(0).max(1),
  factors: z.array(confidenceFactorSchema),
});
