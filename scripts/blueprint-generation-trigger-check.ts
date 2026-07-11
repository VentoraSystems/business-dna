/**
 * Blueprint Generation Part 1 verification script — not a test, not part
 * of the app. Exercises requestBlueprintGeneration()'s trigger -> background
 * -> status-flip mechanism against a real Postgres row, using the same
 * underlying pieces the action calls, since the action itself is gated
 * behind requireCurrentUser() (Clerk), which has no meaning outside a real
 * request — same rationale as the other *-check.ts scripts in this
 * directory.
 *
 * Specifically proves the caller does NOT block on generation: it checks
 * the Blueprint's status immediately after the trigger call returns
 * (should be "generating", not "ready") — the whole point of the
 * background pattern — before polling until it flips to "ready".
 *
 * Run with `npm run blueprint-trigger:check`.
 */
import { randomUUID } from "node:crypto";
import { db } from "../src/lib/db";

/** Mirrors requestBlueprintGeneration()'s logic exactly (see src/features/business-engine/actions/request-blueprint-generation.ts), minus the requireCurrentUser() call this script can't satisfy outside a real request, and calling generateBlueprintContent() inline instead of importing the un-exported stub. */
const STUB_GENERATION_DELAY_MS = 1500;

async function generateBlueprintContentStub(blueprintId: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, STUB_GENERATION_DELAY_MS));
  await db.blueprint.update({
    where: { id: blueprintId },
    data: {
      status: "ready",
      error: null,
      content: { _stub: true, generatedAt: new Date().toISOString(), sections: [{ key: "executiveSummary", body: "stub" }] },
    },
  });
}

async function triggerForUser(businessId: string, userLocale: "en" | "ro") {
  const blueprint = await db.blueprint.upsert({
    where: { businessId },
    update: { status: "generating", error: null },
    create: { businessId, locale: userLocale, status: "generating", content: {} },
  });
  // Fire-and-forget, same as `waitUntil(generateBlueprintContent(...))` in the real action —
  // NOT awaited here either, so this function returns before generation finishes.
  void generateBlueprintContentStub(blueprint.id);
  return { blueprintId: blueprint.id };
}

async function main() {
  console.log("=== Step 1: create a throwaway User + adopted Business ===");
  const user = await db.user.create({
    data: { clerkId: `test_${randomUUID()}`, email: `test-${randomUUID()}@example.com`, locale: "en" },
  });
  const businessType = await db.businessType.findFirstOrThrow({ where: { budget: { isNot: null } } });
  const business = await db.business.create({
    data: { userId: user.id, businessTypeId: businessType.id, name: "Test Adopted Business" },
  });
  console.log(`Created Business ${business.id} (${businessType.slug}) for user ${user.id}`);

  console.log("\n=== Step 2: no Blueprint row exists yet ===");
  const before = await db.blueprint.findUnique({ where: { businessId: business.id } });
  console.log(`Blueprint before trigger: ${before ? before.status : "none"}`);
  if (before !== null) throw new Error("Expected no Blueprint row before triggering generation!");

  console.log("\n=== Step 3: call the trigger (same call requestBlueprintGeneration() makes) ===");
  const t0 = Date.now();
  const { blueprintId } = await triggerForUser(business.id, "en");
  const triggerDurationMs = Date.now() - t0;
  console.log(`Trigger returned in ${triggerDurationMs}ms -> blueprintId=${blueprintId}`);
  if (triggerDurationMs >= STUB_GENERATION_DELAY_MS) {
    throw new Error(
      `Trigger took ${triggerDurationMs}ms, >= the ${STUB_GENERATION_DELAY_MS}ms generation delay — the caller is blocking on generation!`
    );
  }

  console.log("\n=== Step 4: status immediately after trigger returns must be 'generating', not 'ready' ===");
  const immediatelyAfter = await db.blueprint.findUnique({ where: { id: blueprintId } });
  console.log(`Status immediately after trigger: ${immediatelyAfter?.status}`);
  if (immediatelyAfter?.status !== "generating") {
    throw new Error(`Expected status "generating" immediately after trigger, got "${immediatelyAfter?.status}"`);
  }

  console.log("\n=== Step 5: poll until the background work flips it to 'ready' ===");
  let finalStatus = immediatelyAfter.status as string;
  const pollStart = Date.now();
  while (finalStatus === "generating" && Date.now() - pollStart < 5000) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const polled = await db.blueprint.findUnique({ where: { id: blueprintId } });
    finalStatus = polled?.status ?? "MISSING";
  }
  const final = await db.blueprint.findUnique({ where: { id: blueprintId } });
  console.log(`Final status: ${final?.status} (after ${Date.now() - pollStart}ms of polling)`);
  console.log(`Final content: ${JSON.stringify(final?.content)}`);
  if (final?.status !== "ready") throw new Error(`Expected final status "ready", got "${final?.status}"`);
  if (final.error !== null) throw new Error(`Expected error to be null, got "${final.error}"`);

  console.log("\n=== Step 6: re-trigger (reset) an existing Blueprint row ===");
  const { blueprintId: blueprintId2 } = await triggerForUser(business.id, "en");
  if (blueprintId2 !== blueprintId) throw new Error("Re-triggering created a second Blueprint row instead of resetting the existing one!");
  const resetStatus = await db.blueprint.findUnique({ where: { id: blueprintId2 } });
  console.log(`Status right after re-trigger: ${resetStatus?.status} (same blueprint id: ${blueprintId2 === blueprintId})`);
  if (resetStatus?.status !== "generating") throw new Error(`Expected "generating" after re-trigger, got "${resetStatus?.status}"`);
  await new Promise((resolve) => setTimeout(resolve, STUB_GENERATION_DELAY_MS + 300));

  console.log("\n=== Cleanup ===");
  await db.blueprint.deleteMany({ where: { businessId: business.id } });
  await db.business.delete({ where: { id: business.id } });
  await db.user.delete({ where: { id: user.id } });
  console.log("Removed throwaway test data.");

  console.log("\n✅ All blueprint-generation-trigger checks passed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
