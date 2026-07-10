import type { Prisma } from "@prisma/client";

/**
 * `budget`/`revenue` added for the Assessment results page (Phase 3) —
 * `RecommendedOpportunities` needs investment range and target monthly
 * revenue per matched BusinessType, which the original category/industry-only
 * include didn't carry.
 */
export const matchResultWithBusinessTypeInclude = {
  businessType: {
    include: { category: { include: { industry: true } }, budget: true, revenue: true },
  },
} satisfies Prisma.BusinessMatchResultInclude;

export type MatchResultWithBusinessType = Prisma.BusinessMatchResultGetPayload<{
  include: typeof matchResultWithBusinessTypeInclude;
}>;
