import { definePlaceholderPrompt } from "./prompt-template";

export interface ExplainWeaknessesVariables extends Record<string, unknown> {
  businessTypeTranslationKey: string;
  weaknesses: string[];
  missingSkills: string[];
  locale: string;
}

/** Explains which dimensions worked against this match, framed constructively rather than as a rejection. */
export const explainWeaknessesPrompt = definePlaceholderPrompt<ExplainWeaknessesVariables>({
  id: "explainWeaknesses",
  description: "Explain the user's weakest dimensions relative to this BusinessType.",
  requiredVariables: ["businessTypeTranslationKey", "weaknesses", "missingSkills", "locale"],
});
