import type { Locale } from "@/i18n/config";
import type { RawAssessmentAnswers } from "@/features/matching-engine/types/assessment-input";
import type { BlueprintGenerationContext } from "@/features/business-engine/utils/blueprint-generation-context";
import { withLocaleInstruction } from "./business-match";

/**
 * The 15 canonical section keys. Part A's routing/schema/actions import
 * this — kept stable in shape even though the prompt-building functions
 * below were rewritten for per-section generation.
 */
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

export type BlueprintSectionKey = (typeof BLUEPRINT_SECTION_KEYS)[number];

/** launchPlan/growthPlan produce an actionable task list (see section-content.ts's roadmapPlanSectionContentSchema) instead of prose — Roadmap Part 2 enriches Part 1's deterministic seed with these, additively. */
const ROADMAP_TASK_SECTION_KEYS = new Set<BlueprintSectionKey>(["launchPlan", "growthPlan"]);

/**
 * Locale bug fix (see git history / task report for the full
 * investigation): the locale VALUE was never wrong — Blueprint.locale is
 * set from the real signed-in user's locale at generation-request time,
 * same as every other locale-aware feature in this app. The old
 * all-at-once design's single generic withLocaleInstruction() line, stated
 * once at the top of a system prompt asked to produce 15 sections'
 * worth of JSON in one huge call, was too weak — especially with English
 * source material (blueprint.md, ai-notes.md are intentionally
 * English-only "authoring hint" files, not user-facing content) sitting
 * right there in the same prompt as grounding context. Per-section calls
 * are shorter and narrower in scope, which helps on their own, but this
 * prompt also repeats an explicit, forceful, JSON-key-safe directive at
 * three points (system prompt, top of user prompt, output-format footer)
 * rather than relying on withLocaleInstruction()'s single generic line.
 *
 * Deliberately NOT edited: withLocaleInstruction() itself, since it's
 * shared with the Matching Engine and AI Co-Founder prompts, which
 * haven't been reported as having this problem — strengthening locale
 * compliance for Blueprint sections specifically shouldn't risk changing
 * behavior for those other, unrelated call sites.
 */
const STRONG_LOCALE_DIRECTIVE: Record<Locale, string> = {
  en: "Write every text value in your JSON response entirely in English.",
  ro: [
    "Scrie fiecare valoare de tip text din răspunsul tău JSON exclusiv în limba română.",
    "Nu amesteca engleza cu româna în interiorul unei valori și nu lăsa propoziții sau cuvinte netraduse.",
    'IMPORTANT: numele câmpurilor din obiectul JSON (de exemplu "body", "strengths", "keyPartners") rămân neschimbate, exact cum sunt specificate mai jos — doar VALORILE text trebuie să fie în română, nu și cheile JSON.',
  ].join(" "),
};

function buildLocaleReinforcement(locale: Locale): string {
  return STRONG_LOCALE_DIRECTIVE[locale];
}

/**
 * Per-section length/depth targets. Word counts are guidance to push the
 * model past a shallow default, not a hard requirement the schema
 * enforces (see section-content.ts's loose min(500)-char floor) — a
 * genuinely strong 350-word answer shouldn't be rejected for missing an
 * arbitrary count by a few words.
 */
const SECTION_LENGTH_GUIDANCE: Record<BlueprintSectionKey, string> = {
  executiveSummary:
    "Write 400-600 words. Open with what the business is and who it's for, then state the user's real budget, target monthly income, and timeline as their concrete starting point, then close with why this specific business fits this specific user's assessment profile.",
  businessDescription:
    "Write 400-600 words covering: what the business does day-to-day, the core offer, how it makes money, and what makes it different from the obvious alternative someone would consider instead.",
  targetAudience:
    "Write 400-600 words. Describe 2-3 concrete customer segments (not one vague persona) with specific pain points, where to find them, and what makes each segment ready to buy now versus later.",
  marketAnalysis:
    "Write 500-700 words. Cover market size/demand signals, timing (why now), and at least 2 specific trends or shifts that favor this business — grounded in the reference material, not generic 'growing market' filler.",
  competitorAnalysis:
    "Write 500-700 words. Name at least 3 concrete types of competing options (not just 'other businesses in this space') and for each, state their specific weakness this business exploits. Synthesize this from the market-position and competitive-advantage facts provided — there is no pre-written source for this section.",
  marketingPlan:
    "Write 500-700 words. Include a specific positioning statement, 2-3 named channels with concrete first actions for each (not just channel names), and one measurable early milestone (e.g. 'first 10 customers via X within Y weeks').",
  salesStrategy:
    "Write 500-700 words. Describe the actual sales motion step by step (first contact to closed deal), a realistic sales cycle length, and how the user's own sales/negotiation skill level (from their assessment) should shape their approach — e.g. lean harder on process and scripts if their rated skill is low, on relationship-selling if it's high.",
  financialForecast:
    "Write 600-900 words — this section carries more numeric detail than the others. Build the forecast around the user's OWN budget and target monthly income (not the business's generic range), state concrete startup cost line items that fit within their real budget, a realistic break-even estimate given their real numbers, and 3 monthly revenue milestones (e.g. month 3 / month 6 / month 12) with specific figures.",
  operations:
    "Write 500-700 words covering the core recurring workflow, the tools/software actually needed to run it, and which parts the user should do themselves at their current skill/time-availability level versus delegate or automate.",
  launchPlan:
    "Produce 4-8 concrete, personalized action items (not prose) explicitly built around the user's REAL desired timeline, budget, and skill ratings from their assessment — not a generic checklist. Each item must be specific enough that the user could act on it this week (a named first step, not a vague phase label like \"prepare for launch\"). If their real timeline is shorter or longer than typical for this business, the items' pacing should reflect that explicitly.",
  growthPlan:
    "Produce 4-8 concrete, personalized action items (not prose) covering the first scaling lever (e.g. a specific hire, channel, or segment), grounded in the user's real budget and skill ratings — e.g. lean toward a channel/tactic that fits their actual marketing/sales skill level, not a generic \"hire a marketer\" suggestion if their budget can't support it. Each item must be specific enough to act on, not a vague milestone label.",
  riskAnalysis:
    "Write 500-700 words identifying the 3 biggest real risks (grounded in the reference material's risk data, not generic business risks), a specific mitigation for each, and how the user's own risk tolerance and financial cushion (from their assessment) should shape how cautiously they proceed.",
  exitStrategy:
    "Write 400-600 words covering 2-3 realistic exit paths for this specific business (acquisition by a specific type of buyer, founder buyout, gradual wind-down, etc.), what makes the business attractive for each path, and roughly what timeframe/milestone would make an exit realistic.",
  swot:
    "Each of the 4 arrays (strengths, weaknesses, opportunities, threats) must contain 4-6 specific, concrete bullet points grounded in real facts from the reference material — never generic filler like 'strong team' or 'growing market' that could apply to any business. Synthesize this from the risk/advantage/market/financial facts provided — there is no pre-written source for this section.",
  businessModelCanvas:
    "Each of the 9 fields must be 2-4 sentences of real substance (not a one-line label). Synthesize this from the offer/revenue/marketing/sales/operations facts provided — there is no pre-written source for this section.",
};

/**
 * Which slices of the gathered business content are relevant to each
 * section — keeps each per-section prompt focused and reasonably small
 * instead of repeating the entire ~36K-character context on every call
 * (the old all-at-once design's approach). `businessDna` keys index into
 * BlueprintGenerationContext.businessDna (see blueprint-generation-context.ts).
 */
interface SectionContextSelection {
  businessDnaKeys: string[];
  includeMarketing?: boolean;
  includeFinancial?: boolean;
  includeBusinessInsights?: boolean;
}

const SECTION_CONTEXT_SELECTION: Record<BlueprintSectionKey, SectionContextSelection> = {
  executiveSummary: { businessDnaKeys: ["identity", "founderFit", "businessCharacteristics"] },
  businessDescription: { businessDnaKeys: ["identity", "businessCharacteristics", "operationsDna"] },
  targetAudience: { businessDnaKeys: ["marketingDna", "businessCharacteristics"], includeMarketing: true },
  marketAnalysis: { businessDnaKeys: ["businessCharacteristics", "scalabilityDna"], includeBusinessInsights: true },
  competitorAnalysis: { businessDnaKeys: ["successDna"], includeBusinessInsights: true },
  swot: {
    businessDnaKeys: ["riskDna", "successDna", "scalabilityDna", "growthDna"],
    includeFinancial: true,
    includeBusinessInsights: true,
  },
  businessModelCanvas: {
    businessDnaKeys: ["marketingDna", "salesDna", "operationsDna", "revenueDna"],
    includeMarketing: true,
    includeFinancial: true,
  },
  marketingPlan: { businessDnaKeys: ["marketingDna"], includeMarketing: true },
  salesStrategy: { businessDnaKeys: ["salesDna", "skillDna"] },
  financialForecast: { businessDnaKeys: ["financialDna", "revenueDna"], includeFinancial: true },
  operations: { businessDnaKeys: ["operationsDna", "technologyDna"] },
  launchPlan: { businessDnaKeys: ["growthDna", "lifestyleDna"] },
  growthPlan: { businessDnaKeys: ["growthDna", "scalabilityDna"] },
  riskAnalysis: { businessDnaKeys: ["riskDna"], includeFinancial: true, includeBusinessInsights: true },
  exitStrategy: { businessDnaKeys: ["growthDna", "successDna"] },
};

export function buildSectionSystemPrompt(locale: Locale, sectionKey: BlueprintSectionKey): string {
  const base = withLocaleInstruction(
    locale,
    `You are BusinessDNA's Business Plan generator, writing ONE section ("${sectionKey}") of a personalized business plan for ONE specific user matched to ONE specific business concept, grounded in that business's real authored reference material and this user's real assessment answers.

Rules:
- Ground every fact about the business concept in the reference material provided. Do not invent details that contradict it.
- Personalize this section's content to the user's own assessment answers wherever the topic intersects with them — not as a token mention, but concretely (their real numbers, their real skill ratings, their real timeline) wherever it's relevant to what this section covers.
- Write like an experienced industry consultant delivering a paid deliverable: specific steps, numbers, timelines, named tools/channels/tactics. Never generic filler that could apply to any business.
- Return ONLY the JSON object described in the user message. No markdown fences, no commentary outside the JSON.`
  );
  return [base, "", buildLocaleReinforcement(locale)].join("\n");
}

function formatSection(title: string, body: string): string {
  return body ? `### ${title}\n${body}` : "";
}

function pickBusinessDna(context: BlueprintGenerationContext, keys: string[]): Record<string, unknown> {
  const picked: Record<string, unknown> = {};
  for (const key of keys) {
    if (key in context.businessDna) picked[key] = context.businessDna[key];
  }
  return picked;
}

function buildOutputFormatLines(sectionKey: BlueprintSectionKey): string[] {
  if (sectionKey === "swot") {
    return [`Return a single JSON object with exactly these 4 keys, each an array of strings: strengths, weaknesses, opportunities, threats.`];
  }
  if (sectionKey === "businessModelCanvas") {
    return [
      `Return a single JSON object with exactly these 9 string keys: keyPartners, keyActivities, keyResources, valuePropositions, customerRelationships, channels, customerSegments, costStructure, revenueStreams.`,
    ];
  }
  if (ROADMAP_TASK_SECTION_KEYS.has(sectionKey)) {
    return [
      `Return a single JSON object with exactly one key: "tasks", an array of 4-8 objects.`,
      `Each task object has exactly 3 keys: "title" (a short, specific action, not a phase label), "description" (1-2 sentences of concrete detail — what to actually do, and why it matters for this specific user), and "xpValue" (an integer 5-25 — harder/more impactful tasks get a higher value, quick/easy ones lower).`,
    ];
  }
  return [`Return a single JSON object with exactly one key: "body", a single string containing this section's full text.`];
}

export function buildSectionUserPrompt(
  context: BlueprintGenerationContext,
  rawAnswers: RawAssessmentAnswers,
  sectionKey: BlueprintSectionKey
): string {
  const selection = SECTION_CONTEXT_SELECTION[sectionKey];
  const pickedDna = pickBusinessDna(context, selection.businessDnaKeys);
  const outputFormatLines = buildOutputFormatLines(sectionKey);

  return [
    buildLocaleReinforcement(context.locale),
    "",
    `## Section to write: ${sectionKey}`,
    context.promptContext ? `Business one-line context: ${context.promptContext}` : "",
    "",
    formatSection("Relevant structured business facts (authored, verified — treat as ground truth)", JSON.stringify(pickedDna, null, 2)),
    "",
    formatSection(
      "Blueprint authoring notes (25-section prose reference — mine this for real facts relevant to this section, do not copy verbatim)",
      context.blueprintNotes
    ),
    "",
    formatSection("AI generation hints authored specifically for this business", context.aiNotes),
    "",
    selection.includeMarketing ? formatSection("Marketing reference data", JSON.stringify(context.marketing, null, 2)) : "",
    "",
    selection.includeFinancial
      ? formatSection(
          "Financial reference data — this is the business's GENERIC range. The user's own figures below take priority.",
          JSON.stringify(context.financial, null, 2)
        )
      : "",
    "",
    selection.includeBusinessInsights
      ? formatSection("Business insights (hidden risks/opportunities, common mistakes, patterns worth citing)", JSON.stringify(context.businessInsights, null, 2))
      : "",
    "",
    "## This user's real assessment answers",
    "Personalize this section to these wherever relevant — especially `budget`, `targetMonthlyIncome`, `desiredTimeline`, `riskTolerance`, and skill ratings.",
    JSON.stringify(rawAnswers.answers, null, 2),
    "",
    "## Length and depth requirement for this section",
    SECTION_LENGTH_GUIDANCE[sectionKey],
    "",
    "## Output format",
    ...outputFormatLines,
    buildLocaleReinforcement(context.locale),
  ]
    .filter(Boolean)
    .join("\n");
}
