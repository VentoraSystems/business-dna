/**
 * The 16-category Resources vocabulary. GENUINELY NEW — this is the new
 * canonical, broader superset for the "resources" domain, per this
 * epic's explicit instruction. See README.md's "Relationship to existing
 * resource types" section for how this compares to business-dna's
 * (narrower, 7-category) `ResourcesSection` and business-engine's
 * (narrower, 5-category) `ResourceType` — neither of those existing
 * files is modified or aliased here.
 */
export enum ResourceCategoryKey {
  Books = "books",
  Courses = "courses",
  Communities = "communities",
  Podcasts = "podcasts",
  YouTube = "youtube",
  Newsletters = "newsletters",
  Blogs = "blogs",
  Templates = "templates",
  Checklists = "checklists",
  Software = "software",
  AiTools = "aiTools",
  PromptLibraries = "promptLibraries",
  Documents = "documents",
  Certifications = "certifications",
  Events = "events",
  Experts = "experts",
}

export const ALL_RESOURCE_CATEGORY_KEYS: readonly ResourceCategoryKey[] = Object.values(ResourceCategoryKey);

/** A single curated resource item, tagged with one of the 16 categories above. */
export interface ResourceItem {
  category: ResourceCategoryKey;
  titleTranslationKey: string;
  descriptionTranslationKey?: string;
  url?: string;
}

/**
 * AI Metadata — independently defined, same pattern as the other
 * Business Assets features' AI Metadata (a bundle of translationKey
 * hints), different field set by design intent.
 */
export interface ResourcesAiMetadata {
  generationHintsTranslationKey?: string;
  explanationHintsTranslationKey?: string;
  matchingHintsTranslationKey?: string;
}
