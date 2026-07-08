import { z } from "zod";

/** Lowercase, hyphenated identifier used in URLs — e.g. "boutique-fitness-studio". */
export const slugSchema = z
  .string()
  .min(2)
  .max(80)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Must be lowercase, hyphen-separated (e.g. \"my-slug\").");

/**
 * A key into messages/*.json rather than display text — every catalog
 * entity stores copy this way so the same row works in every supported
 * locale. e.g. "businessTypes.boutiqueFitnessStudio.name".
 */
export const translationKeySchema = z
  .string()
  .min(2)
  .max(160)
  .regex(/^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*$/, "Must be dot-separated identifier segments.");

/** A 1-5 rating, matching the Assessment's rating-question scale. */
export const ratingScaleSchema = z.number().int().min(1).max(5);

export const nonNegativeIntSchema = z.number().int().min(0);
