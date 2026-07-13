"use server";

import { waitUntil } from "@vercel/functions";
import { db } from "@/lib/db";
import { requireCurrentUser } from "@/lib/auth";
import { openai } from "@/ai/openai";
import { buildSectionSystemPrompt, buildSectionUserPrompt } from "@/ai/prompts/blueprint";
import type { BlueprintSectionKey } from "@/ai/prompts/blueprint";
import { readBlueprintGenerationContext } from "@/features/business-engine/utils/blueprint-generation-context";
import { getSectionContentSchema } from "@/features/business-engine/schemas/section-content";
import { fetchRawAnswersForMatching } from "@/features/assessment/actions/fetch-raw-answers";
import type { Locale } from "@/i18n/config";

// "use server" files may only export async functions — BlueprintSectionKey is a type-only
// export (erased at runtime), which the react-server compiler allows; BLUEPRINT_SECTION_KEYS
// (a real value) is NOT re-exported here for that reason — import it from @/ai/prompts/blueprint.
export type { BlueprintSectionKey };

export interface RequestSectionGenerationResult {
  sectionId: string;
}

/**
 * Background pattern unchanged from the original whole-document trigger
 * (Part 1/2): waitUntil() from @vercel/functions, since this app's Next
 * version (14.2) predates the stable after() API. See git history for
 * the full "why waitUntil" rationale.
 *
 * Per-section trigger: upserts the parent Blueprint row (identity/locale
 * only — see prisma/schema.prisma), then upserts THIS section to
 * "generating" and hands off to generateSectionContent() via waitUntil(),
 * so this action returns immediately without the caller blocking on it.
 * Re-requesting an already-"ready" section resets it and regenerates —
 * the UI only calls this for sections that aren't already ready (see
 * SectionView), so an explicit "don't regenerate on revisit" guard lives
 * there, not here.
 */
export async function requestSectionGeneration(
  businessId: string,
  sectionKey: BlueprintSectionKey
): Promise<RequestSectionGenerationResult> {
  const user = await requireCurrentUser();

  const business = await db.business.findUnique({ where: { id: businessId } });
  if (!business || business.userId !== user.id) {
    throw new Error("BUSINESS_NOT_FOUND");
  }

  const blueprint = await db.blueprint.upsert({
    where: { businessId },
    update: {},
    create: { businessId, locale: user.locale },
  });

  const section = await db.blueprintSection.upsert({
    where: { blueprintId_sectionKey: { blueprintId: blueprint.id, sectionKey } },
    update: { status: "generating", error: null },
    create: { blueprintId: blueprint.id, sectionKey, status: "generating" },
  });

  waitUntil(generateSectionContent(section.id));

  return { sectionId: section.id };
}

const MODEL = "gpt-4o-mini";

/**
 * One full model call for one section: build the section-scoped prompt
 * from real business/user content, call the model with
 * response_format: { type: "json_object" } (loose JSON-mode — the
 * per-section Zod schema is what actually guarantees the right shape),
 * parse, validate. Throws on any failure — the caller retries once.
 */
async function generateAndValidateSection(
  slug: string,
  locale: Locale,
  assessmentId: string,
  sectionKey: BlueprintSectionKey
): Promise<unknown> {
  const context = await readBlueprintGenerationContext(slug, locale);
  const rawAnswers = await fetchRawAnswersForMatching(assessmentId);

  const systemPrompt = buildSectionSystemPrompt(locale, sectionKey);
  const userPrompt = buildSectionUserPrompt(context, rawAnswers, sectionKey);

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
  return getSectionContentSchema(sectionKey).parse(parsed);
}

/**
 * Real AI generation, one section at a time — replaces the earlier
 * hardcoded stub entirely. Validates the response against that section's
 * Zod schema before persisting; on failure, retries once; if the retry
 * also fails, persists status "failed" with a clear error instead of
 * malformed content.
 */
async function generateSectionContent(sectionId: string): Promise<void> {
  try {
    const section = await db.blueprintSection.findUniqueOrThrow({
      where: { id: sectionId },
      include: { blueprint: { include: { business: { include: { businessType: true } } } } },
    });
    const sectionKey = section.sectionKey as BlueprintSectionKey;
    const { business } = section.blueprint;

    if (!business.businessTypeId || !business.businessType) {
      throw new Error("Business has no linked BusinessType — cannot generate a section without one.");
    }
    if (!business.assessmentId) {
      throw new Error("Business has no linked Assessment — cannot personalize a section without one.");
    }

    let content: unknown;
    try {
      content = await generateAndValidateSection(business.businessType.slug, section.blueprint.locale, business.assessmentId, sectionKey);
    } catch {
      // First attempt's API call, JSON parse, or schema validation failed — retry once before giving up.
      content = await generateAndValidateSection(business.businessType.slug, section.blueprint.locale, business.assessmentId, sectionKey);
    }

    await db.blueprintSection.update({
      where: { id: sectionId },
      data: { status: "ready", error: null, content: content as object },
    });
  } catch (error) {
    await db.blueprintSection
      .update({
        where: { id: sectionId },
        data: { status: "failed", error: error instanceof Error ? error.message.slice(0, 2000) : "Unknown error" },
      })
      .catch(() => {});
  }
}
