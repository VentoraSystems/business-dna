import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import { locales, type Locale } from "@/i18n/config";

const BUSINESS_LIBRARY_DIR = path.join(process.cwd(), "business-library", "technology");

/**
 * Loads messages/<locale>.json the same way src/i18n/request.ts does
 * (`await import(...)`), NOT via fs — a runtime `fs.readFileSync` of
 * project files works locally but breaks on Vercel: files read via `fs`
 * at request time aren't included in the deployed serverless function
 * bundle unless Next's file tracer can statically resolve the path (see
 * README/commit history — this is what caused
 * "ENOENT ... open '/var/task/messages/en.json'" in production). A
 * bundler-resolved `import()` sidesteps the problem entirely: webpack
 * bundles both locale files directly into the function's JS output, so
 * there's nothing for the tracer to miss. business-library/**'s reads
 * below stay on fs.readFileSync (the per-business slug is unbounded and
 * can't be statically imported) — outputFileTracingIncludes in
 * next.config.mjs covers those instead.
 */
async function loadMessages(locale: Locale): Promise<Record<string, unknown>> {
  const messages = locale === "en" ? await import("../../../../messages/en.json") : await import("../../../../messages/ro.json");
  return messages.default as Record<string, unknown>;
}

/**
 * Resolves a dot-path translation key (e.g.
 * "businessLibrary.softwareHouse.marketing.positioning.statement") against
 * an already-loaded messages object. Falls back to the key itself — a
 * missing translation shouldn't break generation, same fallback philosophy
 * as readBusinessDisplayContent().
 */
function resolveTranslationKey(key: string, messages: Record<string, unknown>): string {
  const parts = key.split(".");
  let node: unknown = messages;
  for (const part of parts) {
    if (node && typeof node === "object" && part in (node as Record<string, unknown>)) {
      node = (node as Record<string, unknown>)[part];
    } else {
      return key;
    }
  }
  return typeof node === "string" ? node : key;
}

/**
 * Recursively replaces every `...TranslationKey` / `...TranslationKeys`
 * field's value with its resolved text, keeping the same key name — this
 * output only ever gets JSON.stringify'd into a prompt, so the model
 * doesn't care whether the key is called "titleTranslationKey" or "title",
 * only that the value is real text instead of an opaque key string.
 */
function resolveTranslationKeysDeep(node: unknown, messages: Record<string, unknown>): unknown {
  if (Array.isArray(node)) return node.map((item) => resolveTranslationKeysDeep(item, messages));
  if (node && typeof node === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
      const isKeyField = key.toLowerCase().includes("translationkey");
      if (isKeyField && typeof value === "string") {
        result[key] = resolveTranslationKey(value, messages);
      } else if (isKeyField && Array.isArray(value)) {
        result[key] = value.map((k) => (typeof k === "string" ? resolveTranslationKey(k, messages) : k));
      } else {
        result[key] = resolveTranslationKeysDeep(value, messages);
      }
    }
    return result;
  }
  return node;
}

const LOCALE_SET = new Set<string>(locales);

/**
 * Recursively collapses `{ en: string, ro: string }`-shaped leaves
 * (business-dna.json's bilingual-field convention) down to the plain
 * string for one locale.
 */
function resolveLocaleStringsDeep(node: unknown, locale: Locale): unknown {
  if (Array.isArray(node)) return node.map((item) => resolveLocaleStringsDeep(item, locale));
  if (node && typeof node === "object") {
    const obj = node as Record<string, unknown>;
    const keys = Object.keys(obj);
    if (keys.length > 0 && keys.every((k) => LOCALE_SET.has(k)) && keys.every((k) => typeof obj[k] === "string")) {
      return (obj[locale] as string | undefined) ?? (obj.en as string | undefined) ?? "";
    }
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = resolveLocaleStringsDeep(value, locale);
    }
    return result;
  }
  return node;
}

function readJson(slug: string, filename: string): unknown {
  return JSON.parse(readFileSync(path.join(BUSINESS_LIBRARY_DIR, slug, filename), "utf-8"));
}

function readText(slug: string, filename: string): string {
  return readFileSync(path.join(BUSINESS_LIBRARY_DIR, slug, filename), "utf-8");
}

/**
 * The business-dna.json top-level sections actually relevant to Blueprint
 * generation. Deliberately excludes `aiMetadata` (the Matching Engine's own
 * hints, not the generator's) and `blueprintReferences.blueprintStructure.sections`
 * (the disconnected 25-section list from features/blueprint's scaffold) —
 * only `blueprintReferences.blueprintStructure.promptContext` is used, read
 * out separately below.
 */
const DNA_SECTIONS_FOR_GENERATION = [
  "identity",
  "founderFit",
  "financialDna",
  "revenueDna",
  "lifestyleDna",
  "skillDna",
  "businessCharacteristics",
  "scalabilityDna",
  "riskDna",
  "marketingDna",
  "salesDna",
  "operationsDna",
  "technologyDna",
  "growthDna",
  "successDna",
  "kpis",
  "resources",
] as const;

export interface BlueprintGenerationContext {
  slug: string;
  locale: Locale;
  /** Locale-resolved subset of business-dna.json's DNA sections (see DNA_SECTIONS_FOR_GENERATION). */
  businessDna: Record<string, unknown>;
  /** business-dna.json's own authored prompt hint for this business, if present. */
  promptContext: string;
  /** blueprint.md's full prose — English-only; a companion authoring/AI-hint surface, not user-facing display copy. */
  blueprintNotes: string;
  /** ai-notes.md's generation hints — English-only, same reason, written specifically for a generator like this one. */
  aiNotes: string;
  /** Locale-resolved marketing.json. */
  marketing: unknown;
  /** Locale-resolved financial.json — the business's GENERIC financial range, not the user's own figures. */
  financial: unknown;
  /** Locale-resolved business-insights.json. */
  businessInsights: unknown;
}

/**
 * Gathers every real, authored piece of content available for one
 * BusinessType, locale-resolved, ready to feed a generation prompt.
 * Read-only — never modifies business-library content, same convention as
 * readBusinessDisplayContent(). Async because loading messages/<locale>.json
 * now goes through a bundler-resolved `import()` (see loadMessages()).
 */
export async function readBlueprintGenerationContext(slug: string, locale: Locale): Promise<BlueprintGenerationContext> {
  const dna = readJson(slug, "business-dna.json") as Record<string, unknown>;
  const businessDna: Record<string, unknown> = {};
  for (const key of DNA_SECTIONS_FOR_GENERATION) {
    if (key in dna) businessDna[key] = resolveLocaleStringsDeep(dna[key], locale);
  }

  const promptContextRaw = (
    dna.blueprintReferences as { blueprintStructure?: { promptContext?: Record<string, string> } } | undefined
  )?.blueprintStructure?.promptContext;
  const promptContext = promptContextRaw?.[locale] ?? promptContextRaw?.en ?? "";

  const messages = await loadMessages(locale);

  return {
    slug,
    locale,
    businessDna,
    promptContext,
    blueprintNotes: readText(slug, "blueprint.md"),
    aiNotes: readText(slug, "ai-notes.md"),
    marketing: resolveTranslationKeysDeep(readJson(slug, "marketing.json"), messages),
    financial: resolveTranslationKeysDeep(readJson(slug, "financial.json"), messages),
    businessInsights: resolveTranslationKeysDeep(readJson(slug, "business-insights.json"), messages),
  };
}
