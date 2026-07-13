/**
 * Roadmap Part 2 verification script — not a test, not part of the app.
 * Exercises the real AI-enrichment pipeline for launchPlan/growthPlan
 * (createRoadmapTasksFromSection(), mirrored here minus the
 * requireCurrentUser() call this script can't satisfy outside a real
 * request — same rationale as every other *-check.ts script in this
 * directory) layered on top of a real Part 1 deterministic seed, using a
 * mocked OpenAI completion since this sandbox still can't reach
 * api.openai.com (re-confirmed before writing this script — same 403 as
 * every prior AI-feature check today).
 *
 * Traces: adopt (real Part 1 seed) -> trigger launchPlan generation
 * (mocked) -> new RoadmapTask rows with sourceSectionKey="launchPlan",
 * correct xpValue, order continuing after the deterministic tasks ->
 * recomputeRoadmapProgress reflects the new count -> regenerate ->
 * old AI tasks replaced, not duplicated, deterministic tasks untouched.
 * Also spot-checks growthPlan for parity.
 *
 * Run with `npm run roadmap-enrichment:check`.
 */
import { randomUUID } from "node:crypto";
import { db } from "../src/lib/db";
import { openai } from "../src/ai/openai";
import { buildSectionSystemPrompt, buildSectionUserPrompt, type BlueprintSectionKey } from "../src/ai/prompts/blueprint";
import { readBlueprintGenerationContext } from "../src/features/business-engine/utils/blueprint-generation-context";
import { readRoadmapSeedTasks } from "../src/features/business-engine/utils/roadmap-seed-content";
import { getSectionContentSchema, type RoadmapPlanSectionContent } from "../src/features/business-engine/schemas/section-content";
import { fetchRawAnswersForMatching } from "../src/features/assessment/actions/fetch-raw-answers";
import { recomputeRoadmapProgress } from "../src/features/business-engine/utils/roadmap-progress";
import { RoadmapStageKey, ROADMAP_STAGE_ORDER } from "../src/features/roadmap/types/sections";
import type { Locale } from "../src/i18n/config";

const TEST_BUDGET = 21400;
const TEST_TARGET_MONTHLY_INCOME = 9100;
const TEST_DESIRED_TIMELINE = "threeMonths";

type CompletionsCreate = typeof openai.chat.completions.create;
let mockResponseQueue: string[] = [];
const originalCreate: CompletionsCreate = openai.chat.completions.create.bind(openai.chat.completions);
function installMockOpenAi() {
  // @ts-expect-error — narrowing the real SDK's overloaded return type for this test double is not worth the ceremony.
  openai.chat.completions.create = async () => {
    const content = mockResponseQueue.shift();
    if (content === undefined) throw new Error("Mock queue exhausted.");
    return { choices: [{ message: { content } }] } as Awaited<ReturnType<CompletionsCreate>>;
  };
}
function restoreOpenAi() {
  openai.chat.completions.create = originalCreate;
}

function mockLaunchPlanResponse(): RoadmapPlanSectionContent {
  return {
    tasks: [
      {
        title: "Semnează primul contract de discovery sprint în 3 săptămâni",
        description: `Cu un buget real de €${TEST_BUDGET} și un termen dorit de doar 3 luni, prioritizează un singur prospect cald din rețeaua de recomandări în loc să aștepți un site complet — vinde primul sprint de descoperire plătit direct din conversații existente.`,
        xpValue: 20,
      },
      {
        title: "Publică pagina de portofoliu minimă în prima săptămână",
        description: "O singură pagină cu 2-3 proiecte anterioare și un formular de contact este suficientă pentru a susține primele conversații de vânzare — nu aștepta un site complet înainte de a începe prospectarea.",
        xpValue: 10,
      },
      {
        title: `Stabilește un obiectiv de venit lunar de €${TEST_TARGET_MONTHLY_INCOME} până în luna 3`,
        description: "Împarte acest obiectiv în 2 proiecte cu scop fix sau un proiect plus un abonament de mentenanță, calculat pe baza intervalului de preț tipic pentru acest tip de afacere.",
        xpValue: 15,
      },
    ],
  };
}

/** Mirrors createRoadmapTasksFromSection()'s logic exactly (see src/features/business-engine/actions/request-section-generation.ts). */
async function createRoadmapTasksFromSectionMirrored(businessId: string, sectionKey: BlueprintSectionKey, content: RoadmapPlanSectionContent) {
  const stageMap: Partial<Record<BlueprintSectionKey, RoadmapStageKey>> = {
    launchPlan: RoadmapStageKey.Launch,
    growthPlan: RoadmapStageKey.Growth,
  };
  const stage = stageMap[sectionKey];
  if (!stage) return;

  const roadmap = await db.roadmap.findUnique({ where: { businessId } });
  if (!roadmap) return;

  await db.roadmapTask.deleteMany({ where: { roadmapId: roadmap.id, sourceSectionKey: sectionKey } });

  const remainingTasksInStage = await db.roadmapTask.findMany({ where: { roadmapId: roadmap.id, stage }, select: { order: true } });
  const startOrder = remainingTasksInStage.length > 0 ? Math.max(...remainingTasksInStage.map((t) => t.order)) + 1 : 0;
  const month = ROADMAP_STAGE_ORDER.indexOf(stage) + 1;

  await db.roadmapTask.createMany({
    data: content.tasks.map((task, index) => ({
      roadmapId: roadmap.id,
      title: task.title,
      description: task.description,
      stage,
      month,
      order: startOrder + index,
      xpValue: task.xpValue,
      sourceSectionKey: sectionKey,
    })),
  });

  await recomputeRoadmapProgress(roadmap.id);
}

/** Mirrors generateAndValidateSection() exactly. */
async function generateAndValidateSection(slug: string, locale: Locale, assessmentId: string, sectionKey: BlueprintSectionKey) {
  const context = await readBlueprintGenerationContext(slug, locale);
  const rawAnswers = await fetchRawAnswersForMatching(assessmentId);
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: buildSectionSystemPrompt(locale, sectionKey) },
      { role: "user", content: buildSectionUserPrompt(context, rawAnswers, sectionKey) },
    ],
  });
  const raw = completion.choices[0]?.message?.content ?? "";
  return { validated: getSectionContentSchema(sectionKey).parse(JSON.parse(raw)), userPrompt: buildSectionUserPrompt(context, rawAnswers, sectionKey) };
}

async function main() {
  console.log("=== Step 1: throwaway User + Romanian Assessment + real budget/timeline answers ===");
  const user = await db.user.create({ data: { clerkId: `test_${randomUUID()}`, email: `test-${randomUUID()}@example.com` } });
  const session = await db.assessmentSession.create({ data: { userId: user.id, locale: "ro", status: "completed", currentStep: 0 } });
  const assessment = await db.assessment.create({ data: { userId: user.id, sessionId: session.id, locale: "ro" } });

  const { flattenedQuestions } = await import("../src/features/assessment/config/sections");
  const answers: Record<string, unknown> = {
    budget: TEST_BUDGET,
    targetMonthlyIncome: TEST_TARGET_MONTHLY_INCOME,
    desiredTimeline: TEST_DESIRED_TIMELINE,
    riskTolerance: 60,
  };
  for (const question of flattenedQuestions) {
    const dbQuestion = await db.assessmentQuestion.findUniqueOrThrow({ where: { key: question.key } });
    const value = answers[question.key];
    if (value === undefined) continue;
    await db.assessmentAnswer.create({ data: { sessionId: session.id, questionId: dbQuestion.id, value: value as never } });
  }

  const businessType = await db.businessType.findFirstOrThrow({ where: { slug: "software-house" } });
  const business = await db.business.create({
    data: { userId: user.id, assessmentId: assessment.id, businessTypeId: businessType.id, name: "Test Adopted Business" },
  });

  console.log("\n=== Step 2: Part 1's real deterministic seed (baseline the enrichment builds on) ===");
  const seedTasks = await readRoadmapSeedTasks(businessType.slug, "ro");
  const roadmap = await db.roadmap.create({ data: { userId: user.id, businessId: business.id } });
  await db.roadmapTask.createMany({
    data: seedTasks.map((t) => ({ roadmapId: roadmap.id, title: t.title, stage: t.stage, month: t.month, order: t.order })),
  });
  const deterministicCount = await db.roadmapTask.count({ where: { roadmapId: roadmap.id } });
  console.log(`Deterministic tasks seeded: ${deterministicCount} (all sourceSectionKey=null)`);
  const deterministicLaunchOrder = await db.roadmapTask.findMany({ where: { roadmapId: roadmap.id, stage: "launch" }, select: { order: true } });
  const deterministicMaxLaunchOrder = deterministicLaunchOrder.length > 0 ? Math.max(...deterministicLaunchOrder.map((t) => t.order)) : -1;
  console.log(`Deterministic 'launch' stage max order: ${deterministicMaxLaunchOrder} (new AI tasks should start after this)`);

  console.log("\n=== Step 3: trigger launchPlan generation (mocked completion, real prompt assembly) ===");
  mockResponseQueue = [JSON.stringify(mockLaunchPlanResponse())];
  installMockOpenAi();
  const result = await generateAndValidateSection(businessType.slug, "ro", assessment.id, "launchPlan");
  restoreOpenAi();

  const containsBudget = result.userPrompt.includes(String(TEST_BUDGET));
  const containsIncome = result.userPrompt.includes(String(TEST_TARGET_MONTHLY_INCOME));
  console.log(`Real prompt contains TEST_BUDGET (${TEST_BUDGET}): ${containsBudget}`);
  console.log(`Real prompt contains TEST_TARGET_MONTHLY_INCOME (${TEST_TARGET_MONTHLY_INCOME}): ${containsIncome}`);
  if (!containsBudget || !containsIncome) throw new Error("Real assessment figures did not make it into the launchPlan prompt!");

  await db.blueprint.create({ data: { businessId: business.id, locale: "ro" } }).catch(() => {});
  const blueprint = await db.blueprint.findUniqueOrThrow({ where: { businessId: business.id } });
  const section = await db.blueprintSection.create({
    data: { blueprintId: blueprint.id, sectionKey: "launchPlan", status: "ready", content: result.validated as object },
  });
  await createRoadmapTasksFromSectionMirrored(business.id, "launchPlan", result.validated as RoadmapPlanSectionContent);

  console.log("\n=== Step 4: confirm new RoadmapTask rows ===");
  const aiTasks = await db.roadmapTask.findMany({ where: { roadmapId: roadmap.id, sourceSectionKey: "launchPlan" }, orderBy: { order: "asc" } });
  console.log(`AI-generated launchPlan tasks: ${aiTasks.length}`);
  for (const t of aiTasks) console.log(`  order=${t.order} stage=${t.stage} xpValue=${t.xpValue} title="${t.title}"`);
  if (aiTasks.length !== 3) throw new Error(`Expected 3 AI tasks, got ${aiTasks.length}`);
  if (!aiTasks.every((t) => t.stage === "launch")) throw new Error("Expected all AI tasks tagged stage='launch'!");
  if (!aiTasks.every((t) => t.order > deterministicMaxLaunchOrder)) throw new Error("Expected AI task order to continue after the deterministic tasks!");
  if (!aiTasks.some((t) => t.description?.includes(String(TEST_BUDGET)))) throw new Error("Expected a task description to reference the real budget!");
  const deterministicUntouched = await db.roadmapTask.count({ where: { roadmapId: roadmap.id, sourceSectionKey: null } });
  console.log(`Deterministic tasks still present, untouched: ${deterministicUntouched} (expected ${deterministicCount})`);
  if (deterministicUntouched !== deterministicCount) throw new Error("Deterministic tasks were affected by the AI enrichment!");

  console.log("\n=== Step 5: recomputeRoadmapProgress reflects the new total task count ===");
  const totalTasks = await db.roadmapTask.count({ where: { roadmapId: roadmap.id } });
  console.log(`Total tasks now: ${totalTasks} (${deterministicCount} deterministic + ${aiTasks.length} AI)`);
  const progress = await recomputeRoadmapProgress(roadmap.id);
  console.log(`totalXp=${progress.totalXp}, badges=${JSON.stringify(progress.unlockedBadgeKeys)} (0 completed so far, both should be empty/0)`);
  if (progress.totalXp !== 0) throw new Error("Expected 0 XP before any task is completed!");

  console.log("\n=== Step 6: regenerate launchPlan — old AI tasks replaced, not duplicated ===");
  mockResponseQueue = [
    JSON.stringify({
      tasks: [
        { title: "Task nou după regenerare 1", description: `Referință buget €${TEST_BUDGET} din nou.`, xpValue: 12 },
        { title: "Task nou după regenerare 2", description: "Al doilea task nou.", xpValue: 8 },
      ],
    }),
  ];
  installMockOpenAi();
  const regenResult = await generateAndValidateSection(businessType.slug, "ro", assessment.id, "launchPlan");
  restoreOpenAi();
  await db.blueprintSection.update({ where: { id: section.id }, data: { content: regenResult.validated as object } });
  await createRoadmapTasksFromSectionMirrored(business.id, "launchPlan", regenResult.validated as RoadmapPlanSectionContent);

  const afterRegenAiTasks = await db.roadmapTask.findMany({ where: { roadmapId: roadmap.id, sourceSectionKey: "launchPlan" } });
  console.log(`AI tasks after regeneration: ${afterRegenAiTasks.length} (expected 2, the NEW set, not 3+2=5)`);
  if (afterRegenAiTasks.length !== 2) throw new Error(`Expected regeneration to REPLACE the old 3 tasks with the new 2, got ${afterRegenAiTasks.length}!`);
  const deterministicStillUntouched = await db.roadmapTask.count({ where: { roadmapId: roadmap.id, sourceSectionKey: null } });
  if (deterministicStillUntouched !== deterministicCount) throw new Error("Deterministic tasks were affected by regeneration!");
  console.log("=> Confirmed: regeneration replaced the old AI tasks, deterministic tasks untouched.");

  console.log("\n=== Step 7: growthPlan enrichment, for parity ===");
  mockResponseQueue = [
    JSON.stringify({
      tasks: [
        { title: "Angajează primul inginer senior contractual", description: `Cu bugetul de €${TEST_BUDGET}, prioritizează un contractor part-time în locul unei angajări full-time.`, xpValue: 18 },
        { title: "Testează un al doilea canal de achiziție", description: "Extinde dincolo de recomandări către conținut tehnic.", xpValue: 10 },
      ],
    }),
  ];
  installMockOpenAi();
  const growthResult = await generateAndValidateSection(businessType.slug, "ro", assessment.id, "growthPlan");
  restoreOpenAi();
  await createRoadmapTasksFromSectionMirrored(business.id, "growthPlan", growthResult.validated as RoadmapPlanSectionContent);
  const growthTasks = await db.roadmapTask.findMany({ where: { roadmapId: roadmap.id, sourceSectionKey: "growthPlan" } });
  console.log(`growthPlan AI tasks: ${growthTasks.length}, all stage='growth': ${growthTasks.every((t) => t.stage === "growth")}`);
  if (growthTasks.length !== 2 || !growthTasks.every((t) => t.stage === "growth")) throw new Error("growthPlan enrichment didn't work as expected!");

  console.log("\n=== Cleanup ===");
  await db.roadmapTask.deleteMany({ where: { roadmapId: roadmap.id } });
  await db.blueprintSection.deleteMany({ where: { blueprintId: blueprint.id } });
  await db.blueprint.delete({ where: { id: blueprint.id } });
  await db.roadmap.delete({ where: { id: roadmap.id } });
  await db.business.delete({ where: { id: business.id } });
  await db.assessment.delete({ where: { id: assessment.id } });
  await db.assessmentAnswer.deleteMany({ where: { sessionId: session.id } });
  await db.assessmentSession.delete({ where: { id: session.id } });
  await db.user.delete({ where: { id: user.id } });
  console.log("Removed throwaway test data.");

  console.log("\n✅ All roadmap AI-enrichment checks passed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
