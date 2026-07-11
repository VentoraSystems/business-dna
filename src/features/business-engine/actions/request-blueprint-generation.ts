"use server";

import { waitUntil } from "@vercel/functions";
import { db } from "@/lib/db";
import { requireCurrentUser } from "@/lib/auth";

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
 * the actual generation work to generateBlueprintContent() via
 * waitUntil(), so this action returns immediately. generateBlueprintContent()
 * is a stub in this phase (Part 1) — it just proves the
 * trigger -> background -> status-flip mechanism works. The real AI
 * generation logic is Part 2.
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

/** Stand-in for the artificial latency a real AI call (Part 2) would have. */
const STUB_GENERATION_DELAY_MS = 1500;

/**
 * STUB — Part 1 only. Sets status to "ready" with a hardcoded test
 * payload after a short simulated delay. Real prompt/AI generation logic
 * is Part 2, built on top of this same trigger.
 */
async function generateBlueprintContent(blueprintId: string): Promise<void> {
  try {
    await new Promise((resolve) => setTimeout(resolve, STUB_GENERATION_DELAY_MS));

    await db.blueprint.update({
      where: { id: blueprintId },
      data: {
        status: "ready",
        error: null,
        content: {
          _stub: true,
          generatedAt: new Date().toISOString(),
          sections: [
            { key: "executiveSummary", body: "Stub content — real generation lands in Part 2." },
          ],
        },
      },
    });
  } catch (error) {
    await db.blueprint
      .update({
        where: { id: blueprintId },
        data: { status: "failed", error: error instanceof Error ? error.message : "Unknown error" },
      })
      .catch(() => {});
  }
}
