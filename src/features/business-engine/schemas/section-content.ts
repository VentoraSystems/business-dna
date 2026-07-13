import { z } from "zod";
import { BLUEPRINT_SECTION_KEYS } from "@/ai/prompts/blueprint";

/**
 * Independent type derivation (not imported from
 * request-section-generation.ts) to avoid a circular import — that file
 * will need to import getSectionContentSchema from here.
 */
type BlueprintSectionKey = (typeof BLUEPRINT_SECTION_KEYS)[number];

/**
 * 13 of 15 sections are a single long-form prose field. `min(500)` is a
 * loose floor to catch a degenerate one-sentence response, NOT an attempt
 * to programmatically enforce the 400-700 word target — that's the
 * prompt's job (see buildSectionUserPrompt's per-section length guidance).
 */
export const proseSectionContentSchema = z.object({
  body: z.string().min(500),
});

export const swotSectionContentSchema = z.object({
  strengths: z.array(z.string().min(1)).min(3),
  weaknesses: z.array(z.string().min(1)).min(3),
  opportunities: z.array(z.string().min(1)).min(3),
  threats: z.array(z.string().min(1)).min(3),
});

export const businessModelCanvasSectionContentSchema = z.object({
  keyPartners: z.string().min(1),
  keyActivities: z.string().min(1),
  keyResources: z.string().min(1),
  valuePropositions: z.string().min(1),
  customerRelationships: z.string().min(1),
  channels: z.string().min(1),
  customerSegments: z.string().min(1),
  costStructure: z.string().min(1),
  revenueStreams: z.string().min(1),
});

export function getSectionContentSchema(sectionKey: BlueprintSectionKey) {
  if (sectionKey === "swot") return swotSectionContentSchema;
  if (sectionKey === "businessModelCanvas") return businessModelCanvasSectionContentSchema;
  return proseSectionContentSchema;
}

export type ProseSectionContent = z.infer<typeof proseSectionContentSchema>;
export type SwotSectionContent = z.infer<typeof swotSectionContentSchema>;
export type BusinessModelCanvasSectionContent = z.infer<typeof businessModelCanvasSectionContentSchema>;
export type SectionContent = ProseSectionContent | SwotSectionContent | BusinessModelCanvasSectionContent;
