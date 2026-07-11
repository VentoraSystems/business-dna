/**
 * Phase 0 verification script — not a test, not part of the app. Exercises
 * the real "adopt a match" flow: BusinessMatchResult -> Business, using the
 * same underlying pieces adoptBusinessMatch() calls
 * (businessMatchRepository.findById, readBusinessDisplayContent,
 * db.business.create/findUnique) — the action itself is gated behind
 * requireCurrentUser() (Clerk), which has no meaning outside a real
 * request, so a throwaway User stands in for a signed-in user, same as the
 * other *-check.ts scripts in this directory.
 *
 * Also verifies the /businesses/[businessId] page's query shape, and the
 * two schema findings from the STEP 1 report:
 *   1. Business.matchResultId is unique -> re-adopting the same match
 *      result is idempotent (returns the same Business, no duplicate row).
 *   2. There is no [userId, businessTypeId] uniqueness constraint on
 *      Business -> adopting two different match results that reference the
 *      same BusinessType produces two separate Business rows.
 *
 * Run with `npm run adopt-business-match:check`.
 */
import { randomUUID } from "node:crypto";
import { db } from "../src/lib/db";
import { businessMatchRepository } from "../src/features/business-engine/repositories";
import { readBusinessDisplayContent } from "../src/features/business-engine/utils/business-display-content";

/** Mirrors adoptBusinessMatch()'s logic exactly (see src/features/business-engine/actions/adopt-business-match.ts), minus the requireCurrentUser() call this script can't satisfy outside a real request. */
async function adoptForUser(user: { id: string; locale: "en" | "ro" }, matchResultId: string) {
  const matchResult = await businessMatchRepository.findById(matchResultId);
  if (!matchResult || matchResult.userId !== user.id) throw new Error("MATCH_RESULT_NOT_FOUND");

  const existing = await db.business.findUnique({ where: { matchResultId } });
  if (existing) return { id: existing.id, wasExisting: true };

  const { businessType } = matchResult;
  const content = readBusinessDisplayContent(businessType.slug, user.locale);

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
  return { id: business.id, wasExisting: false };
}

async function main() {
  console.log("=== Step 1: create a throwaway User + two completed Assessments ===");
  const user = await db.user.create({
    data: { clerkId: `test_${randomUUID()}`, email: `test-${randomUUID()}@example.com`, locale: "en" },
  });

  const businessType = await db.businessType.findFirstOrThrow({
    where: { budget: { isNot: null } },
    include: { budget: true },
  });
  console.log(`Using BusinessType ${businessType.slug} (${businessType.id})`);

  async function makeAssessment() {
    const session = await db.assessmentSession.create({
      data: { userId: user.id, locale: "en", status: "completed", currentStep: 0 },
    });
    const assessment = await db.assessment.create({
      data: { userId: user.id, sessionId: session.id, locale: "en" },
    });
    return { session, assessment };
  }

  const { session: session1, assessment: assessment1 } = await makeAssessment();
  const matchResult1 = await businessMatchRepository.create({
    userId: user.id,
    assessmentId: assessment1.id,
    businessTypeId: businessType.id,
    compatibilityScore: 87.4,
  });
  console.log(`Created BusinessMatchResult ${matchResult1.id} for assessment ${assessment1.id}`);

  console.log("\n=== Step 2: adopt it ===");
  const adopted1 = await adoptForUser(user, matchResult1.id);
  console.log(`Adopted -> Business ${adopted1.id} (wasExisting=${adopted1.wasExisting})`);
  const businessCountAfterFirst = await db.business.count({ where: { userId: user.id } });
  console.log(`Business rows for user: ${businessCountAfterFirst}`);
  if (businessCountAfterFirst !== 1) throw new Error(`Expected 1 Business row, got ${businessCountAfterFirst}`);

  console.log("\n=== Step 3: re-adopt the same match result (idempotency check) ===");
  const adopted1Again = await adoptForUser(user, matchResult1.id);
  console.log(`Re-adopted -> Business ${adopted1Again.id} (wasExisting=${adopted1Again.wasExisting})`);
  if (adopted1Again.id !== adopted1.id) throw new Error("Re-adoption returned a different Business id!");
  if (!adopted1Again.wasExisting) throw new Error("Re-adoption did not report wasExisting=true!");
  const businessCountAfterReAdopt = await db.business.count({ where: { userId: user.id } });
  console.log(`Business rows for user (should still be 1): ${businessCountAfterReAdopt}`);
  if (businessCountAfterReAdopt !== 1) throw new Error(`Expected still 1 Business row, got ${businessCountAfterReAdopt}`);

  console.log("\n=== Step 4: adopt a second match result for the SAME BusinessType (duplicate-BusinessType check) ===");
  const { session: session2, assessment: assessment2 } = await makeAssessment();
  const matchResult2 = await businessMatchRepository.create({
    userId: user.id,
    assessmentId: assessment2.id,
    businessTypeId: businessType.id,
    compatibilityScore: 91.2,
  });
  const adopted2 = await adoptForUser(user, matchResult2.id);
  console.log(`Adopted second match -> Business ${adopted2.id} (wasExisting=${adopted2.wasExisting})`);
  const businessCountAfterSecond = await db.business.count({ where: { userId: user.id } });
  console.log(`Business rows for user (confirms no [userId,businessTypeId] constraint): ${businessCountAfterSecond}`);
  if (businessCountAfterSecond !== 2) {
    throw new Error(`Expected 2 Business rows (no uniqueness constraint on BusinessType), got ${businessCountAfterSecond}`);
  }

  console.log("\n=== Step 5: the exact query /businesses/[businessId]/page.tsx runs ===");
  const pageQueryResult = await db.business.findUnique({
    where: { id: adopted1.id },
    include: { businessType: { include: { timeline: true } } },
  });
  if (!pageQueryResult) throw new Error("Page query returned null for a Business that should exist!");
  if (pageQueryResult.userId !== user.id) throw new Error("Ownership check would have failed unexpectedly!");
  console.log(
    `Page would render: name="${pageQueryResult.name}" summary="${pageQueryResult.summary}" ` +
      `compatibility=${pageQueryResult.compatibility}% difficulty=${pageQueryResult.difficulty} ` +
      `investment=${pageQueryResult.investmentMin}-${pageQueryResult.investmentMax} ` +
      `scalability=${pageQueryResult.businessType?.scalabilityLevel} automation=${pageQueryResult.businessType?.automationLevel}`
  );

  console.log("\n=== Cleanup ===");
  await db.business.deleteMany({ where: { userId: user.id } });
  await db.businessMatchResult.deleteMany({ where: { userId: user.id } });
  await db.assessment.deleteMany({ where: { userId: user.id } });
  await db.assessmentSession.deleteMany({ where: { userId: user.id } });
  await db.user.delete({ where: { id: user.id } });
  console.log("Removed throwaway test data.");

  console.log("\n✅ All adopt-a-match checks passed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
