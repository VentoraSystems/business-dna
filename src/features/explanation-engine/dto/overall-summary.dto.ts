/**
 * The top-line "why this match" summary, produced by
 * `SummaryBuilder.build()`. Structured — a translationKey plus the values
 * it needs to interpolate (score, business name key, etc.) — rather than
 * a sentence, so it can be rendered in any language/style. `aiNarrative`
 * is where a future AI layer plugs in prose built from the structured
 * fields on `ExplanationResult`; nothing in this sprint populates it.
 */
export interface OverallSummary {
  translationKey: string;
  /** ICU-style interpolation values for translationKey, e.g. { overallScore: 82, archetype: "visionary" }. */
  values: Record<string, string | number>;
  /** Populated by a future AI layer, not this sprint. Left undefined here. */
  aiNarrative?: string;
}
