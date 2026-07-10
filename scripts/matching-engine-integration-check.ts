/**
 * Phase 2 verification script — not a test, not part of the app. Runs
 * `DefaultMatchingEngine.run()` end to end against the real seeded
 * Postgres catalog (21 BusinessType rows from Phase 1's
 * prisma/seed-business-engine.ts), using two contrasting sample answer
 * sets, and prints the top-ranked results for each. Proves the pipeline
 * actually discriminates between candidates given different inputs —
 * something a unit test with 2 fake candidates can't demonstrate as
 * convincingly. Run with `npx tsx scripts/matching-engine-integration-check.ts`.
 *
 * `explanationGenerator` is overridden with a trivial stub purely so
 * `run()` can reach the end of the pipeline — ExplanationGenerator itself
 * stays an unimplemented placeholder (AI Explanation is out of scope for
 * this phase); this script does not implement it, it works around it.
 */
import { createMatchingEngine } from "../src/features/matching-engine/services/matching-engine";
import type { RawAssessmentAnswers } from "../src/features/matching-engine/types/assessment-input";
import { db } from "../src/lib/db";

const stubExplanationGenerator = {
  explainMatch: async () => "(explanation generation is out of scope for this phase — see ExplanationGenerator)",
  explainStrengths: async () => "",
  explainWeaknesses: async () => "",
  suggestImprovements: async () => "",
  summarizeBusiness: async () => "",
};

/** Technical, low-budget, high-risk-tolerance, remote-first, solo-leaning founder. */
const TECHNICAL_SOLO_BUILDER: RawAssessmentAnswers["answers"] = {
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
  topics: "AI tooling, developer productivity",
  neverDo: "cold calling all day",
  fiveYearVision: "Run a small, profitable software studio.",
  definitionOfSuccess: "Financial independence without a big team to manage.",
};

/** Relationship-driven, higher-budget, risk-averse, in-person, team-oriented founder. */
const RELATIONSHIP_DRIVEN_OPERATOR: RawAssessmentAnswers["answers"] = {
  age: "41",
  country: "Romania",
  employment: "selfEmployed",
  weeklyAvailability: 50,
  incomeUrgency: "low",
  budget: 35_000,
  targetMonthlyIncome: 12_000,
  desiredTimeline: "twoYearsPlus",
  decisionMaking: "collaborative",
  motivation: "impact",
  sellingPreference: 5,
  leadership: 5,
  problemSolving: 3,
  creativity: 2,
  structureVsFlexibility: 25,
  marketing: 3,
  sales: 5,
  programming: 1,
  ai: 1,
  finance: 4,
  management: 5,
  design: 2,
  content: 3,
  negotiation: 5,
  communication: 5,
  remote: "inPerson",
  travel: "occasional",
  employees: "largeTeam",
  freedom: 2,
  workingHours: 50,
  b2bVsB2c: "b2b",
  onlineVsOffline: "offline",
  riskTolerance: 20,
  failureTolerance: 2,
  investmentConfidence: 5,
  industries: ["finance", "professionalServices"],
  businessModels: ["service", "agency"],
  topics: "client relationships, advisory work",
  neverDo: "write code",
  fiveYearVision: "Build a respected advisory practice with a real team.",
  definitionOfSuccess: "A firm that runs without me in every meeting.",
};

async function runPersona(label: string, answers: RawAssessmentAnswers["answers"]) {
  const engine = createMatchingEngine({
    fetchRawAnswers: async (assessmentId) => ({ assessmentId, userId: "u_demo", locale: "en", answers }),
    explanationGenerator: stubExplanationGenerator,
  });

  const results = await engine.run({ assessmentId: `demo-${label}`, userId: "u_demo", locale: "en" });

  const businessTypeIds = results.map((r) => r.businessTypeId);
  const businessTypes = await db.businessType.findMany({
    where: { id: { in: businessTypeIds } },
    select: { id: true, slug: true },
  });
  const slugById = new Map(businessTypes.map((b) => [b.id, b.slug]));

  console.log(`\n=== ${label} — top ${results.length} matches ===`);
  for (const result of results) {
    const slug = slugById.get(result.businessTypeId) ?? result.businessTypeId;
    console.log(
      `  ${String(results.indexOf(result) + 1).padStart(2)}. ${slug.padEnd(32)} overallScore=${result.overallScore.toFixed(1).padStart(5)}  confidence=${result.confidenceScore.toFixed(2)}  dims=${result.dimensionScores.length}  strengths=[${result.strengths.join(", ")}]`
    );
  }
}

async function main() {
  const candidateCount = await db.businessType.count({ where: { isPublished: true } });
  console.log(`Published BusinessType rows available for matching: ${candidateCount}`);
  if (candidateCount === 0) {
    throw new Error("No published BusinessType rows — run `npm run db:seed:business-engine` first.");
  }

  await runPersona("technical-solo-builder", TECHNICAL_SOLO_BUILDER);
  await runPersona("relationship-driven-operator", RELATIONSHIP_DRIVEN_OPERATOR);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
