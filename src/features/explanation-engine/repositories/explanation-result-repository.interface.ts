import type { ExplanationResult } from "../dto/explanation-result.dto";

/**
 * One persisted ExplanationResult, scoped to the (user, Assessment,
 * BusinessType) triple it explains — mirrors how
 * `BusinessMatchRepository.create()` in features/business-engine takes
 * those same three ids alongside the score it persists.
 */
export interface ExplanationResultRecord {
  assessmentId: string;
  businessTypeId: string;
  userId: string;
  result: ExplanationResult;
  generatedAt: Date;
}

/**
 * Pure data access contract for persisting/retrieving a generated
 * ExplanationResult. No implementation exists yet — nothing calls this,
 * and nothing implements it. Once `ExplanationEngine` is real, a
 * Prisma-backed implementation (see
 * features/business-engine/repositories/business-match-repository.ts for
 * the pattern) can persist results here without this feature's services
 * changing shape.
 */
export interface ExplanationResultRepository {
  save(record: ExplanationResultRecord): Promise<void>;
  findByAssessmentAndBusinessType(
    assessmentId: string,
    businessTypeId: string
  ): Promise<ExplanationResultRecord | null>;
  findByAssessmentId(assessmentId: string): Promise<ExplanationResultRecord[]>;
}
