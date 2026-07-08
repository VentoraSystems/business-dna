import { z } from "zod";

/**
 * Input to the future matching engine. `optionKey` is set for choice-type
 * questions to weight one specific option; left undefined for
 * slider/rating questions, where the weight applies to the normalized
 * numeric answer as a whole.
 */
export const businessQuestionWeightSchema = z.object({
  businessTypeId: z.string().cuid(),
  questionId: z.string().cuid(),
  optionKey: z.string().min(1).max(60).optional(),
  weight: z.number().min(-1).max(1).default(0),
});

/**
 * Output of the future matching engine. `scoreBreakdown` is intentionally
 * untyped Json at the Prisma level — this schema describes the shape the
 * matching engine should produce so the "why this match" UI has something
 * stable to render, without fixing that shape in the database itself.
 */
export const matchScoreBreakdownEntrySchema = z.object({
  questionKey: z.string(),
  contribution: z.number(),
  label: z.string().optional(),
});

export const businessMatchResultCreateSchema = z.object({
  userId: z.string().cuid(),
  assessmentId: z.string().cuid(),
  businessTypeId: z.string().cuid(),
  compatibilityScore: z.number().min(0).max(100),
  scoreBreakdown: z.array(matchScoreBreakdownEntrySchema).optional(),
});

export type BusinessQuestionWeightInput = z.infer<typeof businessQuestionWeightSchema>;
export type MatchScoreBreakdownEntry = z.infer<typeof matchScoreBreakdownEntrySchema>;
export type BusinessMatchResultCreateInput = z.infer<typeof businessMatchResultCreateSchema>;
