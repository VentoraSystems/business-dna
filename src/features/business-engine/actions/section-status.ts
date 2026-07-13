"use server";

import { db } from "@/lib/db";
import { requireCurrentUser } from "@/lib/auth";
import type { BlueprintStatus } from "@prisma/client";
import { BLUEPRINT_SECTION_KEYS } from "@/ai/prompts/blueprint";
import type { BlueprintSectionKey } from "./request-section-generation";

export interface SectionStatusResult {
  status: BlueprintStatus;
  content: unknown;
  error: string | null;
}

/** Read path the per-section polling UI calls. `null` means this section hasn't been requested yet — there's no row. */
export async function getSectionStatus(
  businessId: string,
  sectionKey: BlueprintSectionKey
): Promise<SectionStatusResult | null> {
  const user = await requireCurrentUser();

  const business = await db.business.findUnique({ where: { id: businessId } });
  if (!business || business.userId !== user.id) {
    throw new Error("BUSINESS_NOT_FOUND");
  }

  const blueprint = await db.blueprint.findUnique({ where: { businessId } });
  if (!blueprint) return null;

  const section = await db.blueprintSection.findUnique({
    where: { blueprintId_sectionKey: { blueprintId: blueprint.id, sectionKey } },
  });
  if (!section) return null;

  return { status: section.status, content: section.content, error: section.error };
}

export interface SectionSummary {
  sectionKey: BlueprintSectionKey;
  status: BlueprintStatus | "none";
}

/** Landing page: one query for the status of all 15 sections at once, instead of 15 round trips. */
export async function listSectionStatuses(businessId: string): Promise<SectionSummary[]> {
  const user = await requireCurrentUser();

  const business = await db.business.findUnique({ where: { id: businessId } });
  if (!business || business.userId !== user.id) {
    throw new Error("BUSINESS_NOT_FOUND");
  }

  const blueprint = await db.blueprint.findUnique({
    where: { businessId },
    include: { sections: true },
  });

  const statusByKey = new Map(blueprint?.sections.map((section) => [section.sectionKey, section.status]) ?? []);
  return BLUEPRINT_SECTION_KEYS.map((sectionKey) => ({
    sectionKey,
    status: statusByKey.get(sectionKey) ?? "none",
  }));
}
