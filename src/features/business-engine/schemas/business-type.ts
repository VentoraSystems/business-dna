import { z } from "zod";
import { slugSchema, translationKeySchema, ratingScaleSchema, nonNegativeIntSchema } from "./primitives";
import {
  businessDifficultySchema,
  businessModelTypeSchema,
  automationLevelSchema,
  scalabilityLevelSchema,
  aiResistanceSchema,
  riskLevelSchema,
  revenueSpeedSchema,
  lifestyleModeSchema,
  teamSizePreferenceSchema,
  travelRequirementSchema,
  salesChannelSchema,
  onlineOfflineModeSchema,
} from "./enums";

// --- Core entity --------------------------------------------------------

export const businessTypeCreateSchema = z.object({
  slug: slugSchema,
  translationKey: translationKeySchema,
  categoryId: z.string().cuid(),
  businessModel: businessModelTypeSchema,
  difficulty: businessDifficultySchema.default("moderate"),
  automationLevel: automationLevelSchema.default("moderate"),
  scalabilityLevel: scalabilityLevelSchema.default("moderate"),
  aiResistance: aiResistanceSchema.default("moderate"),
  isActive: z.boolean().default(true),
  isPublished: z.boolean().default(false),
});
export const businessTypeUpdateSchema = businessTypeCreateSchema.partial();

// --- Normalized 1:1 attributes --------------------------------------------

export const businessLifestyleSchema = z.object({
  businessTypeId: z.string().cuid(),
  workMode: lifestyleModeSchema.default("hybrid"),
  travelRequirement: travelRequirementSchema.default("none"),
  teamSize: teamSizePreferenceSchema.default("solo"),
  salesChannel: salesChannelSchema.default("both"),
  onlineOffline: onlineOfflineModeSchema.default("hybrid"),
  minWeeklyHours: nonNegativeIntSchema.optional(),
  maxWeeklyHours: nonNegativeIntSchema.optional(),
  freedomLevel: ratingScaleSchema.optional(),
});

export const businessRiskSchema = z.object({
  businessTypeId: z.string().cuid(),
  riskLevel: riskLevelSchema.default("moderate"),
  failureImpact: ratingScaleSchema.optional(),
  requiredConfidence: ratingScaleSchema.optional(),
});

export const businessBudgetSchema = z
  .object({
    businessTypeId: z.string().cuid(),
    minInvestment: nonNegativeIntSchema,
    maxInvestment: nonNegativeIntSchema,
    currency: z.string().length(3).default("EUR"),
    ongoingMonthlyCostMin: nonNegativeIntSchema.optional(),
    ongoingMonthlyCostMax: nonNegativeIntSchema.optional(),
  })
  .refine((data) => data.maxInvestment >= data.minInvestment, {
    message: "maxInvestment must be greater than or equal to minInvestment.",
    path: ["maxInvestment"],
  });

export const businessRevenueSchema = z.object({
  businessTypeId: z.string().cuid(),
  targetMonthlyIncomeMin: nonNegativeIntSchema.optional(),
  targetMonthlyIncomeMax: nonNegativeIntSchema.optional(),
  revenueSpeed: revenueSpeedSchema.default("moderate"),
});

export const businessTimelineSchema = z.object({
  businessTypeId: z.string().cuid(),
  timeToFirstCustomerWeeks: nonNegativeIntSchema.optional(),
  timeToBreakEvenMonths: nonNegativeIntSchema.optional(),
  timeToScaleMonths: nonNegativeIntSchema.optional(),
});

// --- Per-type narrative rows ------------------------------------------------

export const businessRequirementSchema = z.object({
  businessTypeId: z.string().cuid(),
  translationKey: translationKeySchema,
  sortOrder: nonNegativeIntSchema.default(0),
});

export const businessAdvantageSchema = z.object({
  businessTypeId: z.string().cuid(),
  translationKey: translationKeySchema,
  sortOrder: nonNegativeIntSchema.default(0),
});

export const businessDisadvantageSchema = z.object({
  businessTypeId: z.string().cuid(),
  translationKey: translationKeySchema,
  sortOrder: nonNegativeIntSchema.default(0),
});

export type BusinessTypeCreateInput = z.infer<typeof businessTypeCreateSchema>;
export type BusinessTypeUpdateInput = z.infer<typeof businessTypeUpdateSchema>;
export type BusinessLifestyleInput = z.infer<typeof businessLifestyleSchema>;
export type BusinessRiskInput = z.infer<typeof businessRiskSchema>;
export type BusinessBudgetInput = z.infer<typeof businessBudgetSchema>;
export type BusinessRevenueInput = z.infer<typeof businessRevenueSchema>;
export type BusinessTimelineInput = z.infer<typeof businessTimelineSchema>;
export type BusinessRequirementInput = z.infer<typeof businessRequirementSchema>;
export type BusinessAdvantageInput = z.infer<typeof businessAdvantageSchema>;
export type BusinessDisadvantageInput = z.infer<typeof businessDisadvantageSchema>;
