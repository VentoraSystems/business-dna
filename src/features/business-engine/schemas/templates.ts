import { z } from "zod";
import { translationKeySchema } from "./primitives";

/** One section of the future Business Plan document — a key, not prose. */
export const blueprintSectionKeySchema = z.string().min(2).max(60);

export const businessBlueprintTemplateSchema = z.object({
  businessTypeId: z.string().cuid(),
  sections: z.array(blueprintSectionKeySchema).min(1),
  promptContext: z.string().max(2000).optional(),
});

export const businessMarketingTemplateSchema = z.object({
  businessTypeId: z.string().cuid(),
  channelTypes: z.array(z.string().min(2).max(60)).min(1),
  promptContext: z.string().max(2000).optional(),
});

const financialAssumptionTypeSchema = z.enum(["number", "percent", "currency"]);

export const businessFinancialTemplateSchema = z.object({
  businessTypeId: z.string().cuid(),
  lineItemCategories: z.array(z.string().min(2).max(60)).min(1),
  assumptionsSchema: z.record(z.string(), financialAssumptionTypeSchema),
});

const launchMilestoneSchema = z.object({
  month: z.number().int().min(1).max(60),
  themeTranslationKey: translationKeySchema,
});

export const businessLaunchTemplateSchema = z.object({
  businessTypeId: z.string().cuid(),
  milestones: z.array(launchMilestoneSchema).min(1),
});

export type BusinessBlueprintTemplateInput = z.infer<typeof businessBlueprintTemplateSchema>;
export type BusinessMarketingTemplateInput = z.infer<typeof businessMarketingTemplateSchema>;
export type BusinessFinancialTemplateInput = z.infer<typeof businessFinancialTemplateSchema>;
export type BusinessLaunchTemplateInput = z.infer<typeof businessLaunchTemplateSchema>;
export type LaunchMilestone = z.infer<typeof launchMilestoneSchema>;
