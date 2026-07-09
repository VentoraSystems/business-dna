import { z } from "zod";
import { BusinessDnaKpiKey } from "@/features/business-dna/types/sections/kpis";
import type { RoadmapAiMetadata, RoadmapStage } from "../types/sections";
import { RoadmapStageKey } from "../types/sections";

// ---------------------------------------------------------------------------
// Roadmap Stage
// ---------------------------------------------------------------------------

export const roadmapStageSchema: z.ZodType<RoadmapStage> = z.object({
  stage: z.nativeEnum(RoadmapStageKey),
  objectiveTranslationKeys: z.array(z.string()),
  deliverableTranslationKeys: z.array(z.string()),
  checklistTranslationKeys: z.array(z.string()),
  kpis: z.array(z.nativeEnum(BusinessDnaKpiKey)),
  commonMistakeTranslationKeys: z.array(z.string()),
  successCriteriaTranslationKeys: z.array(z.string()),
  aiRecommendationTranslationKeys: z.array(z.string()),
});

// ---------------------------------------------------------------------------
// AI Metadata
// ---------------------------------------------------------------------------

export const roadmapAiMetadataSchema: z.ZodType<RoadmapAiMetadata> = z.object({
  generationHintsTranslationKey: z.string().optional(),
  explanationHintsTranslationKey: z.string().optional(),
  matchingHintsTranslationKey: z.string().optional(),
});
