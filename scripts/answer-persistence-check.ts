/**
 * Issue 1 investigation script — replicates saveAnswer() and
 * getOrCreateActiveSession()'s exact Prisma logic (bypassing Clerk auth,
 * same technique as the other scripts/*-check.ts files) to verify: does an
 * answer written via saveAnswer()'s logic actually come back correctly via
 * getOrCreateActiveSession()'s logic, on a fresh "request"? This isolates
 * the backend persistence/read-back path from any client-side/router
 * caching behavior. Run with `npx tsx scripts/answer-persistence-check.ts`
 * (no react-server condition needed — nothing here touches "server-only").
 */
import { randomUUID } from "node:crypto";
import { db } from "../src/lib/db";

async function main() {
  console.log("=== Create a throwaway User + in-progress AssessmentSession ===");
  const user = await db.user.create({
    data: { clerkId: `test_${randomUUID()}`, email: `test-${randomUUID()}@example.com`, locale: "en" },
  });
  const session = await db.assessmentSession.create({ data: { userId: user.id, locale: "en" } });
  console.log(`session=${session.id} status=${session.status} currentStep=${session.currentStep}`);

  console.log("\n=== Simulate saveAnswer() for 'budget' = 8000, currentStep = 5 ===");
  const question = await db.assessmentQuestion.findUniqueOrThrow({ where: { key: "budget" } });
  await db.$transaction([
    db.assessmentAnswer.upsert({
      where: { sessionId_questionId: { sessionId: session.id, questionId: question.id } },
      update: { value: 8000 },
      create: { sessionId: session.id, questionId: question.id, value: 8000 },
    }),
    db.assessmentSession.update({ where: { id: session.id }, data: { currentStep: 5 } }),
  ]);
  console.log("Saved.");

  console.log("\n=== Simulate a second answer, 'remote' = 'hybrid', currentStep = 6 ===");
  const question2 = await db.assessmentQuestion.findUniqueOrThrow({ where: { key: "remote" } });
  await db.$transaction([
    db.assessmentAnswer.upsert({
      where: { sessionId_questionId: { sessionId: session.id, questionId: question2.id } },
      update: { value: "hybrid" },
      create: { sessionId: session.id, questionId: question2.id, value: "hybrid" },
    }),
    db.assessmentSession.update({ where: { id: session.id }, data: { currentStep: 6 } }),
  ]);
  console.log("Saved.");

  console.log("\n=== Simulate a brand-new getOrCreateActiveSession() call (fresh 'request') ===");
  const existing = await db.assessmentSession.findFirst({
    where: { userId: user.id, status: "in_progress" },
    orderBy: { updatedAt: "desc" },
    include: { answers: { include: { question: true } } },
  });

  if (!existing) throw new Error("FAIL: no in-progress session found — session lookup itself is broken.");

  const answers: Record<string, unknown> = {};
  for (const a of existing.answers) answers[a.question.key] = a.value;

  console.log(`Resolved session id: ${existing.id} (matches original: ${existing.id === session.id})`);
  console.log(`currentStep: ${existing.currentStep} (expected 6)`);
  console.log(`answers:`, answers);

  const budgetOk = answers.budget === 8000;
  const remoteOk = answers.remote === "hybrid";
  const stepOk = existing.currentStep === 6;

  console.log(`\nbudget round-tripped correctly: ${budgetOk}`);
  console.log(`remote round-tripped correctly: ${remoteOk}`);
  console.log(`currentStep round-tripped correctly (last write wins race check): ${stepOk}`);

  console.log("\n=== Cleanup ===");
  await db.assessmentAnswer.deleteMany({ where: { sessionId: session.id } });
  await db.assessmentSession.delete({ where: { id: session.id } });
  await db.user.delete({ where: { id: user.id } });
  console.log("Removed throwaway test data.");

  if (!budgetOk || !remoteOk || !stepOk) {
    console.error("\n*** BACKEND ROUND-TRIP FAILED ***");
    process.exitCode = 1;
  } else {
    console.log("\n*** BACKEND ROUND-TRIP OK — persistence + read-back logic is correct. ***");
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
