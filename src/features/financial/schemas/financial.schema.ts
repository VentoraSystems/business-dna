import { z } from "zod";
import {
  startupCostsSchema,
  monthlyFixedCostsSchema,
  variableCostsSchema,
  revenueStreamsSchema,
  pricingAssumptionsSchema,
  revenueForecastSchema,
  cashFlowSchema,
  breakEvenSchema,
  grossMarginSchema,
  netMarginSchema,
  hiringCostsSchema,
  marketingBudgetSchema,
  taxesSchema,
  emergencyReserveSchema,
  financialKpisSchema,
  scenariosSchema,
  financialRisksSchema,
  financialAiMetadataSchema,
} from "./sections.schema";

/** Not annotated `z.ZodType<Financial>` so `.partial()` remains available for `financialUpdateSchema` — same reasoning as features/business-dna's composite schema. */
export const financialSchema = z.object({
  startupCosts: startupCostsSchema,
  monthlyFixedCosts: monthlyFixedCostsSchema,
  variableCosts: variableCostsSchema,
  revenueStreams: revenueStreamsSchema,
  pricingAssumptions: pricingAssumptionsSchema,
  revenueForecast: revenueForecastSchema,
  cashFlow: cashFlowSchema,
  breakEven: breakEvenSchema,
  grossMargin: grossMarginSchema,
  netMargin: netMarginSchema,
  hiringCosts: hiringCostsSchema,
  marketingBudget: marketingBudgetSchema,
  taxes: taxesSchema,
  emergencyReserve: emergencyReserveSchema,
  financialKpis: financialKpisSchema,
  scenarios: scenariosSchema,
  financialRisks: financialRisksSchema,
  aiMetadata: financialAiMetadataSchema,
});

export type FinancialSchemaOutput = z.infer<typeof financialSchema>;

export const financialCreateSchema = financialSchema;
export const financialUpdateSchema = financialSchema.partial();
