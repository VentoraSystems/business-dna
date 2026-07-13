/**
 * Roadmap self-heal fix verification script — not a test, not part of the
 * app. Reproduces the exact production bug reported: a Business adopted
 * while seedRoadmapIfMissing() would have failed (e.g. before this app's
 * Roadmap schema columns existed in production) ends up with zero Roadmap
 * rows and no retriable path to create one — visiting
 * /businesses/[businessId]/roadmap showed a dead-end "no roadmap" empty
 * state forever, even though Blueprint's launchPlan card now redirects
 * straight into that same page.
 *
 * Exercises the real fix (getRoadmapView() in
 * src/features/business-engine/actions/roadmap-view.ts now calls the
 * shared seedRoadmapIfMissing() — src/features/business-engine/utils/
 * roadmap-seeding.ts — itself before giving up), mirrored here minus the
 * requireCurrentUser() call this script can't satisfy outside a real
 * request, same pattern as every other *-check.ts script in this
 * directory.
 *
 * Traces:
 *   1. A Business exists with genuinely zero Roadmap rows (the bug state,
 *      reproduced directly — no seedRoadmapIfMissing() call at all, same
 *      as if adoption's own seeding attempt had failed).
 *   2. getRoadmapView (mirrored) is called on it -> self-heals: a real
 *      Roadmap + RoadmapTask rows now exist, and a real (non-null)
 *      RoadmapView with real tasks comes back on that same call, no
 *      "visit again" or manual backfill needed.
 *   3. Calling it again is idempotent (no duplicate Roadmap/tasks).
 *   4. The genuine remaining edge case (BusinessType has no authored
 *      roadmap.json at all) still returns null, cleanly, without
 *      throwing.
 *
 * Run with `npm run roadmap-self-heal:check`.
 */
import { randomUUID } from "node:crypto";
import { db } from "../src/lib/db";
import { seedRoadmapIfMissing } from "../src/features/business-engine/utils/roadmap-seeding";
import type { RoadmapStageKey } from "../src/features/roadmap/types/sections";
import type { Locale } from "../src/i18n/config";

interface TaskView {
  id: string;
  stage: RoadmapStageKey;
}

/** Mirrors getRoadmapView()'s new self-healing logic exactly, skipping requireCurrentUser(). */
async function getRoadmapViewMirrored(businessId: string, userId: string) {
  const business = await db.business.findUniqueOrThrow({
    where: { id: businessId },
    include: { businessType: true, assessment: true },
  });
  if (business.userId !== userId) throw new Error("BUSINESS_NOT_FOUND");

  let roadmap = await db.roadmap.findUnique({ where: { businessId }, include: { milestones: true } });

  if (!roadmap && business.businessType && business.assessmentId) {
    const locale = business.assessment?.locale ?? "en";
    await seedRoadmapIfMissing(business.id, userId, business.businessType.slug, business.assessmentId, locale as Locale);
    roadmap = await db.roadmap.findUnique({ where: { businessId }, include: { milestones: true } });
  }

  if (!roadmap) return null;

  const tasks: TaskView[] = roadmap.milestones.map((t) => ({ id: t.id, stage: t.stage as RoadmapStageKey }));
  return { roadmapId: roadmap.id, taskCount: tasks.length, stagesRepresented: new Set(tasks.map((t) => t.stage)).size };
}

async function main() {
  console.log("=== Step 1: reproduce the bug — a Business with genuinely zero Roadmap rows ===");
  const user = await db.user.create({ data: { clerkId: `test_${randomUUID()}`, email: `test-${randomUUID()}@example.com` } });
  const businessType = await db.businessType.findFirstOrThrow({ where: { slug: "software-house" } });
  const session = await db.assessmentSession.create({ data: { userId: user.id, locale: "ro", status: "completed", currentStep: 0 } });
  const assessment = await db.assessment.create({ data: { userId: user.id, sessionId: session.id, locale: "ro" } });
  // Deliberately NOT calling seedRoadmapIfMissing() here — this is exactly what a Business
  // looked like in production after adoption's own seeding attempt failed (missing columns)
  // and was never retried.
  const business = await db.business.create({
    data: { userId: user.id, assessmentId: assessment.id, businessTypeId: businessType.id, name: "Bug Repro Business" },
  });

  const preRoadmap = await db.roadmap.findUnique({ where: { businessId: business.id } });
  console.log(`Roadmap exists before any page visit: ${preRoadmap !== null} (expected false — this is the bug state)`);
  if (preRoadmap !== null) throw new Error("Test setup didn't reproduce the bug state!");

  console.log("\n=== Step 2: visit the roadmap page (getRoadmapView) — should self-heal, not return null ===");
  const view = await getRoadmapViewMirrored(business.id, user.id);
  console.log(`getRoadmapView result: ${view === null ? "null (BUG STILL PRESENT)" : `real view, ${view.taskCount} tasks across ${view.stagesRepresented} stages`}`);
  if (view === null) throw new Error("Self-heal failed — getRoadmapView still returns null for a Business missing its Roadmap!");
  if (view.taskCount === 0) throw new Error("Self-heal created a Roadmap but with zero tasks — readRoadmapSeedTasks likely broken!");

  const postRoadmap = await db.roadmap.findUnique({ where: { businessId: business.id }, include: { milestones: true } });
  console.log(`Roadmap now exists in the DB: ${postRoadmap !== null}, with ${postRoadmap?.milestones.length ?? 0} real RoadmapTask rows (locale=ro, matches the Assessment's real locale)`);
  if (!postRoadmap || postRoadmap.milestones.length === 0) throw new Error("Self-heal didn't actually persist a Roadmap!");
  const sampleTask = postRoadmap.milestones[0];
  if (!sampleTask) throw new Error("Expected at least one seeded task!");
  console.log(`Sample seeded task: stage=${sampleTask.stage}, title="${sampleTask.title}" (Romanian, since Assessment.locale=ro)`);

  console.log("\n=== Step 3: revisiting again is idempotent — no duplicate Roadmap or tasks ===");
  const view2 = await getRoadmapViewMirrored(business.id, user.id);
  const roadmapCount = await db.roadmap.count({ where: { businessId: business.id } });
  const taskCountAfterSecondVisit = await db.roadmapTask.count({ where: { roadmapId: postRoadmap.id } });
  console.log(`Roadmap rows for this Business: ${roadmapCount} (expected 1), tasks: ${taskCountAfterSecondVisit} (expected ${postRoadmap.milestones.length}, unchanged)`);
  if (roadmapCount !== 1) throw new Error("Revisiting created a duplicate Roadmap!");
  if (taskCountAfterSecondVisit !== postRoadmap.milestones.length) throw new Error("Revisiting duplicated RoadmapTask rows!");
  if (view2?.taskCount !== view.taskCount) throw new Error("Second visit's view doesn't match the first!");

  console.log("\n=== Step 4: genuine remaining edge case — BusinessType has no authored roadmap.json at all ===");
  const bareBusiness = await db.business.create({
    data: { userId: user.id, assessmentId: assessment.id, businessTypeId: businessType.id, name: "No-Roadmap-Content Business" },
  });
  // Exercise seedRoadmapIfMissing() directly with a slug that has no business-library folder,
  // the same no-op path getRoadmapView hits for a BusinessType with no authored roadmap.json —
  // faking the slug here since every real seeded BusinessType in this DB does have one (all 22
  // business-library folders carry a roadmap.json, confirmed by direct filesystem check).
  await seedRoadmapIfMissing(bareBusiness.id, user.id, "slug-with-no-roadmap-json", assessment.id, "ro");
  const bareRoadmap = await db.roadmap.findUnique({ where: { businessId: bareBusiness.id } });
  console.log(`Roadmap created for a BusinessType with no roadmap.json: ${bareRoadmap !== null} (expected false)`);
  if (bareRoadmap !== null) throw new Error("Expected no Roadmap to be created when there's no authored roadmap.json!");

  console.log("\n=== Cleanup ===");
  await db.roadmapTask.deleteMany({ where: { roadmapId: postRoadmap.id } });
  await db.roadmap.delete({ where: { id: postRoadmap.id } });
  await db.business.deleteMany({ where: { id: { in: [business.id, bareBusiness.id] } } });
  await db.assessment.delete({ where: { id: assessment.id } });
  await db.assessmentSession.delete({ where: { id: session.id } });
  await db.user.delete({ where: { id: user.id } });
  console.log("Removed throwaway test data.");

  console.log("\n✅ All roadmap self-heal checks passed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
