import { z } from "zod";
import { MatchingDimension } from "@/features/matching-engine/scoring/dimensions";
import { ActionCategory, ActionPriority, type RecommendedAction } from "../dto/recommended-action.dto";

export const recommendedActionSchema: z.ZodType<RecommendedAction> = z.object({
  category: z.nativeEnum(ActionCategory),
  priority: z.nativeEnum(ActionPriority),
  translationKey: z.string().min(1),
  relatedDimension: z.nativeEnum(MatchingDimension).optional(),
  relatedSkillKey: z.string().optional(),
});
