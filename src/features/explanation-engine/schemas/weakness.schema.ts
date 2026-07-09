import { z } from "zod";
import { MatchingDimension } from "@/features/matching-engine/scoring/dimensions";
import { WeaknessCategory, type DetectedWeakness } from "../dto/weakness.dto";

export const detectedWeaknessSchema: z.ZodType<DetectedWeakness> = z.object({
  category: z.nativeEnum(WeaknessCategory),
  dimension: z.nativeEnum(MatchingDimension).optional(),
  skillKey: z.string().optional(),
  severity: z.number().min(0).max(1),
});
