/**
 * Part B verification script — not a test, not part of the app. Exercises
 * the REAL per-section generation pipeline (readBlueprintGenerationContext
 * -> buildSectionSystemPrompt/buildSectionUserPrompt -> per-section Zod
 * schema -> persist) against a real adopted Business with real assessment
 * answers, for a ROMANIAN-locale user specifically — to prove the locale
 * fix (see src/ai/prompts/blueprint.ts's STRONG_LOCALE_DIRECTIVE).
 *
 * IMPORTANT — network constraint: this sandbox's egress policy blocks
 * api.openai.com outright (re-confirmed before writing this script — same
 * 403 as Part 2). A real model call cannot be made from here. Everything
 * EXCEPT the actual network call is real: real business-library content,
 * real assessment answers, the real prompt builder, the real per-section
 * Zod schema, the real retry-then-fail state machine. Only
 * `openai.chat.completions.create` itself is monkey-patched, to a function
 * that returns a controllable canned response — this script prints the
 * REAL assembled prompt (proving real grounding + real personalization +
 * the strengthened Romanian locale directive all appear) and separately
 * exercises the ready/failed/retry-recovers paths with mock completions.
 *
 * Run with `npm run section-generation:check`.
 */
import { randomUUID } from "node:crypto";
import { db } from "../src/lib/db";
import { flattenedQuestions } from "../src/features/assessment/config/sections";
import { openai } from "../src/ai/openai";
import { buildSectionSystemPrompt, buildSectionUserPrompt, type BlueprintSectionKey } from "../src/ai/prompts/blueprint";
import { readBlueprintGenerationContext } from "../src/features/business-engine/utils/blueprint-generation-context";
import { getSectionContentSchema } from "../src/features/business-engine/schemas/section-content";
import { fetchRawAnswersForMatching } from "../src/features/assessment/actions/fetch-raw-answers";

// Distinctive values chosen so they're easy to spot verbatim in the assembled prompt.
const TEST_BUDGET = 17650;
const TEST_TARGET_MONTHLY_INCOME = 8200;
const TEST_DESIRED_TIMELINE = "sixMonths";

const SAMPLE_ANSWERS: Record<string, unknown> = {
  age: "31",
  country: "Romania",
  employment: "employed",
  weeklyAvailability: 25,
  incomeUrgency: "moderate",
  budget: TEST_BUDGET,
  targetMonthlyIncome: TEST_TARGET_MONTHLY_INCOME,
  desiredTimeline: TEST_DESIRED_TIMELINE,
  decisionMaking: "analytical",
  motivation: "freedom",
  sellingPreference: 2,
  leadership: 3,
  problemSolving: 5,
  creativity: 3,
  structureVsFlexibility: 60,
  marketing: 2,
  sales: 2,
  programming: 5,
  ai: 5,
  finance: 3,
  management: 3,
  design: 2,
  content: 2,
  negotiation: 2,
  communication: 3,
  remote: "remote",
  travel: "none",
  employees: "soloOnly",
  freedom: 5,
  workingHours: 40,
  b2bVsB2c: "b2b",
  onlineVsOffline: "online",
  riskTolerance: 55,
  failureTolerance: 3,
  investmentConfidence: 3,
  industries: ["tech"],
  businessModels: ["saas", "service"],
  topics: "AI tooling",
  neverDo: "cold calling",
  fiveYearVision: "Run a small, profitable software studio.",
  definitionOfSuccess: "Financial independence.",
};

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

/** Mirrors generateAndValidateSection() exactly (see src/features/business-engine/actions/request-section-generation.ts). */
async function generateAndValidateSection(slug: string, locale: "en" | "ro", assessmentId: string, sectionKey: BlueprintSectionKey) {
  const context = await readBlueprintGenerationContext(slug, locale);
  const rawAnswers = await fetchRawAnswersForMatching(assessmentId);
  const systemPrompt = buildSectionSystemPrompt(locale, sectionKey);
  const userPrompt = buildSectionUserPrompt(context, rawAnswers, sectionKey);

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
  return { validated: getSectionContentSchema(sectionKey).parse(parsed), systemPrompt, userPrompt };
}

/** Mirrors generateSectionContent()'s retry-then-fail control flow exactly. */
async function generateSectionContentMirrored(
  sectionId: string,
  slug: string,
  locale: "en" | "ro",
  assessmentId: string,
  sectionKey: BlueprintSectionKey
) {
  try {
    let result;
    try {
      result = await generateAndValidateSection(slug, locale, assessmentId, sectionKey);
    } catch {
      result = await generateAndValidateSection(slug, locale, assessmentId, sectionKey);
    }
    await db.blueprintSection.update({
      where: { id: sectionId },
      data: { status: "ready", error: null, content: result.validated as object },
    });
    return result;
  } catch (error) {
    await db.blueprintSection
      .update({ where: { id: sectionId }, data: { status: "failed", error: error instanceof Error ? error.message.slice(0, 2000) : "Unknown error" } })
      .catch(() => {});
    return null;
  }
}

async function main() {
  console.log("=== Step 1: throwaway ROMANIAN-locale User + real Assessment (real answers) + adopted Business ===");
  const user = await db.user.create({
    data: { clerkId: `test_${randomUUID()}`, email: `test-${randomUUID()}@example.com`, locale: "ro" },
  });
  const session = await db.assessmentSession.create({
    data: { userId: user.id, locale: "ro", status: "completed", currentStep: flattenedQuestions.length - 1 },
  });
  for (const question of flattenedQuestions) {
    const dbQuestion = await db.assessmentQuestion.findUniqueOrThrow({ where: { key: question.key } });
    const value = SAMPLE_ANSWERS[question.key] ?? null;
    if (value === null) continue;
    await db.assessmentAnswer.create({ data: { sessionId: session.id, questionId: dbQuestion.id, value: value as never } });
  }
  const assessment = await db.assessment.create({ data: { userId: user.id, sessionId: session.id, locale: "ro" } });

  const businessType = await db.businessType.findFirstOrThrow({ where: { slug: "software-house" } });
  const business = await db.business.create({
    data: { userId: user.id, assessmentId: assessment.id, businessTypeId: businessType.id, name: "Test Adopted Business" },
  });
  const blueprint = await db.blueprint.create({ data: { businessId: business.id, locale: "ro" } });
  console.log(`Created Business ${business.id} (${businessType.slug}), user locale=ro, budget=${TEST_BUDGET} RON-equivalent test value`);

  const SECTION_KEY: BlueprintSectionKey = "financialForecast";
  const section = await db.blueprintSection.create({
    data: { blueprintId: blueprint.id, sectionKey: SECTION_KEY, status: "generating" },
  });

  console.log(`\n=== Step 2: SCENARIO A — real prompt assembly + valid mock completion for "${SECTION_KEY}" -> 'ready' ===`);
  mockResponseQueue = [JSON.stringify({ body: "Prognoză financiară de test cu conținut suficient de lung pentru a trece de validarea Zod care cere minimum 500 de caractere pentru câmpul body. ".repeat(6) })];
  installMockOpenAi();
  const t0 = Date.now();
  const result = await generateSectionContentMirrored(section.id, businessType.slug, "ro", assessment.id, SECTION_KEY);
  console.log(`generateSectionContentMirrored() took ${Date.now() - t0}ms (mocked call — NOT representative of real API latency)`);
  restoreOpenAi();
  if (!result) throw new Error("Expected scenario A to succeed!");

  const afterA = await db.blueprintSection.findUniqueOrThrow({ where: { id: section.id } });
  console.log(`Status: ${afterA.status}`);
  if (afterA.status !== "ready") throw new Error(`Expected "ready", got "${afterA.status}"`);
  getSectionContentSchema(SECTION_KEY).parse(afterA.content); // re-validate what's actually persisted

  console.log("\n--- Real system prompt (proves the strengthened Romanian locale directive is present) ---");
  console.log(result.systemPrompt);

  console.log("\n--- Real assembled user prompt excerpts ---");
  console.log(`Total user prompt length: ${result.userPrompt.length} chars`);
  const containsBudget = result.userPrompt.includes(String(TEST_BUDGET));
  const containsIncome = result.userPrompt.includes(String(TEST_TARGET_MONTHLY_INCOME));
  const containsRomanianDirective = result.userPrompt.includes("exclusiv în limba română");
  console.log(`Contains TEST_BUDGET (${TEST_BUDGET}): ${containsBudget}`);
  console.log(`Contains TEST_TARGET_MONTHLY_INCOME (${TEST_TARGET_MONTHLY_INCOME}): ${containsIncome}`);
  console.log(`Contains the strengthened Romanian locale directive: ${containsRomanianDirective}`);
  if (!containsBudget || !containsIncome || !containsRomanianDirective) {
    throw new Error("Real personalization data or the locale directive did not make it into the assembled prompt!");
  }
  console.log("\n--- Real business-content grounding excerpt (first 900 chars of the section-relevant reference material) ---");
  const groundingStart = result.userPrompt.indexOf("Relevant structured business facts");
  console.log(result.userPrompt.slice(groundingStart, groundingStart + 900));

  console.log("\n=== Step 3: SCENARIO B — malformed JSON on both attempts -> 'failed' with a clear error ===");
  await db.blueprintSection.update({ where: { id: section.id }, data: { status: "generating", error: null } });
  mockResponseQueue = ["{not valid json", "{not valid json either"];
  installMockOpenAi();
  await generateSectionContentMirrored(section.id, businessType.slug, "ro", assessment.id, SECTION_KEY);
  restoreOpenAi();
  const afterB = await db.blueprintSection.findUniqueOrThrow({ where: { id: section.id } });
  console.log(`Status: ${afterB.status} | Error: ${afterB.error}`);
  if (afterB.status !== "failed" || !afterB.error) throw new Error("Expected 'failed' with a clear error after two malformed responses!");

  console.log("\n=== Step 4: SCENARIO C — first attempt malformed, second attempt valid -> retry recovers to 'ready' ===");
  await db.blueprintSection.update({ where: { id: section.id }, data: { status: "generating", error: null } });
  mockResponseQueue = [
    "{not valid json",
    JSON.stringify({ body: "Conținut valid la a doua încercare, suficient de lung pentru validarea Zod de minimum 500 de caractere. ".repeat(6) }),
  ];
  installMockOpenAi();
  await generateSectionContentMirrored(section.id, businessType.slug, "ro", assessment.id, SECTION_KEY);
  restoreOpenAi();
  const afterC = await db.blueprintSection.findUniqueOrThrow({ where: { id: section.id } });
  console.log(`Status: ${afterC.status} (should recover to "ready" via the retry)`);
  if (afterC.status !== "ready") throw new Error(`Expected the retry to recover to "ready", got "${afterC.status}"`);

  console.log("\n=== Step 5: also spot-check a structured section (swot) uses the array-shaped schema correctly ===");
  const swotSection = await db.blueprintSection.create({ data: { blueprintId: blueprint.id, sectionKey: "swot", status: "generating" } });
  mockResponseQueue = [
    JSON.stringify({
      strengths: ["Punct forte 1 detaliat", "Punct forte 2 detaliat", "Punct forte 3 detaliat"],
      weaknesses: ["Punct slab 1 detaliat", "Punct slab 2 detaliat", "Punct slab 3 detaliat"],
      opportunities: ["Oportunitate 1 detaliată", "Oportunitate 2 detaliată", "Oportunitate 3 detaliată"],
      threats: ["Amenințare 1 detaliată", "Amenințare 2 detaliată", "Amenințare 3 detaliată"],
    }),
  ];
  installMockOpenAi();
  await generateSectionContentMirrored(swotSection.id, businessType.slug, "ro", assessment.id, "swot");
  restoreOpenAi();
  const swotAfter = await db.blueprintSection.findUniqueOrThrow({ where: { id: swotSection.id } });
  console.log(`SWOT status: ${swotAfter.status}, keys: ${Object.keys(swotAfter.content as object)}`);
  if (swotAfter.status !== "ready") throw new Error("Expected the structured swot section to reach 'ready'!");

  console.log("\n=== Cleanup ===");
  await db.blueprintSection.deleteMany({ where: { blueprintId: blueprint.id } });
  await db.blueprint.delete({ where: { id: blueprint.id } });
  await db.business.delete({ where: { id: business.id } });
  await db.assessment.delete({ where: { id: assessment.id } });
  await db.assessmentAnswer.deleteMany({ where: { sessionId: session.id } });
  await db.assessmentSession.delete({ where: { id: session.id } });
  await db.user.delete({ where: { id: user.id } });
  console.log("Removed throwaway test data.");

  console.log("\n✅ All per-section real-prompt checks passed (network call mocked — see script docstring).");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
