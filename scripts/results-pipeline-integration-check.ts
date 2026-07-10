/**
 * Phase 3 verification script — not a test, not part of the app. Exercises
 * the real completeAssessmentSession() -> Matching Engine -> persistence ->
 * getAssessmentResults() flow against the real seeded Postgres catalog,
 * using the same exported pieces those two server actions call
 * (`fetchRawAnswersForMatching`, `createMatchingEngine`,
 * `businessMatchRepository`) since the actions themselves are gated behind
 * Clerk auth (`requireCurrentUser()`), which has no meaning outside a real
 * request. A throwaway User/AssessmentSession/Assessment are created
 * directly via Prisma to stand in for what a real signed-in flow would
 * produce. Run with `npm run results-pipeline:check`.
 */
import { randomUUID } from "node:crypto";
import { db } from "../src/lib/db";
import { flattenedQuestions } from "../src/features/assessment/config/sections";
import { fetchRawAnswersForMatching } from "../src/features/assessment/actions/fetch-raw-answers";
import { createMatchingEngine } from "../src/features/matching-engine/services/matching-engine";
import { businessMatchRepository } from "../src/features/business-engine/repositories";
import { readBusinessDisplayContent } from "../src/features/business-engine/utils/business-display-content";
import { STRENGTH_THRESHOLD, WEAKNESS_THRESHOLD } from "../src/features/matching-engine/services/matching-engine";
import { matchResultWithBusinessTypeInclude } from "../src/features/business-engine/types/matching";

const stubExplanationGenerator = {
  explainMatch: async () => "",
  explainStrengths: async () => "",
  explainWeaknesses: async () => "",
  suggestImprovements: async () => "",
  summarizeBusiness: async () => "",
};

const SAMPLE_ANSWERS: Record<string, unknown> = {
  age: "27",
  country: "Romania",
  employment: "employed",
  weeklyAvailability: 30,
  incomeUrgency: "moderate",
  budget: 8_000,
  targetMonthlyIncome: 6_000,
  desiredTimeline: "sixMonths",
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
  riskTolerance: 85,
  failureTolerance: 4,
  investmentConfidence: 4,
  industries: ["tech"],
  businessModels: ["saas", "service"],
  topics: "AI tooling",
  neverDo: "cold calling",
  fiveYearVision: "Run a small, profitable software studio.",
  definitionOfSuccess: "Financial independence.",
};

async function main() {
  console.log("=== Step 1: create a throwaway User + completed AssessmentSession/Assessment ===");
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
    await db.assessmentAnswer.create({
      data: { sessionId: session.id, questionId: dbQuestion.id, value: value as never },
    });
  }

  const assessment = await db.assessment.create({
    data: { userId: user.id, sessionId: session.id, locale: "en" },
  });
  console.log(`Created assessment ${assessment.id} for user ${user.id}`);

  console.log("\n=== Step 2: run the Matching Engine (same call completeAssessmentSession() makes) ===");
  const engine = createMatchingEngine({
    fetchRawAnswers: fetchRawAnswersForMatching,
    explanationGenerator: stubExplanationGenerator,
  });
  const results = await engine.run({ assessmentId: assessment.id, userId: user.id, locale: "en" });
  console.log(`Matching engine returned ${results.length} ranked results.`);

  console.log("\n=== Step 3: persist via businessMatchRepository.create() ===");
  await Promise.all(
    results.map((result) =>
      businessMatchRepository.create({
        userId: user.id,
        assessmentId: assessment.id,
        businessTypeId: result.businessTypeId,
        compatibilityScore: result.overallScore,
        scoreBreakdown: result.dimensionScores.map((score) => ({
          questionKey: score.dimension,
          contribution: score.rawValue,
          label: score.dimension,
        })),
      })
    )
  );
  const persistedCount = await db.businessMatchResult.count({ where: { assessmentId: assessment.id } });
  console.log(`Persisted ${persistedCount} BusinessMatchResult rows.`);

  console.log("\n=== Step 4: read path (same logic getAssessmentResults() uses) ===");
  const persisted = await db.businessMatchResult.findMany({
    where: { assessmentId: assessment.id },
    include: matchResultWithBusinessTypeInclude,
    orderBy: { compatibilityScore: "desc" },
  });
  const topMatch = persisted[0]!;
  const breakdown = topMatch.scoreBreakdown as { questionKey: string; contribution: number }[];
  const strengths = breakdown.filter((e) => e.contribution >= STRENGTH_THRESHOLD).map((e) => e.questionKey);
  const weaknesses = breakdown.filter((e) => e.contribution <= WEAKNESS_THRESHOLD).map((e) => e.questionKey);

  console.log(`\nTop match: ${topMatch.businessType.slug} (score ${topMatch.compatibilityScore.toFixed(1)})`);
  console.log(`Strengths: [${strengths.join(", ")}]`);
  console.log(`Weaknesses: [${weaknesses.join(", ")}]`);

  console.log("\n=== What the results page would show (top 6 opportunities) ===");
  for (const result of persisted.slice(0, 6)) {
    const content = readBusinessDisplayContent(result.businessType.slug, "en");
    console.log(
      `  ${result.businessType.slug.padEnd(32)} score=${result.compatibilityScore.toFixed(1).padStart(5)}  "${content.name}" — ${content.tagline}`
    );
  }

  console.log("\n=== Cleanup ===");
  await db.businessMatchResult.deleteMany({ where: { assessmentId: assessment.id } });
  await db.assessment.delete({ where: { id: assessment.id } });
  await db.assessmentAnswer.deleteMany({ where: { sessionId: session.id } });
  await db.assessmentSession.delete({ where: { id: session.id } });
  await db.user.delete({ where: { id: user.id } });
  console.log("Removed throwaway test data.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
