import { z } from "zod";
import { slugSchema, translationKeySchema, nonNegativeIntSchema } from "./primitives";
import { industryTypeSchema } from "./enums";

export const businessIndustryCreateSchema = z.object({
  code: industryTypeSchema,
  slug: slugSchema,
  translationKey: translationKeySchema,
  icon: z.string().max(80).optional(),
  sortOrder: nonNegativeIntSchema.default(0),
  isActive: z.boolean().default(true),
});
export const businessIndustryUpdateSchema = businessIndustryCreateSchema.partial();

export const businessCategoryCreateSchema = z.object({
  slug: slugSchema,
  translationKey: translationKeySchema,
  industryId: z.string().cuid(),
  icon: z.string().max(80).optional(),
  sortOrder: nonNegativeIntSchema.default(0),
  isActive: z.boolean().default(true),
});
export const businessCategoryUpdateSchema = businessCategoryCreateSchema.partial();

export type BusinessIndustryCreateInput = z.infer<typeof businessIndustryCreateSchema>;
export type BusinessIndustryUpdateInput = z.infer<typeof businessIndustryUpdateSchema>;
export type BusinessCategoryCreateInput = z.infer<typeof businessCategoryCreateSchema>;
export type BusinessCategoryUpdateInput = z.infer<typeof businessCategoryUpdateSchema>;
