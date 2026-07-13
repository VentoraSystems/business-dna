"use server";

import { waitUntil } from "@vercel/functions";
import { db } from "@/lib/db";
import { requireCurrentUser } from "@/lib/auth";
import { BLUEPRINT_SECTION_KEYS } from "@/ai/prompts/blueprint";

export type BlueprintSectionKey = (typeof BLUEPRINT_SECTION_KEYS)[number];

export interface RequestSectionGenerationResult {
  sectionId: string;
}

/**
 * Background pattern unchanged from the original whole-document trigger
 * (Part 1/2): waitUntil() from @vercel/functions, since this app's Next
 * version (14.2) predates the stable after() API. See
 * git history for the full "why waitUntil" rationale.
 *
 * Per-section trigger: upserts the parent Blueprint row (identity/locale
 * only now — see prisma/schema.prisma), then upserts THIS section to
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

/** Stand-in for the artificial latency a real AI call would have. */
const STUB_GENERATION_DELAY_MS = 1500;

/**
 * STUB — this phase only proves the per-section trigger -> background ->
 * status-flip mechanism works. Real, expanded, per-section AI generation
 * (grounded content, richer per-section shape) is a later phase, built on
 * top of this same trigger — same "prove the mechanism before building the
 * expensive prompt on top of it" reasoning as the original Part 1.
 */
async function generateSectionContent(sectionId: string): Promise<void> {
  try {
    await new Promise((resolve) => setTimeout(resolve, STUB_GENERATION_DELAY_MS));

    await db.blueprintSection.update({
      where: { id: sectionId },
      data: {
        status: "ready",
        error: null,
        content: {
          _stub: true,
          generatedAt: new Date().toISOString(),
          body: "Stub content — real per-section generation lands in a later phase.",
        },
      },
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
