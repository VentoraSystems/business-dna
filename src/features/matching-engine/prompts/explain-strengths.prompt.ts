import { definePlaceholderPrompt } from "./prompt-template";

export interface ExplainStrengthsVariables extends Record<string, unknown> {
  businessTypeTranslationKey: string;
  strengths: string[];
  locale: string;
}

/** Explains which dimensions favored this match and why they matter for this BusinessType. */
export const explainStrengthsPrompt = definePlaceholderPrompt<ExplainStrengthsVariables>({
  id: "explainStrengths",
  description: "Explain the user's strongest dimensions relative to this BusinessType.",
  requiredVariables: ["businessTypeTranslationKey", "strengths", "locale"],
});
