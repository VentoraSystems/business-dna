import { z } from "zod";

/**
 * The 15 Business Plan sections rendered by the (existing, hardcoded)
 * `/blueprint` page — see messages/*.json's `blueprint.sections.*` keys.
 * Not the same as features/blueprint's disconnected 25-section "v2" schema.
 *
 * 13 of 15 sections are plain prose strings. Two deviate, each for a
 * concrete structural reason (stated per the task's instruction to be
 * explicit about any deviation from plain strings):
 * - `swot`: naturally a 4-bucket list, not a paragraph — keeping it a
 *   flat string would force the model to fake bullet formatting inside
 *   prose instead of returning real structure a future UI can render as
 *   four columns.
 * - `businessModelCanvas`: the Business Model Canvas is inherently a
 *   9-block framework (Osterwalder) — collapsing it to one string would
 *   lose the block boundaries a future UI would want to render as a grid.
 */
export const swotSchema = z.object({
  strengths: z.array(z.string().min(1)).min(1),
  weaknesses: z.array(z.string().min(1)).min(1),
  opportunities: z.array(z.string().min(1)).min(1),
  threats: z.array(z.string().min(1)).min(1),
});

export const businessModelCanvasSchema = z.object({
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

export const blueprintContentSchema = z.object({
  executiveSummary: z.string().min(1),
  businessDescription: z.string().min(1),
  targetAudience: z.string().min(1),
  marketAnalysis: z.string().min(1),
  competitorAnalysis: z.string().min(1),
  swot: swotSchema,
  businessModelCanvas: businessModelCanvasSchema,
  marketingPlan: z.string().min(1),
  salesStrategy: z.string().min(1),
  financialForecast: z.string().min(1),
  operations: z.string().min(1),
  launchPlan: z.string().min(1),
  growthPlan: z.string().min(1),
  riskAnalysis: z.string().min(1),
  exitStrategy: z.string().min(1),
});

export type BlueprintContent = z.infer<typeof blueprintContentSchema>;
export type SwotContent = z.infer<typeof swotSchema>;
export type BusinessModelCanvasContent = z.infer<typeof businessModelCanvasSchema>;
