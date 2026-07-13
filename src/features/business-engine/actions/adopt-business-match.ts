"use server";

import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { requireCurrentUser } from "@/lib/auth";
import { businessMatchRepository } from "@/features/business-engine/repositories";
import { readBusinessDisplayContent } from "@/features/business-engine/utils/business-display-content";

export interface AdoptedBusiness {
  id: string;
}

/**
 * Turns a persisted BusinessMatchResult into a real, saved Business row —
 * the prerequisite step Blueprint generation (a later phase) will point at.
 * Idempotent: re-adopting the same match result returns the existing
 * Business instead of creating a duplicate (Business.matchResultId is
 * unique at the DB level; the P2002 catch below covers the race between
 * the read and the create).
 */
export async function adoptBusinessMatch(matchResultId: string): Promise<AdoptedBusiness> {
  const user = await requireCurrentUser();

  const matchResult = await businessMatchRepository.findById(matchResultId);
  if (!matchResult || matchResult.userId !== user.id) {
    throw new Error("MATCH_RESULT_NOT_FOUND");
  }

  const existing = await db.business.findUnique({ where: { matchResultId } });
  if (existing) return { id: existing.id };

  // NOT user.locale: nothing in this app ever sets it to anything but the schema's
  // @default(en) — same bug already fixed for Blueprint generation (see
  // requestSectionGeneration() in request-section-generation.ts). Assessment.locale is
  // reliably correct — threaded explicitly from the real page URL at assessment-start time
  // (getOrCreateActiveSession(locale) in assessment-actions.ts) — so it's queried directly
  // here rather than widening businessMatchRepository's shared include for one caller.
  const assessment = await db.assessment.findUnique({
    where: { id: matchResult.assessmentId },
    select: { locale: true },
  });
  const displayLocale = assessment?.locale ?? user.locale;

  const { businessType } = matchResult;
  const content = readBusinessDisplayContent(businessType.slug, displayLocale);

  try {
    const business = await db.business.create({
      data: {
        userId: user.id,
        assessmentId: matchResult.assessmentId,
        businessTypeId: businessType.id,
        matchResultId: matchResult.id,
        name: content.name,
        summary: content.tagline || content.shortDescription,
        compatibility: Math.round(matchResult.compatibilityScore),
        difficulty: businessType.difficulty,
        investmentMin: businessType.budget?.minInvestment,
        investmentMax: businessType.budget?.maxInvestment,
      },
    });
    return { id: business.id };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const raceWinner = await db.business.findUnique({ where: { matchResultId } });
      if (raceWinner) return { id: raceWinner.id };
    }
    throw error;
  }
}
