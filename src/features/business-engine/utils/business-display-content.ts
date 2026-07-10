import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import type { Locale } from "@/i18n/config";

/**
 * Reads a BusinessType's real display name/tagline/description straight
 * from its `business-library/technology/<slug>/business-dna.json` —
 * read-only, never modifies that content. Phase 1's seed
 * (prisma/seed-business-engine.ts) never stored these into Prisma (only
 * structured attributes — budget, risk, lifestyle, skills), so this is the
 * one place a display-facing feature (Assessment results, a BusinessType
 * detail page) reads business-library content directly at request time,
 * the same way `features/business-dna`'s README anticipates future
 * generators doing. `BusinessType.slug` matches a
 * `business-library/technology/<slug>` folder name 1:1 by convention (see
 * prisma/seed-business-engine.ts).
 */
export interface BusinessDisplayContent {
  name: string;
  tagline: string;
  /** description.short — a card-length summary. */
  shortDescription: string;
  /** description.long — a detail-page-length summary. */
  longDescription: string;
}

const BUSINESS_LIBRARY_TECHNOLOGY_DIR = path.join(process.cwd(), "business-library", "technology");

export function readBusinessDisplayContent(slug: string, locale: Locale): BusinessDisplayContent {
  const fallback: BusinessDisplayContent = { name: slug, tagline: "", shortDescription: "", longDescription: "" };
  try {
    const filePath = path.join(BUSINESS_LIBRARY_TECHNOLOGY_DIR, slug, "business-dna.json");
    const raw = JSON.parse(readFileSync(filePath, "utf-8")) as {
      identity?: { name?: Record<string, string>; tagline?: Record<string, string> };
      description?: { short?: Record<string, string>; long?: Record<string, string> };
    };
    return {
      name: raw.identity?.name?.[locale] ?? raw.identity?.name?.en ?? fallback.name,
      tagline: raw.identity?.tagline?.[locale] ?? raw.identity?.tagline?.en ?? fallback.tagline,
      shortDescription: raw.description?.short?.[locale] ?? raw.description?.short?.en ?? fallback.shortDescription,
      longDescription:
        raw.description?.long?.[locale] ?? raw.description?.long?.en ?? raw.description?.short?.[locale] ?? fallback.longDescription,
    };
  } catch {
    // A business-dna.json can legitimately be missing — fall back to the slug rather than
    // let one bad/missing file break the page that's rendering it.
    return fallback;
  }
}
