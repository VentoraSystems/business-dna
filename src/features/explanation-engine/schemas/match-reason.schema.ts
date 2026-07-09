import { z } from "zod";
import { MatchingDimension } from "@/features/matching-engine/scoring/dimensions";
import { MatchReasonCategory, type MatchReason } from "../dto/match-reason.dto";

export const matchReasonSchema: z.ZodType<MatchReason> = z.object({
  category: z.nativeEnum(MatchReasonCategory),
  translationKey: z.string().min(1),
  relatedDimensions: z.array(z.nativeEnum(MatchingDimension)),
  contribution: z.number().min(0).max(1),
});
