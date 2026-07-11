"use server";

import { waitUntil } from "@vercel/functions";
import { db } from "@/lib/db";
import { requireCurrentUser } from "@/lib/auth";
import { openai } from "@/ai/openai";
import { buildBlueprintSystemPrompt, buildBlueprintUserPrompt } from "@/ai/prompts/blueprint";
import { readBlueprintGenerationContext } from "@/features/business-engine/utils/blueprint-generation-context";
import { blueprintContentSchema, type BlueprintContent } from "@/features/business-engine/schemas/blueprint-content";
import { fetchRawAnswersForMatching } from "@/features/assessment/actions/fetch-raw-answers";
import type { Locale } from "@/i18n/config";

export interface RequestBlueprintGenerationResult {
  blueprintId: string;
}

/**
 * Background pattern: this Next.js version (14.2) predates the stable
 * `after()` API (Next 15+), so `waitUntil()` from `@vercel/functions` is
 * used instead — it's the same primitive `after()` is built on. On Vercel
 * it keeps the serverless invocation alive until the passed promise
 * settles, without the caller (this action) awaiting it. Outside Vercel
 * (local dev, CI) `getContext().waitUntil` is undefined, so the call is a
 * no-op wrapper — the promise still runs to completion on Node's normal
 * event loop regardless, since there's no per-request Lambda to freeze.
 *
 * Fire-and-forget trigger: resets the Blueprint to "generating" and hands
 * the real generation work to generateBlueprintContent() via waitUntil(),
 * so this action returns immediately.
 */
export async function requestBlueprintGeneration(businessId: string): Promise<RequestBlueprintGenerationResult> {
  const user = await requireCurrentUser();

  const business = await db.business.findUnique({ where: { id: businessId } });
  if (!business || business.userId !== user.id) {
    throw new Error("BUSINESS_NOT_FOUND");
  }

  const blueprint = await db.blueprint.upsert({
    where: { businessId },
    update: { status: "generating", error: null },
    create: { businessId, locale: user.locale, status: "generating", content: {} },
  });

  waitUntil(generateBlueprintContent(blueprint.id));

  return { blueprintId: blueprint.id };
}

const MODEL = "gpt-4o-mini";

/**
 * One full model call: build the prompt from real business/user content,
 * call the model with `response_format: { type: "json_object" }` (loose
 * JSON-mode — guarantees syntactically valid JSON; blueprintContentSchema
 * below is what actually guarantees the exact 15 keys/shape, since
 * OpenAI's stricter `json_schema` Structured Outputs mode requires
 * `additionalProperties: false` and no-optional-fields at every nesting
 * level, which fights the swot/businessModelCanvas sub-objects for no real
 * benefit once Zod is validating anyway), then parse + validate. Throws on
 * any failure — the caller is responsible for retrying/giving up.
 */
async function generateAndValidate(
  slug: string,
  locale: Locale,
  assessmentId: string
): Promise<BlueprintContent> {
  const context = readBlueprintGenerationContext(slug, locale);
  const rawAnswers = await fetchRawAnswersForMatching(assessmentId);

  const systemPrompt = buildBlueprintSystemPrompt(locale);
  const userPrompt = buildBlueprintUserPrompt(context, rawAnswers);

  const completion = await openai.chat.completions.create({
    model: MODEL,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "";
  const parsed: unknown = JSON.parse(raw);
  return blueprintContentSchema.parse(parsed);
}

/**
 * Real AI generation (Part 2) — replaces Part 1's hardcoded stub entirely.
 * Validates the response against blueprintContentSchema before persisting;
 * on failure, retries once; if the retry also fails, persists status
 * "failed" with a clear error instead of malformed content.
 */
async function generateBlueprintContent(blueprintId: string): Promise<void> {
  try {
    const blueprint = await db.blueprint.findUniqueOrThrow({
      where: { id: blueprintId },
      include: { business: { include: { businessType: true } } },
    });
    const { business } = blueprint;
    if (!business.businessTypeId || !business.businessType) {
      throw new Error("Business has no linked BusinessType — cannot generate a Blueprint without one.");
    }
    if (!business.assessmentId) {
      throw new Error("Business has no linked Assessment — cannot personalize a Blueprint without one.");
    }

    let content: BlueprintContent;
    try {
      content = await generateAndValidate(business.businessType.slug, blueprint.locale, business.assessmentId);
    } catch {
      // Validation/parse/API failure on the first attempt — retry once before giving up.
      content = await generateAndValidate(business.businessType.slug, blueprint.locale, business.assessmentId);
    }

    await db.blueprint.update({
      where: { id: blueprintId },
      data: { status: "ready", error: null, content: content as object },
    });
  } catch (error) {
    await db.blueprint
      .update({
        where: { id: blueprintId },
        data: { status: "failed", error: error instanceof Error ? error.message.slice(0, 2000) : "Unknown error" },
      })
      .catch(() => {});
  }
}
