import type { Locale } from "@/i18n/config";
import type { RawAssessmentAnswers } from "@/features/matching-engine/types/assessment-input";
import type { BlueprintGenerationContext } from "@/features/business-engine/utils/blueprint-generation-context";
import { withLocaleInstruction } from "./business-match";

/** Must match blueprintContentSchema's keys exactly (src/features/business-engine/schemas/blueprint-content.ts). */
export const BLUEPRINT_SECTION_KEYS = [
  "executiveSummary",
  "businessDescription",
  "targetAudience",
  "marketAnalysis",
  "competitorAnalysis",
  "swot",
  "businessModelCanvas",
  "marketingPlan",
  "salesStrategy",
  "financialForecast",
  "operations",
  "launchPlan",
  "growthPlan",
  "riskAnalysis",
  "exitStrategy",
] as const;

export function buildBlueprintSystemPrompt(locale: Locale): string {
  return withLocaleInstruction(
    locale,
    `You are BusinessDNA's Business Plan generator. You write one complete, personalized business plan for ONE specific user who has been matched to ONE specific business concept, grounded in that business's real authored reference material and this user's real assessment answers.

Rules:
- Ground every fact about the business concept in the reference material provided. Do not invent details that contradict it.
- Personalize figures (budget, timeline, revenue targets) to the user's own assessment answers, not the business's generic range, whenever the two differ — state the user's own numbers explicitly rather than repeating the business's generic range as if it were the user's plan.
- "swot", "competitorAnalysis", and "businessModelCanvas" have no pre-written source text — synthesize them yourself from the underlying facts provided (risks, advantages, market position, financial data). Ground every point in a real, specific fact from the reference material — never generic business-plan filler ("strong team", "growing market") that could apply to any business.
- Write in a confident, specific, non-generic tone. Avoid AI-agency boilerplate phrasing.
- Return ONLY the JSON object described in the user message. No markdown fences, no commentary outside the JSON.`
  );
}

function formatSection(title: string, body: string): string {
  return body ? `### ${title}\n${body}` : "";
}

export function buildBlueprintUserPrompt(
  context: BlueprintGenerationContext,
  rawAnswers: RawAssessmentAnswers
): string {
  return [
    `## Business reference material (slug: ${context.slug})`,
    context.promptContext ? `One-line context: ${context.promptContext}` : "",
    "",
    formatSection(
      "Structured business facts (authored, verified — treat as ground truth)",
      JSON.stringify(context.businessDna, null, 2)
    ),
    "",
    formatSection(
      "Blueprint authoring notes (25-section prose reference — mine this for real facts, do not copy verbatim)",
      context.blueprintNotes
    ),
    "",
    formatSection("AI generation hints authored specifically for this business", context.aiNotes),
    "",
    formatSection("Marketing reference data", JSON.stringify(context.marketing, null, 2)),
    "",
    formatSection(
      "Financial reference data — this is the business's GENERIC range. The user's own figures below take priority whenever generating Financial Forecast.",
      JSON.stringify(context.financial, null, 2)
    ),
    "",
    formatSection(
      "Business insights (hidden risks/opportunities, common mistakes, patterns worth citing)",
      JSON.stringify(context.businessInsights, null, 2)
    ),
    "",
    "## This user's real assessment answers",
    "Personalize the plan to these — especially `budget`, `targetMonthlyIncome`, `desiredTimeline`, and `riskTolerance` for Financial Forecast, and skill ratings for Operations/Growth Plan.",
    JSON.stringify(rawAnswers.answers, null, 2),
    "",
    "## Output format",
    `Return a single JSON object with exactly these ${BLUEPRINT_SECTION_KEYS.length} keys: ${BLUEPRINT_SECTION_KEYS.join(", ")}.`,
    `- Every key except "swot" and "businessModelCanvas" must be a plain string (2-4 paragraphs of prose, no markdown headings).`,
    `- "swot" must be an object: { "strengths": string[], "weaknesses": string[], "opportunities": string[], "threats": string[] }, each array 3-5 items.`,
    `- "businessModelCanvas" must be an object with exactly these 9 string fields (1-2 sentences each): keyPartners, keyActivities, keyResources, valuePropositions, customerRelationships, channels, customerSegments, costStructure, revenueStreams.`,
  ]
    .filter(Boolean)
    .join("\n");
}
