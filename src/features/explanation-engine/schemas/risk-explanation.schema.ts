import { z } from "zod";
import type { RiskExplanation, RiskFactor, RiskLevel } from "../dto/risk-explanation.dto";

const riskLevelSchema: z.ZodType<RiskLevel> = z.enum(["low", "moderate", "high"]);

export const riskFactorSchema: z.ZodType<RiskFactor> = z.object({
  severity: riskLevelSchema,
  translationKey: z.string().min(1),
  offsetByUserRiskTolerance: z.boolean().optional(),
});

export const riskExplanationSchema: z.ZodType<RiskExplanation> = z.object({
  overallRiskLevel: riskLevelSchema,
  factors: z.array(riskFactorSchema),
});
