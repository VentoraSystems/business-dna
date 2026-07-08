import { PrismaClient } from "@prisma/client";

/**
 * This seed is intentionally empty. It exists to show *where* Business
 * Engine catalog data will be loaded from once the catalog content itself
 * is written — each function below is a placeholder for one master lookup
 * list or the BusinessType catalog itself. Run it with
 * `npm run db:seed:business-engine`; right now it's a no-op.
 *
 * Fill these in in this order (later ones depend on earlier ones existing):
 *   1. seedIndustries      → BusinessIndustry
 *   2. seedCategories      → BusinessCategory (needs an industry per row)
 *   3. seedRequiredSkills  → RequiredSkill
 *   4. seedTags            → BusinessTag
 *   5. seedTools           → BusinessTool
 *   6. seedResources       → BusinessResource
 *   7. seedBusinessTypes   → BusinessType + its 1:1 attributes, skills,
 *                            tags, tools, resources, requirements,
 *                            advantages, disadvantages, and the four
 *                            generation templates.
 *
 * Deliberately not implemented here: BusinessQuestionWeight and
 * BusinessMatchResult rows. Those belong to the matching engine's own
 * seed/migration once it's designed, not to the catalog seed.
 */

const db = new PrismaClient();

async function seedIndustries() {
  // const industries: Prisma.BusinessIndustryCreateInput[] = [];
  // for (const industry of industries) {
  //   await db.businessIndustry.upsert({
  //     where: { code: industry.code },
  //     update: industry,
  //     create: industry,
  //   });
  // }
}

async function seedCategories() {
  // Requires industries to exist first (categories reference industryId).
}

async function seedRequiredSkills() {
  // Should mirror src/features/assessment/config/sections.ts → skills
  // section question keys, so the matching engine can compare directly.
}

async function seedTags() {}

async function seedTools() {}

async function seedResources() {}

async function seedBusinessTypes() {
  // The actual catalog. Left empty on purpose — see README.md →
  // "Populating the catalog" for how this should be authored (content
  // review process, translation requirements, etc.) once product content
  // is ready.
}

async function main() {
  await seedIndustries();
  await seedCategories();
  await seedRequiredSkills();
  await seedTags();
  await seedTools();
  await seedResources();
  await seedBusinessTypes();

  console.log("Business Engine seed ran — no rows were created (structure only).");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
