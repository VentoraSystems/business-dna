import { zodToJsonSchema } from "zod-to-json-schema";
import { businessInsightsSchema } from "./business-insights.schema";

/** Standard json-schema.org (draft-07) export for the top-level Business Insights shape — same approach the other Business Assets features took. */
export function generateBusinessInsightsJsonSchema() {
  return zodToJsonSchema(businessInsightsSchema, "BusinessInsights");
}
