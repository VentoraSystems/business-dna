import { z } from "zod";
import { roadmapAiMetadataSchema, roadmapStageSchema } from "./sections.schema";

/** Not annotated `z.ZodType<Roadmap>` so `.partial()` remains available for `roadmapUpdateSchema` — same reasoning as the other Business Assets composite schemas. */
export const roadmapSchema = z.object({
  stages: z.array(roadmapStageSchema),
  aiMetadata: roadmapAiMetadataSchema,
});

export type RoadmapSchemaOutput = z.infer<typeof roadmapSchema>;

export const roadmapCreateSchema = roadmapSchema;
export const roadmapUpdateSchema = roadmapSchema.partial();
