import { z } from "zod";
import type { AssessmentFeatureVector } from "@/features/matching-engine/types/assessment-input";
import type { CompatibilityResult } from "@/features/matching-engine/types/compatibility-result";
import { locales } from "@/i18n/config";
// Reuses the Business Genome standard's own schema — the one dto field
// this sprint does NOT need to hand-write validation for.
import { businessGenomeSchema } from "../../../../business-library/schema";

const localeSchema = z.enum(locales);

/**
 * `assessmentFeatures` and `compatibilityResult` are validated with
 * `z.custom` rather than a hand-written zod mirror: those shapes are
 * owned by matching-engine, which has no zod schema of its own (it's
 * plain TypeScript throughout — see features/matching-engine). Re-
 * describing their structure here would be exactly the kind of parallel
 * duplicate copy this sprint was told to avoid; `z.custom` defers to the
 * imported TS type instead of re-declaring it in zod syntax.
 *
 * Not annotated `z.ZodType<ExplanationEngineInput>` like the other
 * schemas in this folder: `businessGenomeSchema` has several `.default()`
 * fields (see business-library/schema.ts), which makes its Zod input type
 * and output type diverge — incompatible with `z.ZodType<T>`'s
 * single-type-parameter form. `z.infer` below still recovers the right
 * output type.
 */
export const explanationEngineInputSchema = z.object({
  assessmentFeatures: z.custom<AssessmentFeatureVector>(),
  businessGenome: businessGenomeSchema,
  compatibilityResult: z.custom<CompatibilityResult>(),
  locale: localeSchema,
});

export type ExplanationEngineInputSchemaOutput = z.infer<typeof explanationEngineInputSchema>;
