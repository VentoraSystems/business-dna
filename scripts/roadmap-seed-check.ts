/**
 * Roadmap Part 1 verification script — not a test, not part of the app.
 * Exercises the real deterministic seeding (readRoadmapSeedTasks() +
 * seedRoadmapIfMissing()'s logic, mirrored here minus the
 * requireCurrentUser() call this script can't satisfy outside a real
 * request — same rationale as every other *-check.ts script in this
 * directory) and the real recomputeRoadmapProgress() against real Postgres
 * rows, tracing the full flow the task asked for:
 *
 *   adopt -> Roadmap + 10 stages' worth of real RoadmapTask rows exist,
 *   matching real roadmap.json content, in the correct (Romanian) locale
 *   -> re-adopt is idempotent (no duplicate tasks) -> mark tasks completed
 *   -> recomputeRoadmapProgress -> correct totalXp + badge unlocks, badges
 *   never revoked.
 *
 * Run with `npm run roadmap-seed:check`.
 */
import { randomUUID } from "node:crypto";
import { db } from "../src/lib/db";
import { readRoadmapSeedTasks } from "../src/features/business-engine/utils/roadmap-seed-content";
import { recomputeRoadmapProgress } from "../src/features/business-engine/utils/roadmap-progress";
import { RoadmapStageKey } from "../src/features/roadmap/types/sections";
import type { Locale } from "../src/i18n/config";

/** Mirrors seedRoadmapIfMissing()'s logic exactly (see src/features/business-engine/actions/adopt-business-match.ts). */
async function seedRoadmapIfMissing(businessId: string, userId: string, slug: string, locale: Locale) {
  const existingRoadmap = await db.roadmap.findUnique({ where: { businessId } });
  if (existingRoadmap) return { wasSeeded: false };

  const seedTasks = await readRoadmapSeedTasks(slug, locale);
  if (seedTasks.length === 0) return { wasSeeded: false };

  const roadmap = await db.roadmap.create({ data: { userId, businessId } });
  await db.roadmapTask.createMany({
    data: seedTasks.map((task) => ({ roadmapId: roadmap.id, title: task.title, stage: task.stage, month: task.month, order: task.order })),
  });
  return { wasSeeded: true };
}

async function main() {
  console.log("=== Step 1: throwaway User (no locale field, matches prod) + Romanian Assessment + adopted Business ===");
  const user = await db.user.create({
    data: { clerkId: `test_${randomUUID()}`, email: `test-${randomUUID()}@example.com` },
  });
  const session = await db.assessmentSession.create({ data: { userId: user.id, locale: "ro", status: "completed", currentStep: 0 } });
  const assessment = await db.assessment.create({ data: { userId: user.id, sessionId: session.id, locale: "ro" } });
  const businessType = await db.businessType.findFirstOrThrow({ where: { slug: "software-house" } });
  const business = await db.business.create({
    data: { userId: user.id, assessmentId: assessment.id, businessTypeId: businessType.id, name: "Test Adopted Business" },
  });
  console.log(`Created Business ${business.id} (${businessType.slug}), assessment locale=ro`);

  console.log("\n=== Step 2: seed the Roadmap (mirrors adoptBusinessMatch()'s new seeding step) ===");
  const seedResult = await seedRoadmapIfMissing(business.id, user.id, businessType.slug, "ro");
  console.log(`Seeded: ${seedResult.wasSeeded}`);
  if (!seedResult.wasSeeded) throw new Error("Expected the roadmap to be seeded for a fresh Business!");

  const roadmap = await db.roadmap.findUniqueOrThrow({ where: { businessId: business.id }, include: { milestones: true } });
  console.log(`Roadmap ${roadmap.id}: ${roadmap.milestones.length} tasks, totalXp=${roadmap.totalXp}, badges=${roadmap.unlockedBadgeKeys}`);

  const stagesPresent = new Set(roadmap.milestones.map((t) => t.stage));
  console.log(`Distinct stages represented: ${stagesPresent.size}/10 -> [${[...stagesPresent].join(", ")}]`);
  if (stagesPresent.size !== 10) throw new Error(`Expected all 10 stages represented, got ${stagesPresent.size}`);

  console.log("\n=== Step 3: spot-check real task content against messages/ro.json ===");
  const launchTask = roadmap.milestones.find((t) => t.stage === RoadmapStageKey.Launch);
  const prepTask = roadmap.milestones.find((t) => t.stage === RoadmapStageKey.Preparation);
  console.log(`Launch task title: "${launchTask?.title}"`);
  console.log(`Preparation task title: "${prepTask?.title}"`);
  if (launchTask?.title !== "Obține acordul explicit al clientului înainte de a publica orice studiu de caz.") {
    throw new Error(`Launch task title doesn't match the real authored Romanian content! Got: "${launchTask?.title}"`);
  }
  if (prepTask?.title !== "Confirmă că procesul de ordin de schimbare este documentat înainte de a prelua orice client.") {
    throw new Error(`Preparation task title doesn't match the real authored Romanian content! Got: "${prepTask?.title}"`);
  }
  console.log("=> Confirmed: seeded task titles are the REAL, locale-correct authored roadmap.json content.");
  console.log("All source fields sourceSectionKey=null (deterministic, not AI-sourced):", roadmap.milestones.every((t) => t.sourceSectionKey === null));

  console.log("\n=== Step 4: idempotency — re-run seeding, confirm no duplicate tasks ===");
  const reseedResult = await seedRoadmapIfMissing(business.id, user.id, businessType.slug, "ro");
  console.log(`Re-seed attempt wasSeeded: ${reseedResult.wasSeeded} (should be false)`);
  if (reseedResult.wasSeeded) throw new Error("Re-seeding created a second Roadmap or duplicate tasks!");
  const taskCountAfterReseed = await db.roadmapTask.count({ where: { roadmapId: roadmap.id } });
  console.log(`Task count after re-seed attempt (should be unchanged, ${roadmap.milestones.length}): ${taskCountAfterReseed}`);
  if (taskCountAfterReseed !== roadmap.milestones.length) throw new Error("Task count changed after a redundant seed attempt!");

  console.log("\n=== Step 5: XP/badge computation — before any completion ===");
  const before = await recomputeRoadmapProgress(roadmap.id);
  console.log(`totalXp=${before.totalXp}, unlockedBadgeKeys=${JSON.stringify(before.unlockedBadgeKeys)}`);
  if (before.totalXp !== 0 || before.unlockedBadgeKeys.length !== 0) {
    throw new Error("Expected zero XP and zero badges before any task is completed!");
  }

  console.log("\n=== Step 6: complete the FIRST task -> 'firstStep' badge + 10 XP ===");
  const allTasks = await db.roadmapTask.findMany({ where: { roadmapId: roadmap.id }, orderBy: { month: "asc" } });
  await db.roadmapTask.update({ where: { id: allTasks[0]!.id }, data: { completedAt: new Date() } });
  const afterFirst = await recomputeRoadmapProgress(roadmap.id);
  console.log(`totalXp=${afterFirst.totalXp}, unlockedBadgeKeys=${JSON.stringify(afterFirst.unlockedBadgeKeys)}, newlyUnlocked=${JSON.stringify(afterFirst.newlyUnlocked)}`);
  if (afterFirst.totalXp !== 10) throw new Error(`Expected totalXp=10 after 1 task completed, got ${afterFirst.totalXp}`);
  if (!afterFirst.unlockedBadgeKeys.includes("firstStep")) throw new Error("Expected 'firstStep' badge to unlock!");
  if (!afterFirst.newlyUnlocked.includes("firstStep")) throw new Error("Expected 'firstStep' to be reported as newly unlocked!");

  console.log("\n=== Step 7: complete the 'launch' stage task -> 'readyToLaunch' badge ===");
  const launchTaskRow = allTasks.find((t) => t.stage === RoadmapStageKey.Launch)!;
  await db.roadmapTask.update({ where: { id: launchTaskRow.id }, data: { completedAt: new Date() } });
  const afterLaunch = await recomputeRoadmapProgress(roadmap.id);
  console.log(`unlockedBadgeKeys=${JSON.stringify(afterLaunch.unlockedBadgeKeys)}`);
  if (!afterLaunch.unlockedBadgeKeys.includes("readyToLaunch")) throw new Error("Expected 'readyToLaunch' badge to unlock!");

  console.log("\n=== Step 8: complete the 'firstCustomer' stage task -> 'firstCustomer' badge ===");
  const firstCustomerTaskRow = allTasks.find((t) => t.stage === RoadmapStageKey.FirstCustomer)!;
  await db.roadmapTask.update({ where: { id: firstCustomerTaskRow.id }, data: { completedAt: new Date() } });
  const afterFC = await recomputeRoadmapProgress(roadmap.id);
  console.log(`unlockedBadgeKeys=${JSON.stringify(afterFC.unlockedBadgeKeys)}`);
  if (!afterFC.unlockedBadgeKeys.includes("firstCustomer")) throw new Error("Expected 'firstCustomer' badge to unlock!");

  console.log("\n=== Step 9: complete tasks until >= 50% -> 'halfwayThere' badge ===");
  const remainingToHalf = Math.ceil(allTasks.length * 0.5) - 3; // 3 already completed above
  for (let i = 0; i < remainingToHalf; i++) {
    const nextTask = allTasks.find((t) => t.id !== allTasks[0]!.id && t.id !== launchTaskRow.id && t.id !== firstCustomerTaskRow.id && !t.completedAt);
    if (!nextTask) break;
    await db.roadmapTask.update({ where: { id: nextTask.id }, data: { completedAt: new Date() } });
    nextTask.completedAt = new Date(); // keep the local array in sync for the .find() above
  }
  const afterHalf = await recomputeRoadmapProgress(roadmap.id);
  console.log(`unlockedBadgeKeys=${JSON.stringify(afterHalf.unlockedBadgeKeys)}`);
  if (!afterHalf.unlockedBadgeKeys.includes("halfwayThere")) throw new Error("Expected 'halfwayThere' badge to unlock!");

  console.log("\n=== Step 10: complete ALL remaining tasks -> 'roadmapComplete' badge, all 5 badges present ===");
  await db.roadmapTask.updateMany({ where: { roadmapId: roadmap.id, completedAt: null }, data: { completedAt: new Date() } });
  const final = await recomputeRoadmapProgress(roadmap.id);
  console.log(`totalXp=${final.totalXp}, unlockedBadgeKeys=${JSON.stringify(final.unlockedBadgeKeys)}`);
  const expectedTotalXp = allTasks.length * 10;
  if (final.totalXp !== expectedTotalXp) throw new Error(`Expected totalXp=${expectedTotalXp} with all tasks complete, got ${final.totalXp}`);
  const allFiveBadges = ["firstStep", "readyToLaunch", "firstCustomer", "halfwayThere", "roadmapComplete"];
  for (const badge of allFiveBadges) {
    if (!final.unlockedBadgeKeys.includes(badge as never)) throw new Error(`Expected badge "${badge}" to be unlocked at 100% completion!`);
  }
  console.log("=> All 5 badges unlocked, none lost from earlier steps (badges are never revoked).");

  console.log("\n=== Cleanup ===");
  await db.roadmapTask.deleteMany({ where: { roadmapId: roadmap.id } });
  await db.roadmap.delete({ where: { id: roadmap.id } });
  await db.business.delete({ where: { id: business.id } });
  await db.assessment.delete({ where: { id: assessment.id } });
  await db.assessmentSession.delete({ where: { id: session.id } });
  await db.user.delete({ where: { id: user.id } });
  console.log("Removed throwaway test data.");

  console.log("\n✅ All roadmap seed/progress checks passed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
