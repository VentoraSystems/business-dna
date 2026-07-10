import "server-only";
import type { BusinessCategory, BusinessIndustry } from "@prisma/client";
import { db } from "@/lib/db";
import {
  fullBusinessTypeInclude,
  businessTypeSummaryInclude,
  type FullBusinessType,
  type BusinessTypeSummary,
  type BusinessTypeListFilters,
} from "../types/business-type";

/**
 * Abstracted so the future matching engine (or a test suite) can depend on
 * this interface rather than on Prisma directly. `PrismaBusinessRepository`
 * is the only implementation today; a caching or in-memory-fixture
 * implementation could satisfy the same interface later without touching
 * any calling code.
 */
export interface BusinessRepository {
  findFullById(id: string): Promise<FullBusinessType | null>;
  findFullBySlug(slug: string): Promise<FullBusinessType | null>;
  list(filters?: BusinessTypeListFilters): Promise<BusinessTypeSummary[]>;
  /**
   * Same filtering as `list()`, but with every relation `findFullById`
   * would include (lifestyle/risk/budget/revenue/timeline/skills/etc.).
   * Added for `features/matching-engine`'s `BusinessCandidateProvider`,
   * which needs those normalized attributes to build a scorable
   * `BusinessCandidate` — `list()`'s lighter `businessTypeSummaryInclude`
   * (category/industry only) isn't enough for that.
   */
  listFull(filters?: BusinessTypeListFilters): Promise<FullBusinessType[]>;
  count(filters?: BusinessTypeListFilters): Promise<number>;
  listCategories(industryId?: string): Promise<BusinessCategory[]>;
  listIndustries(): Promise<BusinessIndustry[]>;
}

function buildWhere(filters?: BusinessTypeListFilters) {
  if (!filters) return {};
  return {
    ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
    ...(filters.businessModel ? { businessModel: filters.businessModel } : {}),
    ...(filters.difficulty ? { difficulty: filters.difficulty } : {}),
    ...(filters.isPublished !== undefined ? { isPublished: filters.isPublished } : {}),
    ...(filters.industryCode ? { category: { industry: { code: filters.industryCode } } } : {}),
    ...(filters.search
      ? { OR: [{ slug: { contains: filters.search } }, { translationKey: { contains: filters.search } }] }
      : {}),
  };
}

class PrismaBusinessRepository implements BusinessRepository {
  async findFullById(id: string) {
    return db.businessType.findUnique({ where: { id }, include: fullBusinessTypeInclude });
  }

  async findFullBySlug(slug: string) {
    return db.businessType.findUnique({ where: { slug }, include: fullBusinessTypeInclude });
  }

  async list(filters?: BusinessTypeListFilters) {
    return db.businessType.findMany({
      where: buildWhere(filters),
      include: businessTypeSummaryInclude,
      take: filters?.take ?? 50,
      skip: filters?.skip ?? 0,
      orderBy: { createdAt: "desc" },
    });
  }

  async listFull(filters?: BusinessTypeListFilters) {
    return db.businessType.findMany({
      where: buildWhere(filters),
      include: fullBusinessTypeInclude,
      take: filters?.take ?? 50,
      skip: filters?.skip ?? 0,
      orderBy: { createdAt: "desc" },
    });
  }

  async count(filters?: BusinessTypeListFilters) {
    return db.businessType.count({ where: buildWhere(filters) });
  }

  async listCategories(industryId?: string) {
    return db.businessCategory.findMany({
      where: { isActive: true, ...(industryId ? { industryId } : {}) },
      orderBy: { sortOrder: "asc" },
    });
  }

  async listIndustries() {
    return db.businessIndustry.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
  }
}

export const businessRepository: BusinessRepository = new PrismaBusinessRepository();
