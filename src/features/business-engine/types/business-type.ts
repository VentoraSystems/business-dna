import type { Prisma } from "@prisma/client";

/**
 * These are derived from Prisma's own generated types via `GetPayload`,
 * rather than hand-written — so they can never drift from the actual
 * schema. The `include` shape here must match what
 * `businessRepository.findFullById` actually queries with; see
 * repositories/business-repository.ts.
 */

export const fullBusinessTypeInclude = {
  category: { include: { industry: true } },
  lifestyle: true,
  risk: true,
  budget: true,
  revenue: true,
  timeline: true,
  requirements: { orderBy: { sortOrder: "asc" } },
  advantages: { orderBy: { sortOrder: "asc" } },
  disadvantages: { orderBy: { sortOrder: "asc" } },
  skills: { include: { skill: true } },
  tags: { include: { tag: true } },
  tools: { include: { tool: true } },
  resources: { include: { resource: true } },
} satisfies Prisma.BusinessTypeInclude;

export type FullBusinessType = Prisma.BusinessTypeGetPayload<{
  include: typeof fullBusinessTypeInclude;
}>;

export const businessTypeSummaryInclude = {
  category: { include: { industry: true } },
} satisfies Prisma.BusinessTypeInclude;

/** The lighter shape used for list views (catalog browsing, filters). */
export type BusinessTypeSummary = Prisma.BusinessTypeGetPayload<{
  include: typeof businessTypeSummaryInclude;
}>;

export interface BusinessTypeListFilters {
  categoryId?: string;
  industryCode?: Prisma.BusinessIndustryWhereInput["code"];
  businessModel?: Prisma.BusinessTypeWhereInput["businessModel"];
  difficulty?: Prisma.BusinessTypeWhereInput["difficulty"];
  isPublished?: boolean;
  /** Simple slug/translationKey prefix search — no ranking, just a filter. */
  search?: string;
  take?: number;
  skip?: number;
}
