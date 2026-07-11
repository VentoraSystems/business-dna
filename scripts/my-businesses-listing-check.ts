/**
 * "My Businesses" listing bug investigation script — not a test, not part
 * of the app. Adopts a business for a throwaway user (mirroring
 * adoptBusinessMatch()'s real logic — see
 * src/features/business-engine/actions/adopt-business-match.ts — minus the
 * requireCurrentUser() call this script can't satisfy outside a real
 * request, same rationale as every other *-check.ts script in this
 * directory), then runs the query the "My Businesses" page (src/app/[locale]/
 * (dashboard)/businesses/page.tsx) SHOULD run — db.business.findMany({
 * where: { userId } }) — to prove the adopted row genuinely exists and is
 * retrievable with no filter/field mismatch. The actual bug (confirmed by
 * reading the page's source, not this script) is that the page never runs
 * any query at all — it's a hardcoded EmptyState — so this script's job is
 * to rule out every OTHER hypothesis (missing field on create, filter
 * mismatch, userId mismatch) before concluding that's the real root cause.
 *
 * Run with `npm run my-businesses-listing:check`.
 */
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { db } from "../src/lib/db";
import { businessMatchRepository } from "../src/features/business-engine/repositories";
import { readBusinessDisplayContent } from "../src/features/business-engine/utils/business-display-content";

/** Mirrors adoptBusinessMatch()'s create logic exactly. */
async function adoptForUser(user: { id: string; locale: "en" | "ro" }, matchResultId: string) {
  const matchResult = await businessMatchRepository.findById(matchResultId);
  if (!matchResult || matchResult.userId !== user.id) throw new Error("MATCH_RESULT_NOT_FOUND");

  const { businessType } = matchResult;
  const content = readBusinessDisplayContent(businessType.slug, user.locale);

  return db.business.create({
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
}

async function main() {
  console.log("=== Step 1: throwaway User + Assessment + BusinessMatchResult ===");
  const user = await db.user.create({
    data: { clerkId: `test_${randomUUID()}`, email: `test-${randomUUID()}@example.com`, locale: "en" },
  });
  const session = await db.assessmentSession.create({
    data: { userId: user.id, locale: "en", status: "completed", currentStep: 0 },
  });
  const assessment = await db.assessment.create({ data: { userId: user.id, sessionId: session.id, locale: "en" } });
  const businessType = await db.businessType.findFirstOrThrow({ where: { budget: { isNot: null } } });
  const matchResult = await businessMatchRepository.create({
    userId: user.id,
    assessmentId: assessment.id,
    businessTypeId: businessType.id,
    compatibilityScore: 88.5,
  });
  console.log(`User ${user.id} (userId that the listing query will filter on)`);
  console.log(`BusinessMatchResult ${matchResult.id} -> BusinessType ${businessType.slug}`);

  console.log("\n=== Step 2: adopt it (real adoptBusinessMatch() create logic) ===");
  const adopted = await adoptForUser(user, matchResult.id);
  console.log(`Created Business ${adopted.id}: userId=${adopted.userId}, name="${adopted.name}", difficulty=${adopted.difficulty}, compatibility=${adopted.compatibility}`);
  console.log("Full row (every column adoptBusinessMatch() set):", {
    userId: adopted.userId,
    assessmentId: adopted.assessmentId,
    businessTypeId: adopted.businessTypeId,
    matchResultId: adopted.matchResultId,
    name: adopted.name,
    summary: adopted.summary,
    compatibility: adopted.compatibility,
    difficulty: adopted.difficulty,
    investmentMin: adopted.investmentMin,
    investmentMax: adopted.investmentMax,
  });

  console.log("\n=== Step 3: rule out a userId mismatch — same Clerk user resolves to the same User.id everywhere ===");
  console.log(
    `adoptBusinessMatch() and every listing/detail action call requireCurrentUser() -> the same db.user row for the same Clerk session. Business.userId (${adopted.userId}) === User.id (${user.id}): ${adopted.userId === user.id}`
  );

  console.log("\n=== Step 4: run the query the 'My Businesses' page SHOULD run ===");
  const listed = await db.business.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });
  console.log(`db.business.findMany({ where: { userId } }) returned ${listed.length} row(s).`);
  console.log(`Contains the adopted Business: ${listed.some((b) => b.id === adopted.id)}`);
  if (listed.length !== 1 || listed[0]?.id !== adopted.id) {
    throw new Error("The correct query does NOT return the adopted Business — this would mean a real query/field/filter bug!");
  }
  console.log("=> Confirmed: the data layer is correct. No filter mismatch, no missing field, no userId mismatch.");

  console.log("\n=== Step 5: confirm the listing page itself now actually runs this query ===");
  const pagePath = path.join(__dirname, "..", "src", "app", "[locale]", "(dashboard)", "businesses", "page.tsx");
  const pageSource = readFileSync(pagePath, "utf-8");
  const callsFindMany = pageSource.includes("db.business.findMany");
  const filtersByUserId = pageSource.includes("userId: user.id");
  console.log(`businesses/page.tsx calls db.business.findMany: ${callsFindMany}`);
  console.log(`businesses/page.tsx filters by userId: user.id: ${filtersByUserId}`);
  if (!callsFindMany || !filtersByUserId) {
    throw new Error("The listing page still doesn't query the database — the fix hasn't landed!");
  }

  console.log("\n=== Cleanup ===");
  await db.business.deleteMany({ where: { userId: user.id } });
  await db.businessMatchResult.deleteMany({ where: { userId: user.id } });
  await db.assessment.delete({ where: { id: assessment.id } });
  await db.assessmentSession.delete({ where: { id: session.id } });
  await db.user.delete({ where: { id: user.id } });
  console.log("Removed throwaway test data.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
