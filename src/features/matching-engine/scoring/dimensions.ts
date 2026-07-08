/**
 * Every axis the matching engine can compare a user against a
 * BusinessType on. This is the vocabulary the rest of the engine is built
 * around — scoring, rules, and results all key off these values rather
 * than free-form strings, so a typo can't silently create an unscored
 * dimension.
 *
 * Adding a dimension later is additive and safe. Removing or renaming one
 * is not — anything already stored in `BusinessQuestionWeight.weight` or a
 * `WeightConfig` (see ./weight-config.ts) keys off these string values.
 */
export enum MatchingDimension {
  Skills = "skills",
  Budget = "budget",
  Lifestyle = "lifestyle",
  Risk = "risk",
  Timeline = "timeline",
  IndustryPreference = "industryPreference",
  BusinessModelPreference = "businessModelPreference",
  CommunicationStyle = "communicationStyle",
  Leadership = "leadership",
  Creativity = "creativity",
  TechnicalAbility = "technicalAbility",
  SalesOrientation = "salesOrientation",
  Location = "location",
  WorkStyle = "workStyle",
}

export const ALL_MATCHING_DIMENSIONS: readonly MatchingDimension[] = Object.values(MatchingDimension);
