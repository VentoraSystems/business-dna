import { zodToJsonSchema } from "zod-to-json-schema";
import { marketingSchema } from "./marketing.schema";

/** Standard json-schema.org (draft-07) export for the top-level Marketing shape — same approach features/blueprint and features/financial took. */
export function generateMarketingJsonSchema() {
  return zodToJsonSchema(marketingSchema, "Marketing");
}
