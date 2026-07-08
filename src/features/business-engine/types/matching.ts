import type { Prisma } from "@prisma/client";

export const matchResultWithBusinessTypeInclude = {
  businessType: { include: { category: { include: { industry: true } } } },
} satisfies Prisma.BusinessMatchResultInclude;

export type MatchResultWithBusinessType = Prisma.BusinessMatchResultGetPayload<{
  include: typeof matchResultWithBusinessTypeInclude;
}>;
