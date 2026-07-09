/**
 * Every type this feature reuses from elsewhere rather than redeclares.
 * See README.md's reuse table.
 *
 * NOTE: `ResourceType` (business-engine, 5 categories) and business-dna's
 * `ResourcesSection`/`BusinessDnaResourceCategory` (7 categories) are
 * intentionally NOT imported here as this feature's own category
 * vocabulary — this feature defines its own, broader 16-category
 * `ResourceCategoryKey` and is meant as the new canonical superset for
 * the "resources" domain going forward. See README.md's "Relationship to
 * existing resource types" section for the full mapping; neither
 * existing file is modified.
 */
export {};
