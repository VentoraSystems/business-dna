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

/**
 * Mirrors adoptBusinessMatch()'s logic exactly (see
 * src/features/business-engine/actions/adopt-business-match.ts), minus the
 * requireCurrentUser() call this script can't satisfy outside a real
 * request. Updated to match the locale fix: display content resolves from
 * the linked Assessment's locale (reliably correct), falling back to
 * user.locale only if no assessment locale is available — NOT user.locale
 * directly, which is always "en" in real production conditions (see
 * Step 5 below, which reproduces that specifically).
 */
async function adoptForUser(user: { id: string; locale: "en" | "ro" }, matchResultId: string) {
  const matchResult = await businessMatchRepository.findById(matchResultId);
  if (!matchResult || matchResult.userId !== user.id) throw new Error("MATCH_RESULT_NOT_FOUND");

  const existing = await db.business.findUnique({ where: { matchResultId } });
  if (existing) return { id: existing.id, wasExisting: true };

  const assessment = await db.assessment.findUnique({
    where: { id: matchResult.assessmentId },
    select: { locale: true },
  });
  const displayLocale = assessment?.locale ?? user.locale;

  const { businessType } = matchResult;
  const content = readBusinessDisplayContent(businessType.slug, displayLocale);

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

  console.log("\n=== Step 5: locale bug fix — reproduce the REAL bug conditions, not a sidestepped mock ===");
  console.log("A User created WITHOUT a locale field (matches getCurrentUser()'s upsert / the Clerk webhook in production),");
  console.log("with a Romanian-locale Assessment — confirms the adopted Business's display content resolves in Romanian");
  console.log("from the Assessment, not English from the always-default User.locale.");
  const roUser = await db.user.create({
    data: { clerkId: `test_${randomUUID()}`, email: `test-${randomUUID()}@example.com` },
  });
  console.log(`roUser.locale (as actually created in prod-like conditions): "${roUser.locale}"`);
  if (roUser.locale !== "en") throw new Error("Test setup assumption broke — expected the schema default to be 'en'.");

  const roSession = await db.assessmentSession.create({
    data: { userId: roUser.id, locale: "ro", status: "completed", currentStep: 0 },
  });
  const roAssessment = await db.assessment.create({
    data: { userId: roUser.id, sessionId: roSession.id, locale: "ro" },
  });
  const roMatchResult = await businessMatchRepository.create({
    userId: roUser.id,
    assessmentId: roAssessment.id,
    businessTypeId: businessType.id,
    compatibilityScore: 90.1,
  });
  const roAdopted = await adoptForUser({ id: roUser.id, locale: roUser.locale }, roMatchResult.id);
  const roBusiness = await db.business.findUniqueOrThrow({ where: { id: roAdopted.id } });
  console.log(`Adopted Business summary: "${roBusiness.summary}"`);

  const enContent = readBusinessDisplayContent(businessType.slug, "en");
  const roContent = readBusinessDisplayContent(businessType.slug, "ro");
  if (enContent.tagline === roContent.tagline) {
    throw new Error("Test setup assumption broke — expected this business's EN/RO taglines to differ so the assertion below is meaningful.");
  }
  console.log(`EN tagline would have been: "${enContent.tagline}"`);
  console.log(`RO tagline (expected):      "${roContent.tagline}"`);
  if (roBusiness.summary !== roContent.tagline) {
    throw new Error(`BUG STILL PRESENT: summary is "${roBusiness.summary}", expected the Romanian tagline "${roContent.tagline}"!`);
  }
  console.log("=> Confirmed: adopted Business content now correctly resolves from Assessment.locale, not the always-'en' User.locale.");

  console.log("\n=== Step 6: the exact query /businesses/[businessId]/page.tsx runs ===");
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
  await db.business.deleteMany({ where: { userId: roUser.id } });
  await db.businessMatchResult.deleteMany({ where: { userId: roUser.id } });
  await db.assessment.deleteMany({ where: { userId: roUser.id } });
  await db.assessmentSession.deleteMany({ where: { userId: roUser.id } });
  await db.user.delete({ where: { id: roUser.id } });
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
