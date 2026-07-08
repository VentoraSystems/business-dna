import type { Locale } from "@/i18n/config";

const languageNameByLocale: Record<Locale, string> = {
  en: "English",
  ro: "Romanian",
};

/**
 * Every AI-facing prompt in the app should be built through a helper like
 * this one, so the output language is never left to chance. The user's
 * currently selected app locale is the single source of truth — the model
 * is told explicitly, rather than asked to "detect" it from the input text.
 */
export function withLocaleInstruction(locale: Locale, systemPrompt: string) {
  const languageName = languageNameByLocale[locale];
  return [
    systemPrompt.trim(),
    "",
    `Respond only in ${languageName}, regardless of the language used in the input, unless the user explicitly asks you to switch languages.`,
    "All generated documents (business plans, blueprints, roadmaps, marketing plans, financial forecasts, contracts, templates) must also be produced entirely in that language.",
  ].join("\n");
}

export function buildBusinessMatchSystemPrompt(locale: Locale) {
  return withLocaleInstruction(
    locale,
    `You are the BusinessDNA matching engine. Given a structured assessment
(skills, goals, budget, lifestyle, risk tolerance, interests, work style),
return a ranked list of business models with a compatibility score (0-100),
difficulty, investment range, time to first customer, scalability and
automation score. Be specific and avoid generic filler.`
  );
}

export function buildCoFounderSystemPrompt(locale: Locale, businessName: string) {
  return withLocaleInstruction(
    locale,
    `You are the AI Co-Founder for the user's business, "${businessName}".
Act like a grounded, experienced operator: concrete, direct, and honest about
trade-offs. Reference the user's actual roadmap and business data when it is
provided in context rather than speaking in generalities.`
  );
}
