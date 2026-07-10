"use server";

import { cache } from "react";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireCurrentUser } from "@/lib/auth";
import type { Locale } from "@/i18n/config";
import type { AnswersState } from "../types";
import { createMatchingEngine } from "@/features/matching-engine/services/matching-engine";
import type { ExplanationGenerator } from "@/features/matching-engine/services/explanation-generator";
import { businessMatchRepository } from "@/features/business-engine/repositories";
import { fetchRawAnswersForMatching } from "./fetch-raw-answers";

/**
 * The question bank rarely changes at runtime, so memoize the key → id
 * lookup for the lifetime of a single request instead of re-querying it on
 * every answer save.
 */
const getQuestionByKey = cache(async (key: string) => {
  const question = await db.assessmentQuestion.findUnique({ where: { key } });
  if (!question) {
    throw new Error(
      `Unknown assessment question key "${key}" — run "npm run db:seed" after editing the question bank.`
    );
  }
  return question;
});

export interface SessionWithAnswers {
  id: string;
  status: "in_progress" | "completed" | "abandoned";
  currentStep: number;
  locale: Locale;
  answers: AnswersState;
}

/**
 * Resume the user's most recent in-progress session, or start a new one.
 * This is what makes "leave and continue later" possible: the assessment
 * page always calls this first, server-side, before rendering anything.
 */
export async function getOrCreateActiveSession(locale: Locale): Promise<SessionWithAnswers> {
  const user = await requireCurrentUser();

  const existing = await db.assessmentSession.findFirst({
    where: { userId: user.id, status: "in_progress" },
    orderBy: { updatedAt: "desc" },
    include: { answers: { include: { question: true } } },
  });

  if (existing) {
    return toSessionWithAnswers(existing);
  }

  const created = await db.assessmentSession.create({
    data: { userId: user.id, locale },
    include: { answers: { include: { question: true } } },
  });

  return toSessionWithAnswers(created);
}

interface RawSessionWithAnswers {
  id: string;
  status: "in_progress" | "completed" | "abandoned";
  currentStep: number;
  locale: Locale;
  answers: { value: unknown; question: { key: string } }[];
}

function toSessionWithAnswers(session: RawSessionWithAnswers): SessionWithAnswers {
  const answers: AnswersState = {};
  for (const answer of session.answers) {
    answers[answer.question.key] = answer.value as AnswersState[string];
  }

  return {
    id: session.id,
    status: session.status,
    currentStep: session.currentStep,
    locale: session.locale,
    answers,
  };
}

/**
 * Autosave a single answer plus the user's current position in the flow.
 * Upserts on [sessionId, questionId] so re-answering never creates
 * duplicate rows.
 */
export async function saveAnswer(input: {
  sessionId: string;
  questionKey: string;
  value: AnswersState[string];
  currentStep: number;
}) {
  const user = await requireCurrentUser();
  const question = await getQuestionByKey(input.questionKey);

  const session = await db.assessmentSession.findUnique({ where: { id: input.sessionId } });
  if (!session || session.userId !== user.id) {
    throw new Error("Assessment session not found for this user.");
  }

  await db.$transaction([
    db.assessmentAnswer.upsert({
      where: { sessionId_questionId: { sessionId: input.sessionId, questionId: question.id } },
      update: { value: input.value as never },
      create: {
        sessionId: input.sessionId,
        questionId: question.id,
        value: input.value as never,
      },
    }),
    db.assessmentSession.update({
      where: { id: input.sessionId },
      data: { currentStep: input.currentStep },
    }),
  ]);

  return { success: true as const };
}

/** Update only the current step, e.g. when the user navigates back. */
export async function updateSessionStep(sessionId: string, currentStep: number) {
  const user = await requireCurrentUser();
  const session = await db.assessmentSession.findUnique({ where: { id: sessionId } });
  if (!session || session.userId !== user.id) {
    throw new Error("Assessment session not found for this user.");
  }

  await db.assessmentSession.update({ where: { id: sessionId }, data: { currentStep } });
  return { success: true as const };
}

/**
 * Stands in for `ExplanationGenerator` purely so `DefaultMatchingEngine.run()`
 * can reach its final "Business Match Results" stage — that service is a
 * throwing placeholder by design (AI Explanation is out of scope for this
 * phase, see matching-engine/README.md), and this results page is built to
 * work entirely off `CompatibilityResult`'s raw scores/strengths/weaknesses
 * without any AI-generated prose, so an empty string here is never rendered.
 * Not a real implementation of that service — just an override, the same
 * pattern `createMatchingEngine(overrides)` is designed for.
 */
const NO_OP_EXPLANATION_GENERATOR: ExplanationGenerator = {
  explainMatch: async () => "",
  explainStrengths: async () => "",
  explainWeaknesses: async () => "",
  suggestImprovements: async () => "",
  summarizeBusiness: async () => "",
};

/**
 * Runs the Matching Engine for a just-completed Assessment and persists
 * every ranked result as a `BusinessMatchResult` row. Best-effort: a
 * matching failure (or zero candidates) is logged, not thrown — assessment
 * completion itself must succeed regardless of whether matching does, so a
 * user is never stuck mid-flow because of a downstream scoring bug. The
 * results page (see results-actions.ts) handles an assessment with no
 * persisted matches as its own explicit empty state, not a crash.
 *
 * `scoreBreakdown`'s `contribution` field stores each dimension's raw 0-1
 * alignment (`DimensionScore.rawValue`), not its weighted contribution to
 * the overall score (`weightedValue`) — that's what the results page needs
 * to recompute strengths/weaknesses and populate per-dimension displays;
 * under Phase 2's uniform weighting the two are numerically identical
 * today, but `rawValue` is the one that stays meaningful if a future phase
 * assigns real per-dimension weights.
 */
async function runMatchingForAssessment(assessmentId: string, userId: string, locale: Locale): Promise<void> {
  try {
    const engine = createMatchingEngine({
      fetchRawAnswers: fetchRawAnswersForMatching,
      explanationGenerator: NO_OP_EXPLANATION_GENERATOR,
    });
    const results = await engine.run({ assessmentId, userId, locale });

    if (results.length === 0) {
      console.error(`[assessment] Matching produced zero candidates for assessment "${assessmentId}".`);
      return;
    }

    await Promise.all(
      results.map((result) =>
        businessMatchRepository.create({
          userId,
          assessmentId,
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
  } catch (error) {
    console.error(`[assessment] Matching engine failed for assessment "${assessmentId}":`, error);
  }
}

/**
 * Mark the session complete, create the Assessment record, and run the
 * Matching Engine against it. `archetype` is left null — populating it
 * would require the 14-dimension -> 7-key Entrepreneur DNA Match mapping,
 * which is explicitly not decided (see matching-engine README's Phase 3
 * notes and features/assessment/components/results/README-equivalent
 * comments on deriveOverarchingArchetype()) — flagged, not guessed.
 */
export async function completeAssessmentSession(sessionId: string) {
  const user = await requireCurrentUser();
  const session = await db.assessmentSession.findUnique({ where: { id: sessionId } });
  if (!session || session.userId !== user.id) {
    throw new Error("Assessment session not found for this user.");
  }

  const assessment = await db.$transaction(async (tx) => {
    await tx.assessmentSession.update({
      where: { id: sessionId },
      data: { status: "completed", completedAt: new Date() },
    });

    await tx.user.update({
      where: { id: user.id },
      data: { onboardingCompletedAt: new Date() },
    });

    return tx.assessment.create({
      data: {
        userId: user.id,
        sessionId,
        locale: session.locale,
      },
    });
  });

  await runMatchingForAssessment(assessment.id, user.id, session.locale);

  revalidatePath("/businesses");
  return { assessmentId: assessment.id };
}
