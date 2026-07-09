import { z } from "zod";
import type { ResourceItem, ResourcesAiMetadata } from "../types/sections";
import { ResourceCategoryKey } from "../types/sections";

// ---------------------------------------------------------------------------
// Resource Item
// ---------------------------------------------------------------------------

export const resourceItemSchema: z.ZodType<ResourceItem> = z.object({
  category: z.nativeEnum(ResourceCategoryKey),
  titleTranslationKey: z.string().min(1),
  descriptionTranslationKey: z.string().optional(),
  url: z.string().url().optional(),
});

// ---------------------------------------------------------------------------
// AI Metadata
// ---------------------------------------------------------------------------

export const resourcesAiMetadataSchema: z.ZodType<ResourcesAiMetadata> = z.object({
  generationHintsTranslationKey: z.string().optional(),
  explanationHintsTranslationKey: z.string().optional(),
  matchingHintsTranslationKey: z.string().optional(),
});
