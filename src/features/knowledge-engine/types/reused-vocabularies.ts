/**
 * Types/schemas this feature REUSES rather than redeclares, per the
 * "CRITICAL — reuse, don't duplicate" instruction for this sprint:
 *
 *  - Industries  → IndustryType / industryTypeSchema
 *                  (src/features/business-engine/schemas/enums.ts)
 *  - BusinessModels → BusinessModelType / businessModelTypeSchema
 *                  (same file)
 *  - Skills      → SkillKey (derived here), from business-library's
 *                  skillKeySchema. business-engine also has a `RequiredSkill`
 *                  concept (see schemas/lookups.ts →
 *                  requiredSkillCreateSchema), but its `key` there is a
 *                  free-form camelCase string, not a closed enum — there is
 *                  nothing to import for it beyond `skillKeySchema` itself,
 *                  which IS the closed vocabulary.
 *
 * Both business-engine and business-library independently declare their
 * own copies of the industry/business-model enums (a pre-existing split
 * between the two systems, out of scope to fix here). This feature picks
 * business-engine's copy for Industries/BusinessModels — it already
 * exports ready-made `IndustryType`/`BusinessModelType` type aliases — and
 * business-library's copy for Skills, since that's the one this sprint's
 * spec names explicitly. The long relative import into business-library
 * is confined to this one file; everything else in this feature imports
 * `SkillKey`/`skillKeySchema` from here.
 */
import { z } from "zod";
import {
  industryTypeSchema,
  businessModelTypeSchema,
  type IndustryType,
  type BusinessModelType,
} from "@/features/business-engine/schemas/enums";
import { skillKeySchema } from "../../../../business-library/schema";

export type SkillKey = z.infer<typeof skillKeySchema>;

export { industryTypeSchema, businessModelTypeSchema, skillKeySchema };
export type { IndustryType, BusinessModelType };
