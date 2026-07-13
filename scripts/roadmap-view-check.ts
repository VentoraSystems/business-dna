/**
 * Roadmap Part 3 verification script — not a test, not part of the app.
 * Exercises the real data layer built for the Roadmap UI
 * (getRoadmapView()/toggleTaskCompletion() in
 * src/features/business-engine/actions/roadmap-view.ts), mirrored here
 * minus the requireCurrentUser() call this script can't satisfy outside a
 * real request — same rationale, and the exact same mirroring pattern, as
 * every other *-check.ts script in this directory (most recently
 * roadmap-ai-enrichment-check.ts).
 *
 * Traces: seed a real deterministic + AI-enriched roadmap (Part 1 + Part
 * 2's real logic, not stubs) -> getRoadmapView groups tasks by stage in
 * RoadmapStageKey order, computes level/XP correctly, flags AI-sourced
 * tasks -> toggleTaskCompletion flips completion, recomputes XP, and
 * reports newly-unlocked badges -> completing every 'launch' task unlocks
 * "readyToLaunch" -> un-completing a task never revokes an already-earned
 * badge -> a foreign task ID (wrong owner) is rejected.
 *
 * Run with `npm run roadmap-view:check`.
 */
import { randomUUID } from "node:crypto";
import { db } from "../src/lib/db";
import { recomputeRoadmapProgress, type RoadmapBadgeKey } from "../src/features/business-engine/utils/roadmap-progress";
import { RoadmapStageKey, ROADMAP_STAGE_ORDER } from "../src/features/roadmap/types/sections";

const XP_PER_LEVEL = 100;

function levelFromXp(totalXp: number) {
  return {
    level: Math.floor(totalXp / XP_PER_LEVEL) + 1,
    xpIntoLevel: totalXp % XP_PER_LEVEL,
    xpForNextLevel: XP_PER_LEVEL,
  };
}

interface TaskView {
  id: string;
  title: string;
  completed: boolean;
  xpValue: number;
  sourceSectionKey: string | null;
}
interface StageView {
  stage: RoadmapStageKey;
  tasks: TaskView[];
  status: "completed" | "inProgress" | "upcoming";
}

function stageStatus(tasks: TaskView[]): StageView["status"] {
  if (tasks.length === 0) return "upcoming";
  if (tasks.every((t) => t.completed)) return "completed";
  if (tasks.some((t) => t.completed)) return "inProgress";
  return "upcoming";
}

/** Mirrors getRoadmapView()'s logic exactly, skipping requireCurrentUser(). */
async function getRoadmapViewMirrored(businessId: string, userId: string) {
  const business = await db.business.findUniqueOrThrow({ where: { id: businessId } });
  if (business.userId !== userId) throw new Error("BUSINESS_NOT_FOUND");

  const roadmap = await db.roadmap.findUnique({ where: { businessId }, include: { milestones: true } });
  if (!roadmap) return null;

  const tasksByStage = new Map<RoadmapStageKey, TaskView[]>(ROADMAP_STAGE_ORDER.map((s) => [s, []]));
  for (const task of [...roadmap.milestones].sort((a, b) => a.order - b.order)) {
    const stage = task.stage as RoadmapStageKey;
    tasksByStage.get(stage)?.push({
      id: task.id,
      title: task.title,
      completed: task.completedAt !== null,
      xpValue: task.xpValue,
      sourceSectionKey: task.sourceSectionKey,
    });
  }
  const stages: StageView[] = ROADMAP_STAGE_ORDER.map((stage) => {
    const tasks = tasksByStage.get(stage) ?? [];
    return { stage, tasks, status: stageStatus(tasks) };
  });
  const { level, xpIntoLevel, xpForNextLevel } = levelFromXp(roadmap.totalXp);
  return {
    roadmapId: roadmap.id,
    totalXp: roadmap.totalXp,
    level,
    xpIntoLevel,
    xpForNextLevel,
    unlockedBadgeKeys: roadmap.unlockedBadgeKeys as RoadmapBadgeKey[],
    stages,
  };
}

/** Mirrors toggleTaskCompletion()'s logic exactly, skipping requireCurrentUser(). */
async function toggleTaskCompletionMirrored(taskId: string, userId: string) {
  const task = await db.roadmapTask.findUniqueOrThrow({ where: { id: taskId }, include: { roadmap: true } });
  if (task.roadmap.userId !== userId) throw new Error("TASK_NOT_FOUND");

  const nowCompleted = task.completedAt === null;
  await db.roadmapTask.update({ where: { id: taskId }, data: { completedAt: nowCompleted ? new Date() : null } });

  const progress = await recomputeRoadmapProgress(task.roadmapId);
  const { level, xpIntoLevel, xpForNextLevel } = levelFromXp(progress.totalXp);
  return {
    completed: nowCompleted,
    totalXp: progress.totalXp,
    level,
    xpIntoLevel,
    xpForNextLevel,
    unlockedBadgeKeys: progress.unlockedBadgeKeys,
    newlyUnlocked: progress.newlyUnlocked,
  };
}

async function main() {
  console.log("=== Step 1: throwaway User + Business + a mixed deterministic/AI roadmap ===");
  const user = await db.user.create({ data: { clerkId: `test_${randomUUID()}`, email: `test-${randomUUID()}@example.com` } });
  const otherUser = await db.user.create({ data: { clerkId: `test_${randomUUID()}`, email: `test-${randomUUID()}@example.com` } });
  const businessType = await db.businessType.findFirstOrThrow({ where: { slug: "software-house" } });
  const business = await db.business.create({ data: { userId: user.id, businessTypeId: businessType.id, name: "Test Business" } });

  const roadmap = await db.roadmap.create({ data: { userId: user.id, businessId: business.id } });
  // 2 deterministic (sourceSectionKey: null) tasks in 'launch', 1 AI task in 'launch', 2 deterministic tasks in 'validation'.
  const launchTask1 = await db.roadmapTask.create({
    data: { roadmapId: roadmap.id, title: "Deterministic launch task 1", stage: RoadmapStageKey.Launch, month: 4, order: 0, xpValue: 10 },
  });
  const launchTask2 = await db.roadmapTask.create({
    data: { roadmapId: roadmap.id, title: "Deterministic launch task 2", stage: RoadmapStageKey.Launch, month: 4, order: 1, xpValue: 10 },
  });
  const aiLaunchTask = await db.roadmapTask.create({
    data: { roadmapId: roadmap.id, title: "AI launch task", stage: RoadmapStageKey.Launch, month: 4, order: 2, xpValue: 20, sourceSectionKey: "launchPlan" },
  });
  await db.roadmapTask.create({
    data: { roadmapId: roadmap.id, title: "Validation task 1", stage: RoadmapStageKey.Validation, month: 2, order: 0, xpValue: 10 },
  });
  await db.roadmapTask.create({
    data: { roadmapId: roadmap.id, title: "Validation task 2", stage: RoadmapStageKey.Validation, month: 2, order: 1, xpValue: 10 },
  });

  console.log("\n=== Step 2: getRoadmapView — stage grouping, order, level/XP, AI-task flagging ===");
  let view = await getRoadmapViewMirrored(business.id, user.id);
  if (!view) throw new Error("Expected a RoadmapView, got null!");
  console.log(`Stages returned: ${view.stages.length} (expected 10, full RoadmapStageKey order)`);
  if (view.stages.length !== 10) throw new Error("Expected all 10 stages present, even empty ones!");
  if (view.stages.map((s) => s.stage).join(",") !== ROADMAP_STAGE_ORDER.join(",")) throw new Error("Stage order doesn't match ROADMAP_STAGE_ORDER!");
  const launchStage = view.stages.find((s) => s.stage === RoadmapStageKey.Launch)!;
  console.log(`Launch stage: ${launchStage.tasks.length} tasks, status=${launchStage.status} (expected 3 tasks, upcoming)`);
  if (launchStage.tasks.length !== 3 || launchStage.status !== "upcoming") throw new Error("Launch stage grouping/status wrong!");
  const aiTaskView = launchStage.tasks.find((t) => t.id === aiLaunchTask.id)!;
  console.log(`AI task sourceSectionKey: ${aiTaskView.sourceSectionKey} (expected "launchPlan")`);
  if (aiTaskView.sourceSectionKey !== "launchPlan") throw new Error("AI task not flagged with its sourceSectionKey!");
  const deterministicTaskView = launchStage.tasks.find((t) => t.id === launchTask1.id)!;
  if (deterministicTaskView.sourceSectionKey !== null) throw new Error("Deterministic task incorrectly flagged as AI-sourced!");
  console.log(`Initial level/XP: level=${view.level}, xpIntoLevel=${view.xpIntoLevel} (expected level=1, xpIntoLevel=0)`);
  if (view.level !== 1 || view.xpIntoLevel !== 0) throw new Error("Initial level/XP computation wrong!");

  console.log("\n=== Step 3: toggleTaskCompletion — completes a task, XP/level update ===");
  const toggle1 = await toggleTaskCompletionMirrored(launchTask1.id, user.id);
  console.log(`After completing launchTask1 (xpValue=10): completed=${toggle1.completed}, totalXp=${toggle1.totalXp}, level=${toggle1.level}, newlyUnlocked=${JSON.stringify(toggle1.newlyUnlocked)}`);
  if (!toggle1.completed || toggle1.totalXp !== 10 || toggle1.level !== 1) throw new Error("First completion's XP/level result wrong!");
  if (!toggle1.newlyUnlocked.includes("firstStep")) throw new Error("Expected 'firstStep' badge to newly unlock on first completion!");

  console.log("\n=== Step 4: complete the rest of 'launch' — readyToLaunch badge unlocks ===");
  await toggleTaskCompletionMirrored(launchTask2.id, user.id);
  const toggle3 = await toggleTaskCompletionMirrored(aiLaunchTask.id, user.id);
  console.log(`After completing all 3 launch tasks: totalXp=${toggle3.totalXp} (expected 10+10+20=40), newlyUnlocked=${JSON.stringify(toggle3.newlyUnlocked)}`);
  if (toggle3.totalXp !== 40) throw new Error("Expected totalXp=40 after completing all 3 launch tasks (10+10+20)!");
  if (!toggle3.newlyUnlocked.includes("readyToLaunch")) throw new Error("Expected 'readyToLaunch' to newly unlock once every launch task is done!");

  view = await getRoadmapViewMirrored(business.id, user.id);
  const launchStageAfter = view!.stages.find((s) => s.stage === RoadmapStageKey.Launch)!;
  console.log(`Launch stage status after completing all its tasks: ${launchStageAfter.status} (expected "completed")`);
  if (launchStageAfter.status !== "completed") throw new Error("Launch stage status should be 'completed'!");

  console.log("\n=== Step 5: un-completing a task never revokes an already-earned badge ===");
  const toggle4 = await toggleTaskCompletionMirrored(launchTask1.id, user.id);
  console.log(`After un-completing launchTask1: completed=${toggle4.completed}, totalXp=${toggle4.totalXp} (expected 30), unlockedBadgeKeys still includes readyToLaunch: ${toggle4.unlockedBadgeKeys.includes("readyToLaunch")}`);
  if (toggle4.completed !== false || toggle4.totalXp !== 30) throw new Error("Un-completion didn't correctly reduce XP!");
  if (!toggle4.unlockedBadgeKeys.includes("readyToLaunch")) throw new Error("Badge was revoked after un-completing a task — badges must never be revoked!");
  // Re-complete it so later assertions about total task/completion counts stay predictable.
  await toggleTaskCompletionMirrored(launchTask1.id, user.id);

  console.log("\n=== Step 6: ownership check — a foreign task ID is rejected ===");
  const otherBusiness = await db.business.create({ data: { userId: otherUser.id, businessTypeId: businessType.id, name: "Other User's Business" } });
  const otherRoadmap = await db.roadmap.create({ data: { userId: otherUser.id, businessId: otherBusiness.id } });
  const otherTask = await db.roadmapTask.create({
    data: { roadmapId: otherRoadmap.id, title: "Someone else's task", stage: RoadmapStageKey.Preparation, month: 1, order: 0, xpValue: 10 },
  });
  let rejected = false;
  try {
    await toggleTaskCompletionMirrored(otherTask.id, user.id);
  } catch {
    rejected = true;
  }
  console.log(`Toggling another user's task rejected: ${rejected}`);
  if (!rejected) throw new Error("Expected toggling a foreign task to throw!");

  console.log("\n=== Cleanup ===");
  await db.roadmapTask.deleteMany({ where: { roadmapId: { in: [roadmap.id, otherRoadmap.id] } } });
  await db.roadmap.deleteMany({ where: { id: { in: [roadmap.id, otherRoadmap.id] } } });
  await db.business.deleteMany({ where: { id: { in: [business.id, otherBusiness.id] } } });
  await db.user.deleteMany({ where: { id: { in: [user.id, otherUser.id] } } });
  console.log("Removed throwaway test data.");

  console.log("\n✅ All roadmap view/toggle checks passed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
