"use server";

import { cache } from "react";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireCurrentUser } from "@/lib/auth";
import type { Locale } from "@/i18n/config";
import type { AnswersState } from "../types";
import type { RawAssessmentAnswers } from "@/features/matching-engine/types/assessment-input";

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
 * Mark the session complete and create the Assessment record. `archetype`
 * is left null — that's the not-yet-built matching engine's job.
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

  revalidatePath("/businesses");
  return { assessmentId: assessment.id };
}

/**
 * The `fetchRawAnswers` adapter `createMatchingEngine()` expects (see
 * `features/matching-engine`'s README — "whoever wires up a real
 * `fetchRawAnswers`... is expected to adapt one to the other"). Reads a
 * completed `Assessment`'s session answers and reshapes them from this
 * feature's own `AnswersState`/`SessionWithAnswers` into matching-engine's
 * deliberately independent `RawAssessmentAnswers` shape — mechanical field
 * renaming/wrapping, no scoring logic. Lives here (assessment ->
 * matching-engine), not in matching-engine itself, so that feature never
 * takes on a dependency on this one's Prisma models.
 */
export async function fetchRawAnswersForMatching(assessmentId: string): Promise<RawAssessmentAnswers> {
  const assessment = await db.assessment.findUniqueOrThrow({
    where: { id: assessmentId },
    include: { session: { include: { answers: { include: { question: true } } } } },
  });

  const answers: Record<string, unknown> = {};
  for (const answer of assessment.session.answers) {
    answers[answer.question.key] = answer.value;
  }

  return {
    assessmentId: assessment.id,
    userId: assessment.userId,
    locale: assessment.locale,
    answers,
  };
}
