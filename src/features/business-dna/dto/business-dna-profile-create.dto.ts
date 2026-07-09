import type { BusinessDnaProfile } from "../types/business-dna-profile";

/**
 * Input to create a new profile. Every section is required — a
 * BusinessDnaProfile is meant to be produced whole, from a fully-formed
 * `BusinessGenome` (via the not-yet-implemented `fromBusinessGenome()`
 * adapter — see ../interfaces/business-genome-mapper.interface.ts),
 * not assembled section-by-section over multiple calls.
 */
export type BusinessDnaProfileCreateDto = BusinessDnaProfile;
