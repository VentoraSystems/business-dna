"use server";

import { db } from "@/lib/db";
import { requireCurrentUser } from "@/lib/auth";
import { blueprintContentSchema, type BlueprintContent } from "@/features/business-engine/schemas/blueprint-content";
import type { BlueprintStatus } from "@prisma/client";

export interface BlueprintStatusResult {
  status: BlueprintStatus;
  /** Only populated when status is "ready" — content written mid-generation (pending/generating/failed) is a placeholder, not real. */
  content: BlueprintContent | null;
  error: string | null;
}

/**
 * Read path the polling UI calls. Returns `null` when no Blueprint row
 * exists yet for this Business (distinct from a Blueprint that exists but
 * hasn't started generating — there's no "not requested yet" status value,
 * since a row is only ever created at the moment generation is requested).
 */
export async function getBlueprintStatus(businessId: string): Promise<BlueprintStatusResult | null> {
  const user = await requireCurrentUser();

  const business = await db.business.findUnique({ where: { id: businessId } });
  if (!business || business.userId !== user.id) {
    throw new Error("BUSINESS_NOT_FOUND");
  }

  const blueprint = await db.blueprint.findUnique({ where: { businessId } });
  if (!blueprint) return null;

  if (blueprint.status !== "ready") {
    return { status: blueprint.status, content: null, error: blueprint.error };
  }

  const parsed = blueprintContentSchema.safeParse(blueprint.content);
  return {
    status: blueprint.status,
    content: parsed.success ? parsed.data : null,
    error: parsed.success ? null : "Stored content did not match the expected shape.",
  };
}
