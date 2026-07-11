/**
 * Issue 2 verification — runs the SAME low-budget persona through the real
 * seeded catalog twice in one process: once with the old uniform weighting
 * (all 14 dimensions = 1, passed explicitly as a `weightConfig` override so
 * this doesn't require reverting the code change) and once with the new
 * `DEFAULT_CONFIG` (budget = 5, everything else = 1), to produce a direct
 * before/after comparison. Run with
 * `NODE_OPTIONS=--conditions=react-server npx tsx scripts/budget-weight-before-after-check.ts`.
 */
import { createMatchingEngine } from "../src/features/matching-engine/services/matching-engine";
import { ALL_MATCHING_DIMENSIONS } from "../src/features/matching-engine/scoring/dimensions";
import { DEFAULT_CONFIG, type WeightConfig } from "../src/features/matching-engine/scoring/weight-config";
import type { RawAssessmentAnswers } from "../src/features/matching-engine/types/assessment-input";
import { db } from "../src/lib/db";

const stubExplanationGenerator = {
  explainMatch: async () => "",
  explainStrengths: async () => "",
  explainWeaknesses: async () => "",
  suggestImprovements: async () => "",
  summarizeBusiness: async () => "",
};

const OLD_UNIFORM_CONFIG: WeightConfig = {
  version: "v1-uniform (for comparison only)",
  weights: Object.fromEntries(ALL_MATCHING_DIMENSIONS.map((d) => [d, 1])),
};

/** Extreme low-budget persona, matching the reported bug: ~2k EUR budget, otherwise a reasonable generalist profile. */
const LOW_BUDGET_PERSONA: RawAssessmentAnswers["answers"] = {
  age: "24",
  country: "Romania",
  employment: "student",
  weeklyAvailability: 20,
  incomeUrgency: "high",
  budget: 2_000,
  targetMonthlyIncome: 2_000,
  desiredTimeline: "sixMonths",
  decisionMaking: "analytical",
  motivation: "freedom",
  sellingPreference: 3,
  leadership: 3,
  problemSolving: 3,
  creativity: 3,
  structureVsFlexibility: 50,
  marketing: 3,
  sales: 3,
  programming: 3,
  ai: 3,
  finance: 3,
  management: 3,
  design: 3,
  content: 3,
  negotiation: 3,
  communication: 3,
  remote: "remote",
  travel: "none",
  employees: "soloOnly",
  freedom: 4,
  workingHours: 30,
  b2bVsB2c: "b2b",
  onlineVsOffline: "online",
  riskTolerance: 60,
  failureTolerance: 3,
  investmentConfidence: 3,
  industries: ["tech"],
  businessModels: ["service", "saas"],
  topics: "",
  neverDo: "",
  fiveYearVision: "Start small and grow.",
  definitionOfSuccess: "Being profitable without a big loan.",
};

async function runWith(label: string, weightConfig: WeightConfig) {
  const engine = createMatchingEngine({
    fetchRawAnswers: async (assessmentId) => ({
      assessmentId,
      userId: "u_demo",
      locale: "en",
      answers: LOW_BUDGET_PERSONA,
    }),
    explanationGenerator: stubExplanationGenerator,
  });

  const results = await engine.run({ assessmentId: `demo-${label}`, userId: "u_demo", locale: "en", weightConfig });

  const businessTypes = await db.businessType.findMany({
    where: { id: { in: results.map((r) => r.businessTypeId) } },
    include: { budget: true },
  });
  const bySlug = new Map(businessTypes.map((b) => [b.id, b]));

  console.log(`\n=== ${label} — top 5 ===`);
  results.slice(0, 5).forEach((r, i) => {
    const bt = bySlug.get(r.businessTypeId);
    const budgetRange = bt?.budget ? `€${bt.budget.minInvestment.toLocaleString()}-€${bt.budget.maxInvestment.toLocaleString()}` : "?";
    console.log(`  ${i + 1}. ${(bt?.slug ?? r.businessTypeId).padEnd(32)} score=${r.overallScore.toFixed(1).padStart(5)}  budget=${budgetRange}`);
  });

  return results;
}

async function main() {
  const before = await runWith("BEFORE (uniform weights)", OLD_UNIFORM_CONFIG);
  const after = await runWith("AFTER (budget weighted 5x)", DEFAULT_CONFIG);

  console.log("\n=== Where did each of BEFORE's top 5 end up AFTER? ===");
  for (const r of before.slice(0, 5)) {
    const newRank = after.findIndex((a) => a.businessTypeId === r.businessTypeId);
    const bt = await db.businessType.findUnique({ where: { id: r.businessTypeId }, include: { budget: true } });
    console.log(
      `  ${(bt?.slug ?? r.businessTypeId).padEnd(32)} was rank ${before.indexOf(r) + 1} (score ${r.overallScore.toFixed(1)}) -> now rank ${newRank === -1 ? "not in top 10" : newRank + 1} ${newRank >= 0 ? `(score ${after[newRank]?.overallScore.toFixed(1)})` : ""}`
    );
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
