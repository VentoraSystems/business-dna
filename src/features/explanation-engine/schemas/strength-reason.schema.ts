import { z } from "zod";
import { MatchingDimension } from "@/features/matching-engine/scoring/dimensions";
import type { StrengthReason } from "../dto/strength-reason.dto";

export const strengthReasonSchema: z.ZodType<StrengthReason> = z.object({
  dimension: z.nativeEnum(MatchingDimension),
  translationKey: z.string().min(1),
  strength: z.number().min(0).max(1),
});
