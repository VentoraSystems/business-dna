import { z } from "zod";
import { financialAssumptionTypeSchema } from "@/features/business-engine/schemas/templates";
import { BusinessDnaKpiKey } from "@/features/business-dna/types/sections/kpis";
import type {
  BreakEven,
  CashFlow,
  EmergencyReserve,
  FinancialAiMetadata,
  FinancialKpis,
  FinancialRisks,
  GrossMargin,
  HiringCosts,
  LineItemCategoryList,
  MarketingBudget,
  MonthlyFixedCosts,
  NetMargin,
  PricingAssumptions,
  RevenueForecast,
  RevenueStreamItem,
  RevenueStreams,
  Scenarios,
  StartupCosts,
  Taxes,
  VariableCosts,
} from "../types/sections";

const lineItemCategoryListSchema: z.ZodType<LineItemCategoryList> = z.object({
  lineItemCategories: z.array(z.string().min(2).max(60)),
});

export const startupCostsSchema: z.ZodType<StartupCosts> = lineItemCategoryListSchema;
export const monthlyFixedCostsSchema: z.ZodType<MonthlyFixedCosts> = lineItemCategoryListSchema;
export const variableCostsSchema: z.ZodType<VariableCosts> = lineItemCategoryListSchema;
export const cashFlowSchema: z.ZodType<CashFlow> = lineItemCategoryListSchema;
export const hiringCostsSchema: z.ZodType<HiringCosts> = lineItemCategoryListSchema;
export const marketingBudgetSchema: z.ZodType<MarketingBudget> = lineItemCategoryListSchema;
export const taxesSchema: z.ZodType<Taxes> = lineItemCategoryListSchema;
export const emergencyReserveSchema: z.ZodType<EmergencyReserve> = lineItemCategoryListSchema;

/**
 * Mirrors business-dna's `RevenueStreamItem` (itself business-library's
 * `revenueStreamSchema`: `{ key, label: LocalizedText }`) structurally,
 * rather than importing business-library directly — this feature wasn't
 * granted the same business-dna → business-library import exception, so
 * the `z.ZodType<RevenueStreamItem>` annotation is what guarantees this
 * can't silently drift from the real shape (a compile error the moment
 * it does).
 */
export const revenueStreamItemSchema: z.ZodType<RevenueStreamItem> = z.object({
  key: z.string().min(1),
  label: z.object({ en: z.string().min(1), ro: z.string().min(1) }),
});

export const revenueStreamsSchema: z.ZodType<RevenueStreams> = z.object({
  revenueStreams: z.array(revenueStreamItemSchema),
});

const assumptionsSchemaShape = z.record(z.string(), financialAssumptionTypeSchema);

export const pricingAssumptionsSchema: z.ZodType<PricingAssumptions> = z.object({
  assumptionsSchema: assumptionsSchemaShape,
});

export const revenueForecastSchema: z.ZodType<RevenueForecast> = z.object({
  assumptionsSchema: assumptionsSchemaShape,
  notesTranslationKey: z.string().optional(),
});

export const breakEvenSchema: z.ZodType<BreakEven> = z.object({
  breakEvenMonthEstimate: z.number().int().nonnegative().optional(),
  notesTranslationKey: z.string().optional(),
});

export const grossMarginSchema: z.ZodType<GrossMargin> = z.object({
  percentEstimate: z.number().optional(),
  notesTranslationKey: z.string().optional(),
});

export const netMarginSchema: z.ZodType<NetMargin> = z.object({
  percentEstimate: z.number().optional(),
  notesTranslationKey: z.string().optional(),
});

export const financialKpisSchema: z.ZodType<FinancialKpis> = z.object({
  kpis: z.array(z.nativeEnum(BusinessDnaKpiKey)),
});

const financialScenarioSchema = z.object({
  revenueEstimate: z.number().optional(),
  notesTranslationKey: z.string().optional(),
});

export const scenariosSchema: z.ZodType<Scenarios> = z.object({
  conservative: financialScenarioSchema,
  expected: financialScenarioSchema,
  optimistic: financialScenarioSchema,
});

const financialRiskItemSchema = z.object({
  descriptionTranslationKey: z.string().min(1),
  severity: z.enum(["low", "moderate", "high"]),
});

export const financialRisksSchema: z.ZodType<FinancialRisks> = z.object({
  risks: z.array(financialRiskItemSchema),
});

export const financialAiMetadataSchema: z.ZodType<FinancialAiMetadata> = z.object({
  generationHintsTranslationKey: z.string().optional(),
  explanationHintsTranslationKey: z.string().optional(),
  matchingHintsTranslationKey: z.string().optional(),
});
