import type { BusinessGenomeMatchingMetadata, LocalizedText } from "../reused-from-business-library";

/**
 * Section 20 — AI Metadata. `matchingHints` reuses
 * `BusinessGenomeMatchingMetadata` (business-library §38) directly — its
 * ~17 fields (`requiredSkills`, `preferredPersonality`, `requiredBudget`,
 * `riskProfile`, `timeAvailability`, `idealFounderArchetypes`, and so on)
 * are NOT redeclared here under a new name, per this sprint's explicit
 * instruction.
 *
 * The other four hint fields are genuinely new, narrower-purpose
 * bundles for future generators beyond what business-library already
 * has a dedicated field for — though `blueprintHints` in particular
 * overlaps `blueprintStructure.promptContext` (business-library §37)
 * conceptually; that overlap is intentional to flag, not hidden. Which
 * of the two a future Blueprint Generator should prefer (or how they
 * should combine) is left as an open question.
 */
export interface AiMetadata {
  /** Reused directly — see business-library/schema.ts → `businessGenomeMatchingMetadataSchema`. */
  matchingHints: BusinessGenomeMatchingMetadata;
  /** GENUINELY NEW. Hints for a future Blueprint Generator. Overlaps `blueprintStructure.promptContext` — see this file's top docstring. */
  blueprintHints?: LocalizedText;
  /** GENUINELY NEW. Hints for a future Marketing Engine, beyond `marketingStrategy` (business-library §26). */
  marketingHints?: LocalizedText;
  /** GENUINELY NEW. Hints for a future Financial Engine, beyond `financialInformation` (business-library §24). */
  financialHints?: LocalizedText;
  /** GENUINELY NEW. General generation hints not scoped to one specific future generator. */
  generationHints?: LocalizedText;
}
