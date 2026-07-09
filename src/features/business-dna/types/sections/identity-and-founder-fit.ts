import type { BusinessGenomeFounderProfile, BusinessGenomeIdentity } from "../reused-from-business-library";

/**
 * Section 1 — Identity. Full reuse: identical shape to
 * `businessGenomeIdentitySchema` (business-library/schema.ts §1) — a
 * BusinessDnaProfile's identity doesn't need to differ from a Business
 * Genome's, since both describe the same document.
 */
export type Identity = BusinessGenomeIdentity;

/**
 * Section 2 — Founder Fit. Full reuse: identical shape to
 * `businessGenomeFounderProfileSchema` (business-library §6), including
 * its `idealArchetypes: founderArchetypeSchema[]` (the 6-key
 * theBuilder/theConnector/theOperator/theVisionary/theSpecialist/
 * theHustler vocabulary). Deliberately NOT the same vocabulary as
 * Section 7, Entrepreneur DNA Match (7-key) — see that section's
 * docstring and README.md's "Existing archetype vocabularies" for why
 * all three of this codebase's archetype vocabularies stay separate.
 */
export type FounderFit = BusinessGenomeFounderProfile;
