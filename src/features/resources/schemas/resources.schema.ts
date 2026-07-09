import { z } from "zod";
import { resourceItemSchema, resourcesAiMetadataSchema } from "./sections.schema";

/** Not annotated `z.ZodType<Resources>` so `.partial()` remains available for `resourcesUpdateSchema` — same reasoning as the other Business Assets composite schemas. */
export const resourcesSchema = z.object({
  resources: z.array(resourceItemSchema),
  aiMetadata: resourcesAiMetadataSchema,
});

export type ResourcesSchemaOutput = z.infer<typeof resourcesSchema>;

export const resourcesCreateSchema = resourcesSchema;
export const resourcesUpdateSchema = resourcesSchema.partial();
