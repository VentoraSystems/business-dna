import { z } from "zod";
import { MatchingDimension } from "@/features/matching-engine/scoring/dimensions";
import { GrowthAreaCategory, type GrowthArea } from "../dto/growth-area.dto";

export const growthAreaSchema: z.ZodType<GrowthArea> = z.object({
  category: z.nativeEnum(GrowthAreaCategory),
  translationKey: z.string().min(1),
  relatedDimension: z.nativeEnum(MatchingDimension).optional(),
  relatedSkillKey: z.string().optional(),
  gap: z.number().min(0).max(1),
});
