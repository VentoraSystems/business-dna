import { zodToJsonSchema } from "zod-to-json-schema";
import { resourcesSchema } from "./resources.schema";

/** Standard json-schema.org (draft-07) export for the top-level Resources shape — same approach the other Business Assets features took. */
export function generateResourcesJsonSchema() {
  return zodToJsonSchema(resourcesSchema, "Resources");
}
