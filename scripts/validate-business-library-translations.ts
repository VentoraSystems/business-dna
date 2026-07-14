/**
 * Bilingual-completeness scan for business-library packages — catches
 * gaps validate-packages.ts doesn't check: that check only confirms
 * required files exist and metadata is well-formed, not that every
 * translationKey a package's JSON files reference actually resolves to
 * real text in BOTH messages/en.json and messages/ro.json, and not that
 * every inline { en, ro } localized-text object in business-dna.json has
 * both languages populated.
 *
 * Two checks, per package:
 *   1. Every string value matching the "businessLibrary.<slug>...."
 *      translationKey convention, found anywhere in financial.json,
 *      marketing.json, roadmap.json, resources.json, and
 *      business-insights.json (plus business-dna.json's own
 *      translationKey-based resources[] list), must resolve to a
 *      non-empty string in both messages/en.json and messages/ro.json.
 *   2. Every inline { en: string, ro: string } localized-text object
 *      found anywhere in business-dna.json must have both fields
 *      present and non-empty.
 *
 * Usage: `npx tsx scripts/validate-business-library-translations.ts <slug> [<slug> ...]`
 * or with no arguments to check every "published" package in manifest.json.
 */
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const REPO_ROOT = path.join(__dirname, "..");
const TECHNOLOGY_DIR = path.join(REPO_ROOT, "business-library", "technology");
const MANIFEST_PATH = path.join(REPO_ROOT, "business-library", "manifest.json");
const MESSAGES_EN_PATH = path.join(REPO_ROOT, "messages", "en.json");
const MESSAGES_RO_PATH = path.join(REPO_ROOT, "messages", "ro.json");

type Tree = Record<string, unknown>;

function resolveKey(tree: Tree, dottedPath: string): unknown {
  return dottedPath.split(".").reduce<unknown>((node, part) => {
    if (node && typeof node === "object" && part in (node as Record<string, unknown>)) {
      return (node as Record<string, unknown>)[part];
    }
    return undefined;
  }, tree);
}

/** Recursively collects every string value that looks like a translationKey reference (this project's fixed "businessLibrary." prefix convention). */
function collectTranslationKeyStrings(value: unknown, into: Set<string>) {
  if (typeof value === "string") {
    if (value.startsWith("businessLibrary.")) into.add(value);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectTranslationKeyStrings(item, into);
    return;
  }
  if (value && typeof value === "object") {
    for (const v of Object.values(value)) collectTranslationKeyStrings(v, into);
  }
}

/** Recursively finds every { en: string, ro: string } localized-text object and reports any with a missing/empty side. */
function collectLocalizedTextGaps(value: unknown, pathSoFar: string, into: string[]) {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    value.forEach((item, i) => collectLocalizedTextGaps(item, `${pathSoFar}[${i}]`, into));
    return;
  }
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj);
  if (keys.length === 2 && keys.includes("en") && keys.includes("ro")) {
    const en = obj.en;
    const ro = obj.ro;
    if (typeof en !== "string" || en.trim().length === 0) into.push(`${pathSoFar}.en is missing/empty`);
    if (typeof ro !== "string" || ro.trim().length === 0) into.push(`${pathSoFar}.ro is missing/empty`);
    return; // a { en, ro } leaf doesn't need deeper recursion
  }
  for (const [key, v] of Object.entries(obj)) collectLocalizedTextGaps(v, `${pathSoFar}.${key}`, into);
}

function readJson(filePath: string): unknown {
  return JSON.parse(readFileSync(filePath, "utf-8"));
}

function checkPackage(slug: string, messagesEn: Tree, messagesRo: Tree): string[] {
  const problems: string[] = [];
  const dir = path.join(TECHNOLOGY_DIR, slug);

  const businessDna = readJson(path.join(dir, "business-dna.json"));
  const localizedTextGaps: string[] = [];
  collectLocalizedTextGaps(businessDna, "business-dna.json", localizedTextGaps);
  problems.push(...localizedTextGaps);

  const translationKeyBearingFiles = ["financial.json", "marketing.json", "roadmap.json", "resources.json", "business-insights.json"];
  const allKeys = new Set<string>();
  collectTranslationKeyStrings(businessDna, allKeys); // business-dna.json's resources[].translationKey list
  for (const file of translationKeyBearingFiles) {
    const data = readJson(path.join(dir, file));
    collectTranslationKeyStrings(data, allKeys);
  }

  for (const key of allKeys) {
    const enValue = resolveKey(messagesEn, key);
    const roValue = resolveKey(messagesRo, key);
    if (typeof enValue !== "string" || enValue.trim().length === 0) problems.push(`missing/empty EN text for translationKey "${key}"`);
    if (typeof roValue !== "string" || roValue.trim().length === 0) problems.push(`missing/empty RO text for translationKey "${key}"`);
  }

  return problems;
}

function loadPublishedSlugs(): string[] {
  const manifest = readJson(MANIFEST_PATH) as { packages: { slug: string; status: string }[] };
  return manifest.packages.filter((p) => p.status === "published").map((p) => p.slug);
}

function main() {
  const argSlugs = process.argv.slice(2);
  const slugs = argSlugs.length > 0 ? argSlugs : loadPublishedSlugs();

  const messagesEn = readJson(MESSAGES_EN_PATH) as Tree;
  const messagesRo = readJson(MESSAGES_RO_PATH) as Tree;

  let hasFailure = false;
  for (const slug of slugs) {
    if (!readdirSync(TECHNOLOGY_DIR).includes(slug)) {
      console.error(`✗ ${slug} — no such package directory`);
      hasFailure = true;
      continue;
    }
    const problems = checkPackage(slug, messagesEn, messagesRo);
    if (problems.length === 0) {
      console.log(`✓ ${slug}`);
    } else {
      hasFailure = true;
      console.error(`✗ ${slug}`);
      for (const problem of problems) console.error(`    ${problem}`);
    }
  }

  if (hasFailure) {
    console.error("\nOne or more packages have bilingual-completeness gaps.");
    process.exitCode = 1;
  } else {
    console.log(`\nAll ${slugs.length} package(s) are bilingually complete.`);
  }
}

main();
