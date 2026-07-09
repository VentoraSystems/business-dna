import { z } from "zod";
import {
  FinancialConsiderationCategory,
  type FinancialConsideration,
  type FinancialExplanation,
} from "../dto/financial-explanation.dto";

export const financialConsiderationSchema: z.ZodType<FinancialConsideration> = z.object({
  category: z.nativeEnum(FinancialConsiderationCategory),
  translationKey: z.string().min(1),
  amount: z.number().optional(),
  currency: z.string().length(3).optional(),
});

export const financialExplanationSchema: z.ZodType<FinancialExplanation> = z.object({
  considerations: z.array(financialConsiderationSchema),
  fitsStatedBudget: z.boolean().optional(),
});
