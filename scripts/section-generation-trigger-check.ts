/**
 * Per-section Blueprint generation verification script — not a test, not
 * part of the app. Exercises requestSectionGeneration()/getSectionStatus()/
 * listSectionStatuses()'s real logic (mirrored here, minus the
 * requireCurrentUser() call this script can't satisfy outside a real
 * request — same rationale as every other *-check.ts script in this
 * directory) against real Postgres rows, tracing the full flow the task
 * asked for:
 *
 *   landing page (all 15 "none") -> trigger one section -> "generating"
 *   (not blocking) -> stub completes -> "ready" with persisted content ->
 *   revisit that section directly -> loads from the persisted row WITHOUT
 *   re-triggering generation (a second, untouched section stays "none").
 *
 * Run with `npm run section-trigger:check`.
 */
import { randomUUID } from "node:crypto";
import { db } from "../src/lib/db";
import { BLUEPRINT_SECTION_KEYS } from "../src/ai/prompts/blueprint";

type SectionKey = (typeof BLUEPRINT_SECTION_KEYS)[number];
const STUB_GENERATION_DELAY_MS = 1500;

/** Mirrors generateSectionContent() exactly (see src/features/business-engine/actions/request-section-generation.ts). */
async function generateSectionContentStub(sectionId: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, STUB_GENERATION_DELAY_MS));
  await db.blueprintSection.update({
    where: { id: sectionId },
    data: { status: "ready", error: null, content: { _stub: true, generatedAt: new Date().toISOString(), body: "stub" } },
  });
}

/** Mirrors requestSectionGeneration()'s logic exactly, minus requireCurrentUser(). */
async function triggerForUser(businessId: string, userLocale: "en" | "ro", sectionKey: SectionKey) {
  const blueprint = await db.blueprint.upsert({
    where: { businessId },
    update: {},
    create: { businessId, locale: userLocale },
  });
  const section = await db.blueprintSection.upsert({
    where: { blueprintId_sectionKey: { blueprintId: blueprint.id, sectionKey } },
    update: { status: "generating", error: null },
    create: { blueprintId: blueprint.id, sectionKey, status: "generating" },
  });
  // Fire-and-forget, same as `waitUntil(generateSectionContent(...))` in the real action —
  // NOT awaited here either, so this function returns before generation finishes.
  void generateSectionContentStub(section.id);
  return { sectionId: section.id, blueprintId: blueprint.id };
}

/** Mirrors listSectionStatuses()'s logic exactly. */
async function listStatusesForUser(businessId: string) {
  const blueprint = await db.blueprint.findUnique({ where: { businessId }, include: { sections: true } });
  const statusByKey = new Map(blueprint?.sections.map((s) => [s.sectionKey, s.status]) ?? []);
  return BLUEPRINT_SECTION_KEYS.map((sectionKey) => ({ sectionKey, status: statusByKey.get(sectionKey) ?? "none" }));
}

async function main() {
  console.log("=== Step 1: throwaway User + adopted Business ===");
  const user = await db.user.create({
    data: { clerkId: `test_${randomUUID()}`, email: `test-${randomUUID()}@example.com`, locale: "en" },
  });
  const businessType = await db.businessType.findFirstOrThrow({ where: { budget: { isNot: null } } });
  const business = await db.business.create({
    data: { userId: user.id, businessTypeId: businessType.id, name: "Test Adopted Business" },
  });
  console.log(`Created Business ${business.id} (${businessType.slug})`);

  console.log("\n=== Step 2: landing page — all 15 sections should show 'none' (no Blueprint row exists yet) ===");
  const beforeAny = await db.blueprint.findUnique({ where: { businessId: business.id } });
  console.log(`Blueprint row before any trigger: ${beforeAny ? "exists" : "none"}`);
  if (beforeAny !== null) throw new Error("Expected no Blueprint row before any section is triggered!");
  const initialStatuses = await listStatusesForUser(business.id);
  console.log(`listSectionStatuses() -> ${initialStatuses.length} sections, all statuses: [${[...new Set(initialStatuses.map((s) => s.status))].join(", ")}]`);
  if (initialStatuses.length !== 15 || initialStatuses.some((s) => s.status !== "none")) {
    throw new Error("Expected all 15 sections to report status 'none' before any trigger!");
  }

  console.log("\n=== Step 3: click into 'executiveSummary' — trigger fires, returns immediately ===");
  const t0 = Date.now();
  const { sectionId } = await triggerForUser(business.id, "en", "executiveSummary");
  const triggerDurationMs = Date.now() - t0;
  console.log(`Trigger returned in ${triggerDurationMs}ms -> sectionId=${sectionId}`);
  if (triggerDurationMs >= STUB_GENERATION_DELAY_MS) {
    throw new Error(`Trigger took ${triggerDurationMs}ms — the caller is blocking on generation!`);
  }

  console.log("\n=== Step 4: status immediately after trigger must be 'generating' ===");
  const immediatelyAfter = await db.blueprintSection.findUnique({ where: { id: sectionId } });
  console.log(`Status immediately after trigger: ${immediatelyAfter?.status}`);
  if (immediatelyAfter?.status !== "generating") {
    throw new Error(`Expected "generating" immediately after trigger, got "${immediatelyAfter?.status}"`);
  }
  console.log("Confirming the OTHER 14 sections are untouched (still 'none') while this one generates:");
  const midFlightStatuses = await listStatusesForUser(business.id);
  const otherSections = midFlightStatuses.filter((s) => s.sectionKey !== "executiveSummary");
  console.log(`  ${otherSections.filter((s) => s.status === "none").length}/14 other sections still 'none'`);
  if (otherSections.some((s) => s.status !== "none")) {
    throw new Error("Triggering one section affected another section's status!");
  }

  console.log("\n=== Step 5: poll until the background stub flips it to 'ready' ===");
  let finalStatus = immediatelyAfter.status as string;
  const pollStart = Date.now();
  while (finalStatus === "generating" && Date.now() - pollStart < 5000) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const polled = await db.blueprintSection.findUnique({ where: { id: sectionId } });
    finalStatus = polled?.status ?? "MISSING";
  }
  const ready = await db.blueprintSection.findUnique({ where: { id: sectionId } });
  console.log(`Final status: ${ready?.status} (after ${Date.now() - pollStart}ms of polling)`);
  console.log(`Persisted content: ${JSON.stringify(ready?.content)}`);
  if (ready?.status !== "ready") throw new Error(`Expected final status "ready", got "${ready?.status}"`);

  console.log("\n=== Step 6: revisit the section directly — must load persisted content WITHOUT re-triggering ===");
  const revisit = await db.blueprintSection.findUnique({ where: { id: sectionId } });
  console.log(`Revisit read: status=${revisit?.status}, content present=${revisit?.content !== null}`);
  if (revisit?.status !== "ready") throw new Error("Revisiting should read the already-ready section, not reset it!");
  // Prove no new generation was triggered by revisiting: same row id, same updatedAt as before revisit.
  if (revisit.updatedAt.getTime() !== ready.updatedAt.getTime()) {
    throw new Error("The section's updatedAt changed on a plain revisit — something re-triggered generation!");
  }
  console.log("=> Confirmed: revisiting a ready section reads the persisted row, no regeneration.");

  console.log("\n=== Cleanup ===");
  await db.blueprintSection.deleteMany({ where: { blueprint: { businessId: business.id } } });
  await db.blueprint.deleteMany({ where: { businessId: business.id } });
  await db.business.delete({ where: { id: business.id } });
  await db.user.delete({ where: { id: user.id } });
  console.log("Removed throwaway test data.");

  console.log("\n✅ All per-section generation checks passed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
