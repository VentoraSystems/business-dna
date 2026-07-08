import { definePlaceholderPrompt } from "./prompt-template";

export interface BusinessSummaryVariables extends Record<string, unknown> {
  businessTypeTranslationKey: string;
  locale: string;
}

/** Produces a short, plain-language summary of a BusinessType itself, independent of any particular user's match. */
export const businessSummaryPrompt = definePlaceholderPrompt<BusinessSummaryVariables>({
  id: "businessSummary",
  description: "Summarize a BusinessType in plain language.",
  requiredVariables: ["businessTypeTranslationKey", "locale"],
});
