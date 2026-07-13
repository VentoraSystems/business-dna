/**
 * Roadmap engagement layer Part 1 verification script — not a test, not
 * part of the app. Exercises the real data layer built in this phase
 * (recordRoadmapActivity() in roadmap-streak.ts, completeDailyAction()/
 * getTodaysDailyActions() in daily-actions.ts, rollBonusXp() in
 * roadmap-bonus-xp.ts, and toggleTaskCompletion()'s new streak/bonus
 * wiring in roadmap-view.ts), mirrored here minus the requireCurrentUser()
 * call this script can't satisfy outside a real request — same pattern as
 * every other *-check.ts script in this directory.
 *
 * Traces every scenario STEP 5 asked for:
 *   1. Complete a task on day 1 -> currentStreak = 1.
 *   2. Complete a daily action the SAME day -> streak stays 1 (no
 *      double-count for a second completion on an already-active day).
 *   3. Simulate day 2 (a completion exactly 1 day later) -> streak = 2.
 *   4. Simulate a gap (skip a day, complete on day 4) -> streak resets to
 *      1, longestStreak stays at its peak (2).
 *   5. Completing the same daily action twice on the same day -> the
 *      second attempt is rejected with a friendly ALREADY_COMPLETED_TODAY
 *      error, not a raw Prisma unique-constraint error.
 *   6. rollBonusXp() fires probabilistically across many rolls — not
 *      never, not always — and its non-zero values always land in
 *      [5, 15].
 *   7. End-to-end: completeDailyAction()'s returned totalXp actually
 *      reflects engagementXp (task-based totalXp is 0 XP from that
 *      Roadmap's own tasks at that point, isolating the effect).
 *
 * Run with `npm run roadmap-engagement:check`.
 */
import { randomUUID } from "node:crypto";
import { db } from "../src/lib/db";
import { recomputeRoadmapProgress } from "../src/features/business-engine/utils/roadmap-progress";
import { recordRoadmapActivity, toUtcDateOnly } from "../src/features/business-engine/utils/roadmap-streak";
import { rollBonusXp } from "../src/features/business-engine/utils/roadmap-bonus-xp";
import { effectiveTotalXp } from "../src/features/business-engine/utils/roadmap-xp";
import { RoadmapStageKey } from "../src/features/roadmap/types/sections";
import { DAILY_ACTION_KEYS, type DailyActionKey } from "../src/features/roadmap/types/daily-actions";
import { Prisma } from "@prisma/client";

const DAY_MS = 24 * 60 * 60 * 1000;
function daysAgo(base: Date, days: number): Date {
  return new Date(base.getTime() - days * DAY_MS);
}

/** Mirrors toggleTaskCompletion()'s completion-path streak/bonus wiring exactly, for a fixed simulated date. */
async function completeTaskAsOf(taskId: string, roadmapId: string, asOf: Date) {
  await db.roadmapTask.update({ where: { id: taskId }, data: { completedAt: asOf } });
  const progress = await recomputeRoadmapProgress(roadmapId);
  await recordRoadmapActivity(roadmapId, asOf);
  const roadmap = await db.roadmap.findUniqueOrThrow({ where: { id: roadmapId } });
  return { progress, roadmap };
}

/** Mirrors completeDailyAction()'s logic exactly, for a fixed simulated date, including the friendly-error dedup path. */
async function completeDailyActionAsOf(roadmapId: string, dailyActionKey: DailyActionKey, asOf: Date) {
  const dailyAction = await db.dailyAction.findUniqueOrThrow({ where: { key: dailyActionKey } });
  const today = toUtcDateOnly(asOf);
  try {
    await db.dailyActionCompletion.create({ data: { roadmapId, dailyActionKey, completedAt: today } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new Error("ALREADY_COMPLETED_TODAY");
    }
    throw error;
  }
  const progress = await recomputeRoadmapProgress(roadmapId);
  await recordRoadmapActivity(roadmapId, today);
  const bonusXp = rollBonusXp();
  const updated = await db.roadmap.update({
    where: { id: roadmapId },
    data: { engagementXp: { increment: dailyAction.xpValue + bonusXp } },
  });
  return { totalXp: effectiveTotalXp(updated), bonusXp, roadmap: updated, taskBasedTotalXp: progress.totalXp };
}

async function main() {
  console.log("=== Step 0: DailyAction catalog seeded correctly ===");
  const catalog = await db.dailyAction.findMany({ orderBy: { createdAt: "asc" } });
  console.log(`DailyAction rows: ${catalog.length} (expected ${DAILY_ACTION_KEYS.length})`);
  for (const action of catalog) console.log(`  key=${action.key} translationKey=${action.translationKey} xpValue=${action.xpValue}`);
  if (catalog.length !== DAILY_ACTION_KEYS.length) throw new Error("DailyAction catalog seed count mismatch — run `npm run db:seed:daily-actions` first!");

  console.log("\n=== Step 1: throwaway User + Roadmap + one RoadmapTask ===");
  const user = await db.user.create({ data: { clerkId: `test_${randomUUID()}`, email: `test-${randomUUID()}@example.com` } });
  const businessType = await db.businessType.findFirstOrThrow({ where: { slug: "software-house" } });
  const business = await db.business.create({ data: { userId: user.id, businessTypeId: businessType.id, name: "Engagement Test Business" } });
  const roadmap = await db.roadmap.create({ data: { userId: user.id, businessId: business.id } });
  const task = await db.roadmapTask.create({
    data: { roadmapId: roadmap.id, title: "Day 1 task", stage: RoadmapStageKey.Preparation, month: 1, order: 0, xpValue: 10 },
  });

  const day1 = new Date();
  console.log("\n=== Step 2: complete the task on day 1 -> currentStreak = 1 ===");
  let result = await completeTaskAsOf(task.id, roadmap.id, day1);
  console.log(`currentStreak=${result.roadmap.currentStreak}, longestStreak=${result.roadmap.longestStreak} (expected 1, 1)`);
  if (result.roadmap.currentStreak !== 1 || result.roadmap.longestStreak !== 1) throw new Error("Day 1 streak wrong!");

  console.log("\n=== Step 3: complete a DailyAction the SAME day -> streak stays 1 (no double-count) ===");
  const dailyResult = await completeDailyActionAsOf(roadmap.id, "reflectProgress", day1);
  console.log(`After same-day daily action: currentStreak=${dailyResult.roadmap.currentStreak} (expected 1), totalXp=${dailyResult.totalXp}`);
  if (dailyResult.roadmap.currentStreak !== 1) throw new Error("Same-day completion incorrectly changed the streak!");
  if (dailyResult.taskBasedTotalXp !== 10) throw new Error("Task-based totalXp should be unaffected by the daily action!");
  const expectedDailyFloor = 5; // reflectProgress's xpValue, before any bonus
  if (dailyResult.totalXp < 10 + expectedDailyFloor) throw new Error("engagementXp wasn't correctly added to the effective totalXp!");

  console.log("\n=== Step 4: attempt completing the SAME daily action again the SAME day -> rejected cleanly ===");
  let rejected = false;
  let rejectionMessage = "";
  try {
    await completeDailyActionAsOf(roadmap.id, "reflectProgress", day1);
  } catch (error) {
    rejected = true;
    rejectionMessage = error instanceof Error ? error.message : String(error);
  }
  console.log(`Second same-day attempt rejected: ${rejected}, message="${rejectionMessage}" (expected "ALREADY_COMPLETED_TODAY", not a raw Prisma error)`);
  if (!rejected || rejectionMessage !== "ALREADY_COMPLETED_TODAY") throw new Error("Duplicate same-day daily action wasn't cleanly rejected!");

  console.log("\n=== Step 5: simulate day 2 (a completion exactly 1 day later) -> streak = 2 ===");
  const task2 = await db.roadmapTask.create({
    data: { roadmapId: roadmap.id, title: "Day 2 task", stage: RoadmapStageKey.Preparation, month: 1, order: 1, xpValue: 10 },
  });
  const day2 = daysAgo(day1, -1);
  result = await completeTaskAsOf(task2.id, roadmap.id, day2);
  console.log(`currentStreak=${result.roadmap.currentStreak}, longestStreak=${result.roadmap.longestStreak} (expected 2, 2)`);
  if (result.roadmap.currentStreak !== 2 || result.roadmap.longestStreak !== 2) throw new Error("Day 2 streak increment wrong!");

  console.log("\n=== Step 6: simulate a gap — skip day 3, complete on day 4 -> streak resets to 1, longestStreak preserved ===");
  const task3 = await db.roadmapTask.create({
    data: { roadmapId: roadmap.id, title: "Day 4 task", stage: RoadmapStageKey.Preparation, month: 1, order: 2, xpValue: 10 },
  });
  const day4 = daysAgo(day2, -2); // day2 + 2 days = day4, skipping day3 entirely
  result = await completeTaskAsOf(task3.id, roadmap.id, day4);
  console.log(`currentStreak=${result.roadmap.currentStreak} (expected 1, reset), longestStreak=${result.roadmap.longestStreak} (expected 2, preserved)`);
  if (result.roadmap.currentStreak !== 1) throw new Error("Streak should have reset to 1 after a 2-day gap!");
  if (result.roadmap.longestStreak !== 2) throw new Error("longestStreak should stay at its peak (2) after a reset!");

  console.log("\n=== Step 7: bonus XP fires probabilistically — not never, not always ===");
  const ROLLS = 3000;
  let bonusCount = 0;
  for (let i = 0; i < ROLLS; i++) {
    const bonus = rollBonusXp();
    if (bonus > 0) {
      bonusCount++;
      if (bonus < 5 || bonus > 15) throw new Error(`Bonus XP ${bonus} outside the expected [5, 15] range!`);
    }
  }
  const observedRate = bonusCount / ROLLS;
  console.log(`Bonus fired ${bonusCount}/${ROLLS} times (${(observedRate * 100).toFixed(1)}%, expected ~15%)`);
  if (bonusCount === 0) throw new Error("Bonus XP never fired across 3000 rolls — chance is broken!");
  if (bonusCount === ROLLS) throw new Error("Bonus XP fired every time — chance is broken!");
  if (observedRate < 0.08 || observedRate > 0.25) throw new Error(`Observed bonus rate ${observedRate} is implausibly far from the configured 15% chance!`);

  console.log("\n=== Cleanup ===");
  await db.dailyActionCompletion.deleteMany({ where: { roadmapId: roadmap.id } });
  await db.roadmapTask.deleteMany({ where: { roadmapId: roadmap.id } });
  await db.roadmap.delete({ where: { id: roadmap.id } });
  await db.business.delete({ where: { id: business.id } });
  await db.user.delete({ where: { id: user.id } });
  console.log("Removed throwaway test data.");

  console.log("\n✅ All roadmap engagement checks passed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
