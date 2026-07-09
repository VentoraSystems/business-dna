import { z } from "zod";
import { MatchingDimension } from "@/features/matching-engine/scoring/dimensions";
import { WarningSeverity, WarningCategory, type Warning } from "../dto/warning.dto";

export const warningSchema: z.ZodType<Warning> = z.object({
  severity: z.nativeEnum(WarningSeverity),
  category: z.nativeEnum(WarningCategory),
  translationKey: z.string().min(1),
  relatedDimension: z.nativeEnum(MatchingDimension).optional(),
});
