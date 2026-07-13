import "server-only";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { readRoadmapSeedTasks } from "@/features/business-engine/utils/roadmap-seed-content";
import type { Locale } from "@/i18n/config";

/**
 * Seeds a Roadmap (10 stages' worth of RoadmapTask rows, one per authored
 * roadmap.json checklist item) for a Business that doesn't have one yet —
 * deterministic, not AI-generated (sourceSectionKey stays null on every
 * task this creates; Blueprint's launchPlan/growthPlan generation is what
 * sets it, see request-section-generation.ts). Idempotent: a Roadmap
 * already existing for this Business (Roadmap.businessId is unique) is
 * left untouched, no duplicate tasks. Never throws — failures are logged,
 * not propagated, since every caller treats Roadmap seeding as an
 * enrichment on top of its own primary deliverable, not a hard dependency.
 *
 * Two callers, deliberately: adoptBusinessMatch() (seed at adoption time)
 * and getRoadmapView() (self-heal on read, for any Business that reached
 * this function's `catch` at adoption time and was never retried — e.g. a
 * Business adopted before this app's Roadmap schema columns existed in
 * production yet). Extracted out of adopt-business-match.ts specifically
 * so both have one shared, single source of truth instead of a duplicated
 * copy.
 */
export async function seedRoadmapIfMissing(
  businessId: string,
  userId: string,
  businessTypeSlug: string,
  assessmentId: string,
  locale: Locale
): Promise<void> {
  try {
    const existingRoadmap = await db.roadmap.findUnique({ where: { businessId } });
    if (existingRoadmap) return;

    const seedTasks = await readRoadmapSeedTasks(businessTypeSlug, locale);
    if (seedTasks.length === 0) return;

    const roadmap = await db.roadmap.create({ data: { userId, businessId } });
    await db.roadmapTask.createMany({
      data: seedTasks.map((task) => ({
        roadmapId: roadmap.id,
        title: task.title,
        stage: task.stage,
        month: task.month,
        order: task.order,
      })),
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return; // race: another request already seeded it
    console.error(`seedRoadmapIfMissing failed for business ${businessId} (assessment ${assessmentId}):`, error);
  }
}
