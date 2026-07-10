import { db } from "@/lib/db";
import type { RawAssessmentAnswers } from "@/features/matching-engine/types/assessment-input";

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
 *
 * Kept in its own module, separate from assessment-actions.ts (which
 * imports `revalidatePath` from `next/cache`) — that import pulls in
 * Next.js's React-server-components runtime, which only resolves inside
 * Next's real build/dev server, not a plain Node/tsx script. Splitting
 * this out lets scripts/results-pipeline-integration-check.ts (and any
 * future non-Next caller) import just the Prisma-only logic here.
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
