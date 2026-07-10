"use server";

import { db } from "@/lib/db";
import { requireCurrentUser } from "@/lib/auth";
import { businessMatchRepository } from "@/features/business-engine/repositories";
import { readBusinessDisplayContent } from "@/features/business-engine/utils/business-display-content";
import { MatchingDimension } from "@/features/matching-engine/scoring/dimensions";
import { STRENGTH_THRESHOLD, WEAKNESS_THRESHOLD } from "@/features/matching-engine/services/matching-engine";
import { normalizeToUnitRange } from "@/features/matching-engine/utils/normalization-math";
import { totalQuestionCount } from "../config/sections";
import { fetchRawAnswersForMatching } from "./fetch-raw-answers";

/**
 * Real read path for the Assessment results page (Phase 3) — reads what
 * `completeAssessmentSession()` persisted via `businessMatchRepository`,
 * plus each matched BusinessType's real name/tagline/description via
 * `readBusinessDisplayContent()` (Phase 1 never seeded display copy into
 * Prisma — only structured attributes).
 */

/** DifficultyLevel/ScalabilityLevel in results/config.ts use "medium"; Prisma's BusinessDifficulty/ScalabilityLevel enums use "moderate" — reconciled here, not by renaming either vocabulary. */
function toUiLevel(prismaLevel: "low" | "moderate" | "high"): "low" | "medium" | "high" {
  return prismaLevel === "moderate" ? "medium" : prismaLevel;
}

export interface ResultsOpportunity {
  businessTypeId: string;
  slug: string;
  name: string;
  description: string;
  compatibility: number;
  difficulty: "low" | "medium" | "high";
  scalability: "low" | "medium" | "high";
  revenueSpeed: "slow" | "moderate" | "fast";
  budgetMin: number;
  budgetMax: number;
  monthlyRevenueMin: number;
  monthlyRevenueMax: number;
}

export interface WorkStyleScore {
  key: MatchingDimension.Risk | MatchingDimension.Leadership | MatchingDimension.CommunicationStyle | MatchingDimension.TechnicalAbility | MatchingDimension.Creativity | "timeAvailability";
  score: number;
}

export interface AssessmentResultsData {
  overallScore: number;
  confidenceScore: number;
  strengths: MatchingDimension[];
  weaknesses: MatchingDimension[];
  workStyle: WorkStyleScore[];
  /** Top N matched businesses, best-scoring first. Empty when matching produced no persisted results — see runMatchingForAssessment(). */
  opportunities: ResultsOpportunity[];
}

/** How many of the persisted (up to 10) ranked matches the results page showcases — a display choice, not a scoring one. */
const OPPORTUNITIES_SHOWN = 6;

const WORK_STYLE_DIMENSIONS = [
  MatchingDimension.Risk,
  MatchingDimension.Leadership,
  MatchingDimension.CommunicationStyle,
  MatchingDimension.TechnicalAbility,
  MatchingDimension.Creativity,
] as const;

/** weeklyAvailability (aboutYou section, 1-60 slider) — a real, available signal Phase 2's 14-dimension mapping never uses (it uses `workingHours` for the `lifestyle` dimension instead). Used here only for WorkStyleCards' "timeAvailability" slot. */
const WEEKLY_AVAILABILITY_RANGE = { min: 1, max: 60 } as const;

/**
 * Fetches the persisted Matching Engine output for a completed Assessment,
 * verifying it belongs to the current user. Returns `null` if the
 * assessment doesn't exist for this user, or `{ ...opportunities: [] }` if
 * it exists but matching never produced any persisted results (logged as
 * an error at write time — see runMatchingForAssessment() in
 * assessment-actions.ts) — the results page renders an explicit empty
 * state for the latter, not a crash.
 */
export async function getAssessmentResults(assessmentId: string): Promise<AssessmentResultsData | null> {
  const user = await requireCurrentUser();

  const assessment = await db.assessment.findUnique({ where: { id: assessmentId } });
  if (!assessment || assessment.userId !== user.id) return null;

  const results = await businessMatchRepository.findByAssessmentId(assessmentId);

  if (results.length === 0) {
    return { overallScore: 0, confidenceScore: 0, strengths: [], weaknesses: [], workStyle: [], opportunities: [] };
  }

  const topMatch = results[0];
  if (!topMatch) {
    return { overallScore: 0, confidenceScore: 0, strengths: [], weaknesses: [], workStyle: [], opportunities: [] };
  }

  // scoreBreakdown was persisted as { questionKey: dimension, contribution: rawValue, label: dimension }[] —
  // see runMatchingForAssessment()'s doc comment for why `contribution` holds rawValue, not weightedValue.
  const breakdown = Array.isArray(topMatch.scoreBreakdown)
    ? (topMatch.scoreBreakdown as { questionKey: string; contribution: number }[])
    : [];

  const strengths: MatchingDimension[] = [];
  const weaknesses: MatchingDimension[] = [];
  const dimensionRawValue = new Map<string, number>();
  for (const entry of breakdown) {
    dimensionRawValue.set(entry.questionKey, entry.contribution);
    if (entry.contribution >= STRENGTH_THRESHOLD) strengths.push(entry.questionKey as MatchingDimension);
    else if (entry.contribution <= WEAKNESS_THRESHOLD) weaknesses.push(entry.questionKey as MatchingDimension);
  }

  const workStyle: WorkStyleScore[] = [];
  for (const dimension of WORK_STYLE_DIMENSIONS) {
    const rawValue = dimensionRawValue.get(dimension);
    if (rawValue !== undefined) workStyle.push({ key: dimension, score: Math.round(rawValue * 100) });
  }

  // Recompute confidenceScore + timeAvailability from the raw answers rather than persisting them —
  // both are cheaply derivable and BusinessMatchResult has no column for either (see results-actions.ts's
  // module docstring / the task's Prisma-schema-is-off-limits constraint).
  const rawAnswers = await fetchRawAnswersForMatching(assessmentId);
  const answeredQuestionCount = Object.values(rawAnswers.answers).filter((v) => v !== null && v !== undefined).length;
  const confidenceScore = totalQuestionCount > 0 ? answeredQuestionCount / totalQuestionCount : 0;

  const weeklyAvailability = rawAnswers.answers.weeklyAvailability;
  if (typeof weeklyAvailability === "number") {
    workStyle.push({
      key: "timeAvailability",
      score: Math.round(normalizeToUnitRange(weeklyAvailability, WEEKLY_AVAILABILITY_RANGE.min, WEEKLY_AVAILABILITY_RANGE.max) * 100),
    });
  }

  const opportunities: ResultsOpportunity[] = results
    .slice(0, OPPORTUNITIES_SHOWN)
    .filter((result) => result.businessType.budget && result.businessType.revenue)
    .map((result) => {
      const content = readBusinessDisplayContent(result.businessType.slug, assessment.locale);
      const budget = result.businessType.budget!;
      const revenue = result.businessType.revenue!;
      return {
        businessTypeId: result.businessTypeId,
        slug: result.businessType.slug,
        name: content.name,
        description: content.tagline || content.shortDescription,
        compatibility: Math.round(result.compatibilityScore),
        difficulty: toUiLevel(result.businessType.difficulty),
        scalability: toUiLevel(result.businessType.scalabilityLevel),
        revenueSpeed: revenue.revenueSpeed,
        budgetMin: budget.minInvestment,
        budgetMax: budget.maxInvestment,
        monthlyRevenueMin: revenue.targetMonthlyIncomeMin ?? 0,
        monthlyRevenueMax: revenue.targetMonthlyIncomeMax ?? 0,
      };
    });

  return {
    overallScore: Math.round(topMatch.compatibilityScore),
    confidenceScore,
    strengths,
    weaknesses,
    workStyle,
    opportunities,
  };
}
