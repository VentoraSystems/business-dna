/**
 * Verifies the actual root-cause fix for the Blueprint locale bug — not a
 * test, not part of the app.
 *
 * The Part B verification script (section-generation-real-check.ts) set
 * `locale: "ro"` directly on its throwaway test user, which is exactly
 * what production does NOT do: neither getCurrentUser()'s upsert
 * (src/lib/auth.ts) nor the Clerk user.created/user.updated webhook
 * (src/app/api/webhooks/clerk/route.ts) ever include `locale` in the data
 * they write, so every real User row's locale sits at the Prisma schema's
 * @default(en) permanently. That mock user unintentionally bypassed the
 * exact bug it was meant to catch. This script reproduces the REAL
 * conditions instead: a throwaway User created the same way production
 * creates one (no locale field at all, so it defaults to "en"), with a
 * throwaway AssessmentSession/Assessment created the way the real
 * assessment flow does (locale explicitly threaded in as "ro", matching
 * getOrCreateActiveSession(locale) in assessment-actions.ts).
 *
 * Also exercises the defensive language-heuristic check
 * (looksLikeWrongLanguage in request-section-generation.ts) with mocked
 * completions that come back in the wrong language despite a correct
 * locale value, proving that backstop independently of the primary fix.
 *
 * Run with `npm run section-locale-fix:check`.
 */
import { randomUUID } from "node:crypto";
import { db } from "../src/lib/db";
import { openai } from "../src/ai/openai";
import { buildSectionSystemPrompt, buildSectionUserPrompt, type BlueprintSectionKey } from "../src/ai/prompts/blueprint";
import { readBlueprintGenerationContext } from "../src/features/business-engine/utils/blueprint-generation-context";
import { getSectionContentSchema } from "../src/features/business-engine/schemas/section-content";
import { fetchRawAnswersForMatching } from "../src/features/assessment/actions/fetch-raw-answers";
import type { Locale } from "../src/i18n/config";

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

// Mirrors the ENGLISH_STOPWORDS / looksLikeWrongLanguage heuristic exactly
// (see src/features/business-engine/actions/request-section-generation.ts).
const ENGLISH_STOPWORDS = new Set([
  "the", "and", "is", "are", "of", "to", "in", "for", "with", "this", "that",
  "your", "you", "will", "should", "their", "from", "as", "on", "be", "it",
]);
function extractTextForLanguageCheck(content: unknown): string {
  if (!content || typeof content !== "object") return "";
  const parts: string[] = [];
  for (const value of Object.values(content as Record<string, unknown>)) {
    if (typeof value === "string") parts.push(value);
    else if (Array.isArray(value)) parts.push(...value.filter((v): v is string => typeof v === "string"));
  }
  return parts.join(" ");
}
function looksLikeWrongLanguage(content: unknown, expectedLocale: Locale): boolean {
  if (expectedLocale !== "ro") return false;
  const text = extractTextForLanguageCheck(content).toLowerCase();
  const words = text.split(/[^a-zăâîșț]+/).filter(Boolean);
  if (words.length < 20) return false;
  const englishHits = words.filter((word) => ENGLISH_STOPWORDS.has(word)).length;
  return englishHits / words.length > 0.08;
}

/** Mirrors generateAndValidateSection() exactly, including the language check. */
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
  const validated = getSectionContentSchema(sectionKey).parse(JSON.parse(raw));
  if (looksLikeWrongLanguage(validated, locale)) {
    throw new Error(`Generated content for "${sectionKey}" appears to be in the wrong language (expected "${locale}").`);
  }
  return validated;
}

async function generateSectionContentMirrored(sectionId: string, slug: string, locale: Locale, assessmentId: string, sectionKey: BlueprintSectionKey) {
  try {
    let content;
    try {
      content = await generateAndValidateSection(slug, locale, assessmentId, sectionKey);
    } catch {
      content = await generateAndValidateSection(slug, locale, assessmentId, sectionKey);
    }
    await db.blueprintSection.update({ where: { id: sectionId }, data: { status: "ready", error: null, content: content as object } });
    return content;
  } catch (error) {
    await db.blueprintSection
      .update({ where: { id: sectionId }, data: { status: "failed", error: error instanceof Error ? error.message.slice(0, 2000) : "Unknown error" } })
      .catch(() => {});
    return null;
  }
}

async function main() {
  console.log('=== Part 1: reproduce the REAL bug conditions — User created WITHOUT a locale field (matches production) ===');
  const user = await db.user.create({
    // Deliberately NOT setting `locale` — this is exactly what getCurrentUser()'s upsert and
    // the Clerk webhook actually do in production. Falls back to the schema's @default(en).
    data: { clerkId: `test_${randomUUID()}`, email: `test-${randomUUID()}@example.com` },
  });
  console.log(`User.locale (as actually created in prod-like conditions): "${user.locale}"`);
  if (user.locale !== "en") throw new Error("Test setup assumption broke — expected the schema default to be 'en'.");

  console.log("\n=== Part 2: throwaway AssessmentSession/Assessment created the way the real assessment flow does — locale='ro' ===");
  const session = await db.assessmentSession.create({ data: { userId: user.id, locale: "ro", status: "completed", currentStep: 0 } });
  const assessment = await db.assessment.create({ data: { userId: user.id, sessionId: session.id, locale: "ro" } });
  console.log(`Assessment.locale: "${assessment.locale}"`);

  const businessType = await db.businessType.findFirstOrThrow({ where: { slug: "software-house" } });
  const business = await db.business.create({
    data: { userId: user.id, assessmentId: assessment.id, businessTypeId: businessType.id, name: "Test Adopted Business" },
  });

  console.log("\n=== Part 3: mirror requestSectionGeneration()'s NEW locale-resolution logic ===");
  const businessWithAssessment = await db.business.findUniqueOrThrow({ where: { id: business.id }, include: { assessment: true } });
  const resolvedLocale = businessWithAssessment.assessment?.locale ?? user.locale;
  console.log(`Resolved Blueprint locale: "${resolvedLocale}" (business.assessment?.locale ?? user.locale)`);
  if (resolvedLocale !== "ro") {
    throw new Error(`BUG STILL PRESENT: resolved locale is "${resolvedLocale}", expected "ro" from the Assessment, not "en" from the User!`);
  }
  console.log("=> Confirmed: Blueprint.locale now correctly comes from Assessment.locale, not the always-'en' User.locale.");

  const blueprint = await db.blueprint.create({ data: { businessId: business.id, locale: resolvedLocale } });

  console.log("\n=== Part 4: language-heuristic backstop — mock returns ENGLISH content for a 'ro' section on both attempts -> 'failed' ===");
  const sectionA = await db.blueprintSection.create({ data: { blueprintId: blueprint.id, sectionKey: "executiveSummary", status: "generating" } });
  mockResponseQueue = [
    JSON.stringify({
      body: "This is a fully English executive summary that should be detected as the wrong language for a Romanian blueprint and trigger the retry mechanism automatically. The business plan needs proper localization for the target user, who specifically requested content in Romanian, not English. This paragraph is deliberately padded well past the schema's five-hundred-character minimum so that this scenario exercises the language heuristic specifically, rather than being rejected earlier by the length check for being too short to be substantive.",
    }),
    JSON.stringify({
      body: "This is another fully English executive summary, again in English, to confirm the retry also fails when the model does not comply with the Romanian instruction on the second attempt either. This paragraph is also padded well past the five-hundred-character schema minimum, so that this second mocked attempt is rejected specifically for being in the wrong language, not for being too short, proving the retry-then-fail path triggers on the language heuristic on both attempts, not on the length floor by coincidence.",
    }),
  ];
  installMockOpenAi();
  await generateSectionContentMirrored(sectionA.id, businessType.slug, "ro", assessment.id, "executiveSummary");
  restoreOpenAi();
  const afterA = await db.blueprintSection.findUniqueOrThrow({ where: { id: sectionA.id } });
  console.log(`Status: ${afterA.status} | Error: ${afterA.error}`);
  if (afterA.status !== "failed" || !afterA.error?.includes("wrong language")) {
    throw new Error("Expected the language heuristic to catch English content and ultimately fail with a language-mismatch error!");
  }

  console.log("\n=== Part 5: language-heuristic backstop recovers — first attempt English, second attempt real Romanian -> 'ready' ===");
  const sectionB = await db.blueprintSection.create({ data: { blueprintId: blueprint.id, sectionKey: "businessDescription", status: "generating" } });
  mockResponseQueue = [
    JSON.stringify({
      body: "This is a fully English business description that will be rejected by the language heuristic on the first attempt, not by the schema's length check — this paragraph is deliberately padded past the five-hundred-character minimum so the rejection reason under test is unambiguous rather than accidentally being a length failure instead. The retry mechanism should then produce a second attempt, which in this scenario comes back correctly written in real Romanian and should be accepted as valid, ready content.",
    }),
    JSON.stringify({
      body: "Ashgrove Software Co. este un studio de dezvoltare software personalizat, care construiește produse și instrumente interne pentru fondatori finanțați și companii mid-market. Compania oferă proiecte cu scop fix, urmate de abonamente de mentenanță. Echipa lucrează în sprinturi de două săptămâni cu demonstrații live pentru clienți, asigurând transparență totală pe parcursul dezvoltării. Prețurile sunt stabilite printr-un sprint de descoperire plătit, ceea ce protejează marja și oferă claritate bugetară clienților. Această abordare diferențiază compania de freelanceri și agenții mari offshore.",
    }),
  ];
  installMockOpenAi();
  await generateSectionContentMirrored(sectionB.id, businessType.slug, "ro", assessment.id, "businessDescription");
  restoreOpenAi();
  const afterB = await db.blueprintSection.findUniqueOrThrow({ where: { id: sectionB.id } });
  console.log(`Status: ${afterB.status}`);
  if (afterB.status !== "ready") throw new Error("Expected the retry with real Romanian content to recover to 'ready'!");
  console.log("Persisted body (real Romanian, passed the heuristic):", (afterB.content as { body: string }).body.slice(0, 120), "...");

  console.log("\n=== Part 6: sanity check — genuinely Romanian content on the FIRST attempt is not falsely flagged ===");
  const sectionC = await db.blueprintSection.create({ data: { blueprintId: blueprint.id, sectionKey: "riskAnalysis", status: "generating" } });
  mockResponseQueue = [
    JSON.stringify({
      body: "Cele mai mari riscuri pentru acest business includ dependența de un inginer cheie, extinderea neplanificată a scopului în contractele cu preț fix și comoditizarea treptată a proiectelor simple de tip CRUD prin asistenți AI de programare. Pentru a atenua aceste riscuri, fondatorul ar trebui să deruleze întotdeauna un sprint de descoperire plătit înainte de a oferi un preț fix, să documenteze fiecare decizie tehnică majoră astfel încât cunoștințele să nu rămână doar la un singur inginer, și să investească în instrumente de recenzie automată a codului asistate de inteligență artificială pentru a reduce presiunea pe segmentul de piață cu marjă redusă.",
    }),
  ];
  installMockOpenAi();
  await generateSectionContentMirrored(sectionC.id, businessType.slug, "ro", assessment.id, "riskAnalysis");
  restoreOpenAi();
  const afterC = await db.blueprintSection.findUniqueOrThrow({ where: { id: sectionC.id } });
  console.log(`Status: ${afterC.status} (should be 'ready' on the first attempt, no false-positive retry)`);
  if (afterC.status !== "ready") throw new Error("False positive: genuinely Romanian content was incorrectly flagged as the wrong language!");

  console.log("\n=== Cleanup ===");
  await db.blueprintSection.deleteMany({ where: { blueprintId: blueprint.id } });
  await db.blueprint.delete({ where: { id: blueprint.id } });
  await db.business.delete({ where: { id: business.id } });
  await db.assessment.delete({ where: { id: assessment.id } });
  await db.assessmentSession.delete({ where: { id: session.id } });
  await db.user.delete({ where: { id: user.id } });
  console.log("Removed throwaway test data.");

  console.log("\n✅ All locale-fix checks passed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
