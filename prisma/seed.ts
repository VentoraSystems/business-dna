import { PrismaClient } from "@prisma/client";
import { flattenedQuestions } from "../src/features/assessment/config/sections";

const db = new PrismaClient();

async function main() {
  console.log(`Seeding ${flattenedQuestions.length} assessment questions…`);

  for (const question of flattenedQuestions) {
    await db.assessmentQuestion.upsert({
      where: { key: question.key },
      update: {
        sectionKey: question.sectionKey,
        type: question.type,
        order: question.order,
        isRequired: question.isRequired ?? true,
      },
      create: {
        key: question.key,
        sectionKey: question.sectionKey,
        type: question.type,
        order: question.order,
        isRequired: question.isRequired ?? true,
      },
    });
  }

  console.log("Done.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
