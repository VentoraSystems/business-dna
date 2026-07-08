import "server-only";
import type { BusinessMatchResult } from "@prisma/client";
import { db } from "@/lib/db";
import type { BusinessMatchResultCreateInput } from "../schemas/matching";
import {
  matchResultWithBusinessTypeInclude,
  type MatchResultWithBusinessType,
} from "../types/matching";

/**
 * Pure data access for BusinessMatchResult. This repository does not decide
 * *what* the compatibility score should be — that's the not-yet-built
 * matching engine's job. It only knows how to persist and retrieve scores
 * once something else has computed them.
 */
export interface BusinessMatchRepository {
  create(input: BusinessMatchResultCreateInput): Promise<BusinessMatchResult>;
  findById(id: string): Promise<MatchResultWithBusinessType | null>;
  findByAssessmentId(assessmentId: string): Promise<MatchResultWithBusinessType[]>;
  findByUserId(userId: string): Promise<MatchResultWithBusinessType[]>;
  /** Lets the (future) matching engine safely re-run and replace prior results for an assessment. */
  deleteByAssessmentId(assessmentId: string): Promise<number>;
}

class PrismaBusinessMatchRepository implements BusinessMatchRepository {
  async create(input: BusinessMatchResultCreateInput) {
    return db.businessMatchResult.create({
      data: {
        userId: input.userId,
        assessmentId: input.assessmentId,
        businessTypeId: input.businessTypeId,
        compatibilityScore: input.compatibilityScore,
        scoreBreakdown: input.scoreBreakdown ?? undefined,
      },
    });
  }

  async findById(id: string) {
    return db.businessMatchResult.findUnique({
      where: { id },
      include: matchResultWithBusinessTypeInclude,
    });
  }

  async findByAssessmentId(assessmentId: string) {
    return db.businessMatchResult.findMany({
      where: { assessmentId },
      include: matchResultWithBusinessTypeInclude,
      orderBy: { compatibilityScore: "desc" },
    });
  }

  async findByUserId(userId: string) {
    return db.businessMatchResult.findMany({
      where: { userId },
      include: matchResultWithBusinessTypeInclude,
      orderBy: { createdAt: "desc" },
    });
  }

  async deleteByAssessmentId(assessmentId: string) {
    const result = await db.businessMatchResult.deleteMany({ where: { assessmentId } });
    return result.count;
  }
}

export const businessMatchRepository: BusinessMatchRepository = new PrismaBusinessMatchRepository();
