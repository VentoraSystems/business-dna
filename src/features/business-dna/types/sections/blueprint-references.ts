import type { BusinessGenomeBlueprintStructure } from "../reused-from-business-library";

/**
 * Section 17 — Blueprint References. Overlaps two existing shapes —
 * business-library's `blueprintStructure` (§37) and the Business
 * Engine's four template models (`BusinessBlueprintTemplate`,
 * `BusinessMarketingTemplate`, `BusinessFinancialTemplate`,
 * `BusinessLaunchTemplate` — all keyed by `businessTypeId`, see
 * `src/features/business-engine/schemas/templates.ts`). Per this
 * sprint's instruction, this section REFERENCES those existing shapes by
 * id rather than reinventing template structures:
 *
 *  - `blueprintStructure` is reused directly (the section list this
 *    genome should produce, from business-library).
 *  - The four `*TemplateId` fields below are plain `businessTypeId`-style
 *    cuid references into the Business Engine's four template tables —
 *    NOT a copy of `BusinessBlueprintTemplateInput`/
 *    `BusinessMarketingTemplateInput`/`BusinessFinancialTemplateInput`/
 *    `BusinessLaunchTemplateInput` (business-engine/schemas/templates.ts).
 *    A future adapter resolves the id; this section doesn't embed the
 *    resolved template.
 */
export interface BlueprintReferences {
  blueprintStructure: BusinessGenomeBlueprintStructure;
  /** References `BusinessBlueprintTemplate.id` (business-engine). */
  blueprintTemplateId?: string;
  /** References `BusinessMarketingTemplate.id` (business-engine). */
  marketingTemplateId?: string;
  /** References `BusinessFinancialTemplate.id` (business-engine). */
  financialTemplateId?: string;
  /** References `BusinessLaunchTemplate.id` (business-engine). */
  launchTemplateId?: string;
}
