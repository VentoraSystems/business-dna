import { zodToJsonSchema } from "zod-to-json-schema";
import { financialSchema } from "./financial.schema";

/** Standard json-schema.org (draft-07) export for the top-level Financial shape. */
export function generateFinancialJsonSchema() {
  return zodToJsonSchema(financialSchema, "Financial");
}
