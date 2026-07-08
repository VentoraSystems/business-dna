import { definePlaceholderPrompt } from "./prompt-template";

export interface ExplainMatchVariables extends Record<string, unknown> {
  businessTypeTranslationKey: string;
  overallScore: number;
  topDimensions: string[];
  locale: string;
}

/** Explains, in plain language, why a user and a BusinessType scored the way they did. */
export const explainMatchPrompt = definePlaceholderPrompt<ExplainMatchVariables>({
  id: "explainMatch",
  description: "Explain why this user and this BusinessType produced the given overall score.",
  requiredVariables: ["businessTypeTranslationKey", "overallScore", "topDimensions", "locale"],
});
