import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  PrismaClient,
  type IndustryType,
  type BusinessModelType,
  type BusinessDifficulty,
  type AutomationLevel,
  type ScalabilityLevel,
  type AIResistance,
  type RiskLevel,
  type RevenueSpeed,
  type LifestyleMode,
  type TravelRequirement,
  type OnlineOfflineMode,
  type SalesChannel,
} from "@prisma/client";

/**
 * Populates the Business Engine catalog from the 21 published packages
 * under business-library/technology/*. Read-only on business-library —
 * every write here targets Prisma. Run with
 * `npm run db:seed:business-engine`.
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
 *
 * Deliberately still empty in this pass: seedTags/seedTools/seedResources,
 * and BusinessType's requirements/advantages/disadvantages/four generation
 * templates. None of the 21 business-dna.json packages carry source data
 * for tags, tools, or learning resources in a shape this seed can read
 * without inventing content — see this file's own comments below for what
 * would be needed. BusinessSkill (the one many-to-many this pass DOES
 * populate) is scoped separately below.
 */

const db = new PrismaClient();

const BUSINESS_LIBRARY_DIR = path.join(__dirname, "..", "business-library");
const TECHNOLOGY_DIR = path.join(BUSINESS_LIBRARY_DIR, "technology");
const TAXONOMY_DIR = path.join(BUSINESS_LIBRARY_DIR, "taxonomy");
const MANIFEST_PATH = path.join(BUSINESS_LIBRARY_DIR, "manifest.json");

function readJson<T>(filePath: string): T {
  return JSON.parse(readFileSync(filePath, "utf-8")) as T;
}

/** "software-house" -> "softwareHouse", for translationKeySchema's dot-segment-alnum-only format (no hyphens allowed). */
function toCamelCase(slug: string): string {
  return slug
    .split("-")
    .map((part, i) => (i === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
    .join("");
}

interface TaxonomyLabel {
  en: string;
  ro: string;
}

interface TaxonomyEntry {
  key: string;
  label: TaxonomyLabel;
  industry?: string;
  businessModel?: string;
}

interface TaxonomyFile {
  domain: string;
  description: string;
  entries: TaxonomyEntry[];
}

interface ManifestPackageEntry {
  slug: string;
  path: string;
  status: string;
  canonical: boolean;
}

interface Manifest {
  schemaVersion: string;
  businessCount: number;
  packages: ManifestPackageEntry[];
}

interface PackageMetadata {
  slug: string;
  difficulty: BusinessDifficulty;
  industry: IndustryType;
  category: string;
  businessModel: BusinessModelType;
}

/** Mirrors business-library/schema.ts's levelDimensionSchema — { level, notes? }. */
interface LevelDimension<TLevel extends string> {
  level: TLevel;
}

interface BusinessDnaSkillHint {
  key: string;
  importance: number;
}

interface BusinessDnaProfileForSeeding {
  financialDna: {
    budget: {
      minInvestment: number;
      maxInvestment: number;
      currency: string;
      ongoingMonthlyCostMin?: number;
      ongoingMonthlyCostMax?: number;
    };
    financialInformation: {
      targetMonthlyIncomeMin?: number;
      targetMonthlyIncomeMax?: number;
      breakEvenTimelineMonths?: number;
    };
  };
  revenueDna: {
    revenueSpeed: LevelDimension<RevenueSpeed>;
  };
  lifestyleDna: {
    workMode: LifestyleMode;
    travelRequirement: TravelRequirement;
    onlineOffline: OnlineOfflineMode;
    salesChannel: SalesChannel;
    minWeeklyHours?: number;
    maxWeeklyHours?: number;
    freedomLevel?: number;
  };
  riskDna: {
    difficulty: LevelDimension<BusinessDifficulty>;
    aiResistance: LevelDimension<AIResistance>;
  };
  scalabilityDna: {
    scalability: LevelDimension<ScalabilityLevel>;
  };
  operationsDna: {
    automation: LevelDimension<AutomationLevel>;
  };
  businessCharacteristics: {
    isSoloFounderFriendly: boolean;
  };
  aiMetadata: {
    matchingHints: {
      requiredSkills?: BusinessDnaSkillHint[];
      preferredSkills?: BusinessDnaSkillHint[];
      riskProfile?: RiskLevel;
    };
  };
}

function readPackage(slug: string): { metadata: PackageMetadata; dna: BusinessDnaProfileForSeeding } {
  const dir = path.join(TECHNOLOGY_DIR, slug);
  const metadata = readJson<PackageMetadata>(path.join(dir, "metadata.json"));
  const dna = readJson<BusinessDnaProfileForSeeding>(path.join(dir, "business-dna.json"));
  return { metadata, dna };
}

async function seedIndustries() {
  const { entries } = readJson<TaxonomyFile>(path.join(TAXONOMY_DIR, "industries.json"));

  for (const [index, industry] of entries.entries()) {
    const code = industry.key as IndustryType;
    const translationKey = `businessIndustries.${toCamelCase(industry.key)}`;
    await db.businessIndustry.upsert({
      where: { code },
      update: { slug: industry.key, translationKey, sortOrder: index },
      create: { code, slug: industry.key, translationKey, sortOrder: index },
    });
  }
}

async function seedCategories() {
  const { entries } = readJson<TaxonomyFile>(path.join(TAXONOMY_DIR, "categories.json"));
  const manifest = readJson<Manifest>(MANIFEST_PATH);
  const publishedSlugs = manifest.packages.filter((p) => p.status === "published").map((p) => p.slug);

  // Judgment call: business-library/taxonomy/categories.json leaves
  // `industry` unset for exactly one entry ("ecommerce" — see
  // Knowledge Authoring Batch 3). BusinessCategory.industryId is a
  // required FK, and a category maps to exactly one industry in this
  // schema (unlike a BusinessType, which can only ever declare one
  // industry via its own metadata.json too), so an industry-less
  // category can't be seeded as-is. Falling back to whichever industry
  // the one published business referencing that category declares in
  // its own metadata.json ("ecommerce-brand" -> "fashion") — this only
  // works because exactly one business currently uses that category; if
  // a future business under the same category disagreed on industry,
  // this would need a real decision, not a silent default, so it throws
  // instead of guessing when that's the case.
  const categoryIndustryFallback = new Map<string, string>();
  for (const slug of publishedSlugs) {
    const { metadata } = readPackage(slug);
    const existing = categoryIndustryFallback.get(metadata.category);
    if (existing && existing !== metadata.industry) {
      throw new Error(
        `Category "${metadata.category}" is referenced by businesses in two different industries ("${existing}" and "${metadata.industry}") and has no explicit industry in categories.json — cannot infer a fallback.`
      );
    }
    categoryIndustryFallback.set(metadata.category, metadata.industry);
  }

  for (const [index, category] of entries.entries()) {
    const industryCode = category.industry ?? categoryIndustryFallback.get(category.key);
    if (!industryCode) {
      throw new Error(
        `Category "${category.key}" has no industry in categories.json and no published business references it to infer one from.`
      );
    }

    const industry = await db.businessIndustry.findUniqueOrThrow({
      where: { code: industryCode as IndustryType },
    });

    const translationKey = `businessCategories.${toCamelCase(category.key)}`;
    await db.businessCategory.upsert({
      where: { slug: category.key },
      update: { translationKey, industryId: industry.id, sortOrder: index },
      create: { slug: category.key, translationKey, industryId: industry.id, sortOrder: index },
    });
  }
}

async function seedRequiredSkills() {
  const { entries } = readJson<TaxonomyFile>(path.join(TAXONOMY_DIR, "skills.json"));

  for (const skill of entries) {
    const translationKey = `businessSkills.${toCamelCase(skill.key)}`;
    await db.requiredSkill.upsert({
      where: { key: skill.key },
      update: { translationKey },
      create: { key: skill.key, translationKey },
    });
  }
}

async function seedTags() {
  // No tag content exists in any of the 21 business-dna.json/metadata.json
  // packages (business-library has no "tags" concept at all — see its own
  // schema.ts). Left empty on purpose; populating BusinessTag is a future
  // content-authoring task, not something inferable from current package
  // data without inventing values.
}

async function seedTools() {
  // technologyDna.recommendedTools exists per package, but BusinessTool is
  // a shared master list keyed by slug+websiteUrl, and recommendedTools
  // entries are free-text names ("Notion", "Linear", etc.) with no slug or
  // canonical identity assigned — deduplicating/slugifying 21 packages'
  // worth of free-text tool names into a clean master list is a real
  // content-curation decision, left for a future pass rather than guessed
  // here.
}

async function seedResources() {
  // Section 18 (Resources) in business-dna.json is a wrapper around
  // features/resources' category vocabulary, not business-engine's
  // BusinessResource master list — the two are a documented, deliberate
  // non-unification (see features/business-dna/README.md, row 18). Left
  // empty rather than force a mapping between two intentionally separate
  // vocabularies.
}

async function seedBusinessTypes() {
  const manifest = readJson<Manifest>(MANIFEST_PATH);
  const published = manifest.packages.filter((p) => p.status === "published");

  console.log(`Seeding ${published.length} BusinessType rows…`);

  for (const pkg of published) {
    const { metadata, dna } = readPackage(pkg.slug);

    const category = await db.businessCategory.findUniqueOrThrow({
      where: { slug: metadata.category },
    });

    const businessType = await db.businessType.upsert({
      where: { slug: metadata.slug },
      update: {
        categoryId: category.id,
        businessModel: metadata.businessModel,
        difficulty: metadata.difficulty,
        automationLevel: dna.operationsDna.automation.level,
        scalabilityLevel: dna.scalabilityDna.scalability.level,
        aiResistance: dna.riskDna.aiResistance.level,
        isPublished: true,
      },
      create: {
        slug: metadata.slug,
        translationKey: `businessTypes.${toCamelCase(metadata.slug)}`,
        categoryId: category.id,
        businessModel: metadata.businessModel,
        difficulty: metadata.difficulty,
        automationLevel: dna.operationsDna.automation.level,
        scalabilityLevel: dna.scalabilityDna.scalability.level,
        aiResistance: dna.riskDna.aiResistance.level,
        isPublished: true,
      },
    });

    // --- BusinessLifestyle -------------------------------------------
    // teamSize has no direct business-dna.json field (LifestyleDna is a
    // full reuse of business-library's lifestyle §21, which never carried
    // teamSize — that's genome §22, not part of LifestyleDna). The closest
    // available signal is businessCharacteristics.isSoloFounderFriendly, a
    // boolean, which can only distinguish "solo" from "not solo" — not
    // "small" vs. "large" team. Judgment call: map true -> solo, false ->
    // small (never large — no package's data distinguishes a "large team"
    // business from a "small team" one).
    await db.businessLifestyle.upsert({
      where: { businessTypeId: businessType.id },
      update: {
        workMode: dna.lifestyleDna.workMode,
        travelRequirement: dna.lifestyleDna.travelRequirement,
        teamSize: dna.businessCharacteristics.isSoloFounderFriendly ? "solo" : "small",
        salesChannel: dna.lifestyleDna.salesChannel,
        onlineOffline: dna.lifestyleDna.onlineOffline,
        minWeeklyHours: dna.lifestyleDna.minWeeklyHours,
        maxWeeklyHours: dna.lifestyleDna.maxWeeklyHours,
        freedomLevel: dna.lifestyleDna.freedomLevel,
      },
      create: {
        businessTypeId: businessType.id,
        workMode: dna.lifestyleDna.workMode,
        travelRequirement: dna.lifestyleDna.travelRequirement,
        teamSize: dna.businessCharacteristics.isSoloFounderFriendly ? "solo" : "small",
        salesChannel: dna.lifestyleDna.salesChannel,
        onlineOffline: dna.lifestyleDna.onlineOffline,
        minWeeklyHours: dna.lifestyleDna.minWeeklyHours,
        maxWeeklyHours: dna.lifestyleDna.maxWeeklyHours,
        freedomLevel: dna.lifestyleDna.freedomLevel,
      },
    });

    // --- BusinessRisk --------------------------------------------------
    // riskLevel sourced from aiMetadata.matchingHints.riskProfile (already
    // low/moderate/high, and the field this pipeline's downstream matching
    // logic is actually meant to compare against) rather than
    // riskDna.difficulty.level, which measures a different thing
    // ("how hard is this to run" vs. "how risky is this"). failureImpact
    // and requiredConfidence have no source field anywhere in
    // business-dna.json — left null; see this file's README-equivalent
    // note in the final report about this gap.
    await db.businessRisk.upsert({
      where: { businessTypeId: businessType.id },
      update: { riskLevel: dna.aiMetadata.matchingHints.riskProfile ?? "moderate" },
      create: {
        businessTypeId: businessType.id,
        riskLevel: dna.aiMetadata.matchingHints.riskProfile ?? "moderate",
      },
    });

    // --- BusinessBudget --------------------------------------------------
    await db.businessBudget.upsert({
      where: { businessTypeId: businessType.id },
      update: {
        minInvestment: dna.financialDna.budget.minInvestment,
        maxInvestment: dna.financialDna.budget.maxInvestment,
        currency: dna.financialDna.budget.currency,
        ongoingMonthlyCostMin: dna.financialDna.budget.ongoingMonthlyCostMin,
        ongoingMonthlyCostMax: dna.financialDna.budget.ongoingMonthlyCostMax,
      },
      create: {
        businessTypeId: businessType.id,
        minInvestment: dna.financialDna.budget.minInvestment,
        maxInvestment: dna.financialDna.budget.maxInvestment,
        currency: dna.financialDna.budget.currency,
        ongoingMonthlyCostMin: dna.financialDna.budget.ongoingMonthlyCostMin,
        ongoingMonthlyCostMax: dna.financialDna.budget.ongoingMonthlyCostMax,
      },
    });

    // --- BusinessRevenue -------------------------------------------------
    await db.businessRevenue.upsert({
      where: { businessTypeId: businessType.id },
      update: {
        targetMonthlyIncomeMin: dna.financialDna.financialInformation.targetMonthlyIncomeMin,
        targetMonthlyIncomeMax: dna.financialDna.financialInformation.targetMonthlyIncomeMax,
        revenueSpeed: dna.revenueDna.revenueSpeed.level,
      },
      create: {
        businessTypeId: businessType.id,
        targetMonthlyIncomeMin: dna.financialDna.financialInformation.targetMonthlyIncomeMin,
        targetMonthlyIncomeMax: dna.financialDna.financialInformation.targetMonthlyIncomeMax,
        revenueSpeed: dna.revenueDna.revenueSpeed.level,
      },
    });

    // --- BusinessTimeline --------------------------------------------
    // timeToFirstCustomerWeeks and timeToScaleMonths have no clean source
    // field in business-dna.json (growthDna.scaling.milestones exists but
    // is a list of differently-scoped milestones, not a single figure —
    // picking one would be inventing data, not mapping it). Left null.
    await db.businessTimeline.upsert({
      where: { businessTypeId: businessType.id },
      update: { timeToBreakEvenMonths: dna.financialDna.financialInformation.breakEvenTimelineMonths },
      create: {
        businessTypeId: businessType.id,
        timeToBreakEvenMonths: dna.financialDna.financialInformation.breakEvenTimelineMonths,
      },
    });

    // --- BusinessSkill ---------------------------------------------------
    // Sourced from aiMetadata.matchingHints.requiredSkills/preferredSkills
    // — already the exact skillKeySchema vocabulary (10 keys) and 1-5
    // scale RequiredSkill/BusinessSkill.importance expects, unlike
    // skillDna.ratings (12 keys, 1-10 scale, only partial name overlap —
    // see features/business-dna/README.md's documented scale conflict).
    // No package has a skill key in both requiredSkills and preferredSkills
    // (verified across all 21); if one ever did, requiredSkills wins.
    const skillHints = new Map<string, number>();
    for (const hint of dna.aiMetadata.matchingHints.preferredSkills ?? []) {
      skillHints.set(hint.key, hint.importance);
    }
    for (const hint of dna.aiMetadata.matchingHints.requiredSkills ?? []) {
      skillHints.set(hint.key, hint.importance);
    }
    for (const [skillKey, importance] of skillHints) {
      const skill = await db.requiredSkill.findUniqueOrThrow({ where: { key: skillKey } });
      await db.businessSkill.upsert({
        where: { businessTypeId_skillId: { businessTypeId: businessType.id, skillId: skill.id } },
        update: { importance },
        create: { businessTypeId: businessType.id, skillId: skill.id, importance },
      });
    }
  }
}

async function main() {
  if (!existsSync(TECHNOLOGY_DIR)) {
    throw new Error(`business-library/technology not found at ${TECHNOLOGY_DIR}`);
  }

  await seedIndustries();
  await seedCategories();
  await seedRequiredSkills();
  await seedTags();
  await seedTools();
  await seedResources();
  await seedBusinessTypes();

  const count = await db.businessType.count();
  console.log(`Business Engine seed complete — ${count} BusinessType row(s).`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
