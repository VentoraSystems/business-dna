import { definePlaceholderPrompt } from "./prompt-template";

export interface ImproveCompatibilityVariables extends Record<string, unknown> {
  businessTypeTranslationKey: string;
  weaknesses: string[];
  missingSkills: string[];
  locale: string;
}

/** Suggests concrete, encouraging next steps a user could take to raise their compatibility with this BusinessType. */
export const improveCompatibilityPrompt = definePlaceholderPrompt<ImproveCompatibilityVariables>({
  id: "improveCompatibility",
  description: "Suggest how the user could improve their compatibility with this BusinessType.",
  requiredVariables: ["businessTypeTranslationKey", "weaknesses", "missingSkills", "locale"],
});
