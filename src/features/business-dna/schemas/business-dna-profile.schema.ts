import { z } from "zod";
import {
  identitySchema,
  founderFitSchema,
  financialDnaSchema,
  revenueDnaSchema,
  lifestyleDnaSchema,
  skillDnaSchema,
  entrepreneurDnaMatchSchema,
  businessCharacteristicsSchema,
  scalabilityDnaSchema,
  riskDnaSchema,
  marketingDnaSchema,
  salesDnaSchema,
  operationsDnaSchema,
  technologyDnaSchema,
  growthDnaSchema,
  successDnaSchema,
  blueprintReferencesSchema,
  resourcesSectionSchema,
  kpisSectionSchema,
  aiMetadataSchema,
  businessLifecycleSchema,
} from "./sections.schema";

/**
 * Not annotated `z.ZodType<BusinessDnaProfile>`: several of the section
 * schemas above (financialDnaSchema, riskDnaSchema, operationsDnaSchema,
 * technologyDnaSchema, growthDnaSchema, successDnaSchema) are themselves
 * not annotated, for the reasons documented in sections.schema.ts — that
 * divergence propagates to this composite. `z.infer` below still
 * recovers the correct output type, matching `BusinessDnaProfile`
 * (types/business-dna-profile.ts) structurally.
 */
export const businessDnaProfileSchema = z.object({
  identity: identitySchema,
  founderFit: founderFitSchema,
  financialDna: financialDnaSchema,
  revenueDna: revenueDnaSchema,
  lifestyleDna: lifestyleDnaSchema,
  skillDna: skillDnaSchema,
  entrepreneurDnaMatch: entrepreneurDnaMatchSchema,
  businessCharacteristics: businessCharacteristicsSchema,
  scalabilityDna: scalabilityDnaSchema,
  riskDna: riskDnaSchema,
  marketingDna: marketingDnaSchema,
  salesDna: salesDnaSchema,
  operationsDna: operationsDnaSchema,
  technologyDna: technologyDnaSchema,
  growthDna: growthDnaSchema,
  successDna: successDnaSchema,
  blueprintReferences: blueprintReferencesSchema,
  resources: resourcesSectionSchema,
  kpis: kpisSectionSchema,
  aiMetadata: aiMetadataSchema,
  businessLifecycle: businessLifecycleSchema,
});

export type BusinessDnaProfileSchemaOutput = z.infer<typeof businessDnaProfileSchema>;

/** Section 21 (Business Lifecycle) has no required minimum stage count here — see README.md for why the empty template ships all 8 anyway. */
export const businessDnaProfileCreateSchema = businessDnaProfileSchema;

export const businessDnaProfileUpdateSchema = businessDnaProfileSchema.partial();
