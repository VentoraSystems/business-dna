import { zodToJsonSchema } from "zod-to-json-schema";
import { blueprintSchema } from "./blueprint.schema";

/** Standard json-schema.org (draft-07) export for the top-level Blueprint shape — same approach features/business-dna took. */
export function generateBlueprintJsonSchema() {
  return zodToJsonSchema(blueprintSchema, "Blueprint");
}
