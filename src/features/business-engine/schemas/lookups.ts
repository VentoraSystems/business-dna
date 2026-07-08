import { z } from "zod";
import { slugSchema, translationKeySchema, ratingScaleSchema } from "./primitives";
import { resourceTypeSchema } from "./enums";

// --- Skills -----------------------------------------------------------------

export const requiredSkillCreateSchema = z.object({
  key: z
    .string()
    .min(2)
    .max(60)
    .regex(/^[a-z][a-zA-Z0-9]*$/, "Must be a camelCase key, matching an Assessment skill question key."),
  translationKey: translationKeySchema,
});
export const requiredSkillUpdateSchema = requiredSkillCreateSchema.partial();

export const businessSkillCreateSchema = z.object({
  businessTypeId: z.string().cuid(),
  skillId: z.string().cuid(),
  importance: ratingScaleSchema.default(3),
});
export const businessSkillUpdateSchema = businessSkillCreateSchema.partial();

// --- Tags ---------------------------------------------------------------------

export const businessTagCreateSchema = z.object({
  slug: slugSchema,
  translationKey: translationKeySchema,
});
export const businessTagUpdateSchema = businessTagCreateSchema.partial();

export const businessTypeTagCreateSchema = z.object({
  businessTypeId: z.string().cuid(),
  tagId: z.string().cuid(),
});

// --- Tools ----------------------------------------------------------------

export const businessToolCreateSchema = z.object({
  slug: slugSchema,
  translationKey: translationKeySchema,
  websiteUrl: z.string().url().optional(),
  category: z.string().max(60).optional(),
});
export const businessToolUpdateSchema = businessToolCreateSchema.partial();

export const businessTypeToolCreateSchema = z.object({
  businessTypeId: z.string().cuid(),
  toolId: z.string().cuid(),
  isRequired: z.boolean().default(true),
});

// --- Resources ------------------------------------------------------------

export const businessResourceCreateSchema = z.object({
  slug: slugSchema,
  translationKey: translationKeySchema,
  resourceType: resourceTypeSchema,
  url: z.string().url().optional(),
});
export const businessResourceUpdateSchema = businessResourceCreateSchema.partial();

export const businessTypeResourceCreateSchema = z.object({
  businessTypeId: z.string().cuid(),
  resourceId: z.string().cuid(),
});

export type RequiredSkillCreateInput = z.infer<typeof requiredSkillCreateSchema>;
export type BusinessSkillCreateInput = z.infer<typeof businessSkillCreateSchema>;
export type BusinessTagCreateInput = z.infer<typeof businessTagCreateSchema>;
export type BusinessTypeTagCreateInput = z.infer<typeof businessTypeTagCreateSchema>;
export type BusinessToolCreateInput = z.infer<typeof businessToolCreateSchema>;
export type BusinessTypeToolCreateInput = z.infer<typeof businessTypeToolCreateSchema>;
export type BusinessResourceCreateInput = z.infer<typeof businessResourceCreateSchema>;
export type BusinessTypeResourceCreateInput = z.infer<typeof businessTypeResourceCreateSchema>;
