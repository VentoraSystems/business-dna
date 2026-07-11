/**
 * Blueprint Generation Part 2 verification script — not a test, not part of
 * the app. Exercises the REAL generation pipeline
 * (readBlueprintGenerationContext -> buildBlueprintSystemPrompt/
 * buildBlueprintUserPrompt -> blueprintContentSchema validation -> persist)
 * against a real adopted Business with real assessment answers.
 *
 * IMPORTANT — network constraint: this sandbox's egress policy blocks
 * api.openai.com outright (403 from the proxy, confirmed independent of
 * whether a key is configured — see /root/.ccr/README.md's "403/407 from
 * the proxy: do not retry or route around it"). A real model call cannot
 * be made from here. Everything EXCEPT the actual network call is real:
 * real business-library content, real assessment answers, the real prompt
 * builder, the real Zod schema, the real retry-then-fail state machine.
 * Only `openai.chat.completions.create` itself is monkey-patched, to a
 * function that returns a controllable canned response — this script
 * prints the REAL assembled prompt (proving real personalization data
 * flows in) and separately prints the mock completion's content (clearly
 * a stand-in for real model output, not itself evidence of quality).
 *
 * Run with `npm run blueprint-trigger:check`.
 */
import { randomUUID } from "node:crypto";
import { db } from "../src/lib/db";
import { flattenedQuestions } from "../src/features/assessment/config/sections";
import { openai } from "../src/ai/openai";
import { buildBlueprintSystemPrompt, buildBlueprintUserPrompt } from "../src/ai/prompts/blueprint";
import { readBlueprintGenerationContext } from "../src/features/business-engine/utils/blueprint-generation-context";
import { blueprintContentSchema, type BlueprintContent } from "../src/features/business-engine/schemas/blueprint-content";
import { fetchRawAnswersForMatching } from "../src/features/assessment/actions/fetch-raw-answers";

// Distinctive values chosen specifically so they're easy to spot verbatim in the assembled prompt —
// proving personalization data actually flows in, not just "a number that happens to be present".
const TEST_BUDGET = 12345;
const TEST_TARGET_MONTHLY_INCOME = 6789;
const TEST_DESIRED_TIMELINE = "sixMonths";
const TEST_RISK_TOLERANCE = 82;

const SAMPLE_ANSWERS: Record<string, unknown> = {
  age: "27",
  country: "Romania",
  employment: "employed",
  weeklyAvailability: 30,
  incomeUrgency: "moderate",
  budget: TEST_BUDGET,
  targetMonthlyIncome: TEST_TARGET_MONTHLY_INCOME,
  desiredTimeline: TEST_DESIRED_TIMELINE,
  decisionMaking: "analytical",
  motivation: "freedom",
  sellingPreference: 2,
  leadership: 2,
  problemSolving: 5,
  creativity: 3,
  structureVsFlexibility: 70,
  marketing: 2,
  sales: 2,
  programming: 5,
  ai: 5,
  finance: 3,
  management: 2,
  design: 2,
  content: 2,
  negotiation: 2,
  communication: 3,
  remote: "remote",
  travel: "none",
  employees: "soloOnly",
  freedom: 5,
  workingHours: 45,
  b2bVsB2c: "b2b",
  onlineVsOffline: "online",
  riskTolerance: TEST_RISK_TOLERANCE,
  failureTolerance: 4,
  investmentConfidence: 4,
  industries: ["tech"],
  businessModels: ["saas", "service"],
  topics: "AI tooling",
  neverDo: "cold calling",
  fiveYearVision: "Run a small, profitable software studio.",
  definitionOfSuccess: "Financial independence.",
};

/** A plausible, well-formed mock completion — stands in for real model output only to exercise parse -> validate -> persist. Deliberately echoes TEST_BUDGET/TEST_TARGET_MONTHLY_INCOME so the "ready" path's persisted content is visibly traceable to this test's inputs. */
function buildMockValidCompletion(): BlueprintContent {
  return {
    executiveSummary: `This plan is built for a founder with a real budget of €${TEST_BUDGET} and a target monthly income of €${TEST_TARGET_MONTHLY_INCOME}, targeting a ${TEST_DESIRED_TIMELINE} runway to their first customer. [MOCK CONTENT — stands in for real model output.]`,
    businessDescription: "[MOCK] A project-based custom software studio serving funded startups and mid-market operators.",
    targetAudience: "[MOCK] Funded startup founders and mid-market operations leaders needing a bespoke internal tool.",
    marketAnalysis: "[MOCK] Demand split between founders priced out of a full in-house team and mid-market firms with too-specific tooling needs.",
    competitorAnalysis: "[MOCK] Synthesized from the business's market position vs. solo freelancers and offshore dev shops.",
    swot: {
      strengths: ["[MOCK] Paid discovery sprint de-risks fixed pricing", "[MOCK] Dedicated PM per client"],
      weaknesses: ["[MOCK] Not solo-founder-friendly", "[MOCK] Key-engineer dependency"],
      opportunities: [`[MOCK] User's €${TEST_BUDGET} budget covers company formation plus an initial contractor retainer`],
      threats: ["[MOCK] AI coding assistants commoditizing simple CRUD work"],
    },
    businessModelCanvas: {
      keyPartners: "[MOCK] Contract engineers, design freelancers.",
      keyActivities: "[MOCK] Discovery sprints, two-week delivery sprints, QA passes.",
      keyResources: "[MOCK] Senior engineering talent, delivery playbooks.",
      valuePropositions: "[MOCK] De-risked fixed pricing via paid discovery.",
      customerRelationships: "[MOCK] Dedicated project manager, live sprint demos.",
      channels: "[MOCK] Referrals, technical content, targeted outbound.",
      customerSegments: "[MOCK] Funded startup founders; mid-market operations leaders.",
      costStructure: `[MOCK] Bootstrapped from the user's €${TEST_BUDGET} starting budget: tooling, legal, contractor retainer.`,
      revenueStreams: "[MOCK] Fixed-scope project fees, maintenance retainers, advisory hours.",
    },
    marketingPlan: "[MOCK] Referral-led, backed by technical content marketing.",
    salesStrategy: "[MOCK] Consultative, paid-discovery-sprint-led sales motion.",
    financialForecast: `[MOCK] Personalized to the user's own €${TEST_BUDGET} budget and €${TEST_TARGET_MONTHLY_INCOME}/month target, over a ${TEST_DESIRED_TIMELINE} horizon — not the business's generic €15,000-€30,000 range.`,
    operations: "[MOCK] Discovery sprint, two-week delivery cycles, staging QA, maintenance SLA.",
    launchPlan: "[MOCK] Form the company, draft contract templates, sell the first discovery sprint.",
    growthPlan: "[MOCK] Hire a second senior engineer, then specialize into 1-2 vertical niches.",
    riskAnalysis: "[MOCK] Scope creep, key-engineer dependency, AI commoditizing low-end CRUD work.",
    exitStrategy: "[MOCK] Documented client book and retainer contracts attractive to acquiring studios.",
  };
}

type CompletionsCreate = typeof openai.chat.completions.create;
let mockResponseQueue: string[] = [];
const originalCreate: CompletionsCreate = openai.chat.completions.create.bind(openai.chat.completions);

function installMockOpenAi() {
  // @ts-expect-error — narrowing the real SDK's overloaded return type for this test double is not worth the ceremony.
  openai.chat.completions.create = async () => {
    const content = mockResponseQueue.shift();
    if (content === undefined) throw new Error("Mock queue exhausted — test set up fewer canned responses than calls made.");
    return { choices: [{ message: { content } }] } as Awaited<ReturnType<CompletionsCreate>>;
  };
}

function restoreOpenAi() {
  openai.chat.completions.create = originalCreate;
}

/** Mirrors generateAndValidate() exactly (see src/features/business-engine/actions/request-blueprint-generation.ts) — the real context/prompt/schema pipeline, calling the (mocked) openai client the same way the real code does. */
async function generateAndValidate(slug: string, locale: "en" | "ro", assessmentId: string) {
  const context = readBlueprintGenerationContext(slug, locale);
  const rawAnswers = await fetchRawAnswersForMatching(assessmentId);
  const systemPrompt = buildBlueprintSystemPrompt(locale);
  const userPrompt = buildBlueprintUserPrompt(context, rawAnswers);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });
  const raw = completion.choices[0]?.message?.content ?? "";
  const parsed: unknown = JSON.parse(raw);
  return { validated: blueprintContentSchema.parse(parsed), userPrompt };
}

/** Mirrors generateBlueprintContent()'s retry-then-fail control flow exactly. */
async function generateBlueprintContentMirrored(blueprintId: string, slug: string, locale: "en" | "ro", assessmentId: string) {
  try {
    let result;
    try {
      result = await generateAndValidate(slug, locale, assessmentId);
    } catch {
      result = await generateAndValidate(slug, locale, assessmentId);
    }
    await db.blueprint.update({
      where: { id: blueprintId },
      data: { status: "ready", error: null, content: result.validated as object },
    });
    return result.userPrompt;
  } catch (error) {
    await db.blueprint
      .update({
        where: { id: blueprintId },
        data: { status: "failed", error: error instanceof Error ? error.message.slice(0, 2000) : "Unknown error" },
      })
      .catch(() => {});
    return null;
  }
}

async function main() {
  console.log("=== Step 1: throwaway User + real Assessment (real answers) + adopted Business ===");
  const user = await db.user.create({
    data: { clerkId: `test_${randomUUID()}`, email: `test-${randomUUID()}@example.com`, locale: "en" },
  });
  const session = await db.assessmentSession.create({
    data: { userId: user.id, locale: "en", status: "completed", currentStep: flattenedQuestions.length - 1 },
  });
  for (const question of flattenedQuestions) {
    const dbQuestion = await db.assessmentQuestion.findUniqueOrThrow({ where: { key: question.key } });
    const value = SAMPLE_ANSWERS[question.key] ?? null;
    if (value === null) continue;
    await db.assessmentAnswer.create({ data: { sessionId: session.id, questionId: dbQuestion.id, value: value as never } });
  }
  const assessment = await db.assessment.create({ data: { userId: user.id, sessionId: session.id, locale: "en" } });

  const businessType = await db.businessType.findFirstOrThrow({ where: { slug: "software-house" } });
  const business = await db.business.create({
    data: { userId: user.id, assessmentId: assessment.id, businessTypeId: businessType.id, name: "Test Adopted Business" },
  });
  console.log(`Created Business ${business.id} (${businessType.slug}), assessment ${assessment.id}, budget=€${TEST_BUDGET}`);

  console.log("\n=== Step 2: trigger (real Blueprint row, status 'generating') ===");
  const blueprint = await db.blueprint.upsert({
    where: { businessId: business.id },
    update: { status: "generating", error: null },
    create: { businessId: business.id, locale: "en", status: "generating", content: {} },
  });

  console.log("\n=== Step 3: SCENARIO A — valid mock completion -> 'ready' with real prompt + parsed content ===");
  mockResponseQueue = [JSON.stringify(buildMockValidCompletion())];
  installMockOpenAi();
  const t0 = Date.now();
  const realUserPrompt = await generateBlueprintContentMirrored(blueprint.id, businessType.slug, "en", assessment.id);
  console.log(`generateBlueprintContentMirrored() took ${Date.now() - t0}ms (mocked call — NOT representative of real API latency)`);
  restoreOpenAi();

  const afterA = await db.blueprint.findUniqueOrThrow({ where: { id: blueprint.id } });
  console.log(`Status: ${afterA.status}`);
  if (afterA.status !== "ready") throw new Error(`Expected "ready", got "${afterA.status}"`);
  const content = afterA.content as unknown as BlueprintContent;
  blueprintContentSchema.parse(content); // re-validate what's actually persisted, not just what we sent in

  console.log("\n--- Real assembled prompt excerpt (proves real personalization data flows in) ---");
  const promptExcerptStart = realUserPrompt!.indexOf("## This user's real assessment answers");
  console.log(realUserPrompt!.slice(promptExcerptStart, promptExcerptStart + 600));
  const containsBudget = realUserPrompt!.includes(String(TEST_BUDGET));
  const containsIncome = realUserPrompt!.includes(String(TEST_TARGET_MONTHLY_INCOME));
  console.log(`\nPrompt contains TEST_BUDGET (${TEST_BUDGET}): ${containsBudget}`);
  console.log(`Prompt contains TEST_TARGET_MONTHLY_INCOME (${TEST_TARGET_MONTHLY_INCOME}): ${containsIncome}`);
  if (!containsBudget || !containsIncome) throw new Error("Real assessment figures did not make it into the assembled prompt!");

  console.log("\n--- Persisted content excerpts (from the MOCK completion — proves parse/validate/persist works, not model quality) ---");
  console.log("executiveSummary:", content.executiveSummary);
  console.log("financialForecast:", content.financialForecast);
  console.log("swot:", JSON.stringify(content.swot, null, 2));

  console.log("\n=== Step 4: SCENARIO B — malformed JSON on both attempts -> 'failed' with a clear error ===");
  mockResponseQueue = ["{not valid json", "{not valid json either"];
  installMockOpenAi();
  await generateBlueprintContentMirrored(blueprint.id, businessType.slug, "en", assessment.id);
  restoreOpenAi();
  const afterB = await db.blueprint.findUniqueOrThrow({ where: { id: blueprint.id } });
  console.log(`Status: ${afterB.status}`);
  console.log(`Error: ${afterB.error}`);
  if (afterB.status !== "failed") throw new Error(`Expected "failed" after two malformed responses, got "${afterB.status}"`);
  if (!afterB.error) throw new Error("Expected a clear error message on the failed row!");

  console.log("\n=== Step 5: SCENARIO C — first attempt malformed, second attempt valid -> retry recovers to 'ready' ===");
  mockResponseQueue = ["{not valid json", JSON.stringify(buildMockValidCompletion())];
  installMockOpenAi();
  await generateBlueprintContentMirrored(blueprint.id, businessType.slug, "en", assessment.id);
  restoreOpenAi();
  const afterC = await db.blueprint.findUniqueOrThrow({ where: { id: blueprint.id } });
  console.log(`Status: ${afterC.status} (should recover to "ready" via the retry)`);
  if (afterC.status !== "ready") throw new Error(`Expected the retry to recover to "ready", got "${afterC.status}"`);

  console.log("\n=== Cleanup ===");
  await db.blueprint.deleteMany({ where: { businessId: business.id } });
  await db.business.delete({ where: { id: business.id } });
  await db.assessment.delete({ where: { id: assessment.id } });
  await db.assessmentAnswer.deleteMany({ where: { sessionId: session.id } });
  await db.assessmentSession.delete({ where: { id: session.id } });
  await db.user.delete({ where: { id: user.id } });
  console.log("Removed throwaway test data.");

  console.log("\n✅ All blueprint-generation checks passed (network call mocked — see script docstring).");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
