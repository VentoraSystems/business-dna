import type { BusinessDnaProfile } from "../types/business-dna-profile";

/**
 * Input to update an existing profile. Partial at the section level
 * (replace whichever whole sections changed) — not deep-partial into
 * each section's individual fields, matching the granularity
 * business-engine's own `*UpdateSchema`s use (e.g.
 * `requiredSkillUpdateSchema = requiredSkillCreateSchema.partial()`).
 */
export type BusinessDnaProfileUpdateDto = Partial<BusinessDnaProfile>;
