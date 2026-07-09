import { zodToJsonSchema } from "zod-to-json-schema";
import { businessDnaProfileSchema } from "./business-dna-profile.schema";

/**
 * Generates the standard json-schema.org (draft-07, zod-to-json-schema's
 * default target) representation of `businessDnaProfileSchema`. Kept as
 * a function (not a static import of the pre-generated file) so it can
 * be regenerated on demand if the Zod schema changes — the checked-in
 * `business-dna-profile.schema.json` alongside this file is this
 * function's output, for tools that want a plain JSON Schema document
 * without evaluating TypeScript/Zod.
 *
 * `zod-to-json-schema` was added as a minimal new dependency for this —
 * see README.md → "JSON Schema export" for why hand-authoring a static
 * JSON Schema for a 21-section, deeply-nested shape by hand was judged
 * too drift-prone compared to generating it from the schema that's
 * already the source of truth.
 */
export function generateBusinessDnaProfileJsonSchema() {
  return zodToJsonSchema(businessDnaProfileSchema, "BusinessDnaProfile");
}
