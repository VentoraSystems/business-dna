/**
 * Expands every published business's authored roadmap.json checklist
 * from its current ~1 item per stage up to 8-10 items per stage, using
 * AI generation (gpt-4o-mini, same model/pattern as Blueprint generation
 * — see src/ai/prompts/blueprint.ts). This is a content-authoring tool,
 * not part of the running app — it edits each business's roadmap.json
 * under business-library/technology/ and messages/{en,ro}.json directly,
 * the same files a human author would hand-edit.
 *
 * DESIGN, NOT RUN: this sandbox cannot reach api.openai.com (confirmed —
 * same known constraint as every other AI-feature task this session), so
 * this script has been verified with a MOCKED OpenAI client only (see
 * scripts/expand-roadmap-checklists-check.ts) and has never actually
 * regenerated any real content. The user runs this locally with their
 * own OPENAI_API_KEY.
 *
 * REAL FINDING from Step 1's investigation (see the session report for
 * the full sample): across all 21 PUBLISHED businesses (not 22 — see
 * below) × 10 stages = 210 stage-instances, 209 have exactly 1 checklist
 * item and 1 (accounting-firm/preparation) has 2. Zero have 0. The
 * "1-3 items" estimate in this task's brief is a reasonable upper bound
 * but the real distribution is heavily skewed to exactly 1.
 *
 * business-library/manifest.json lists 22 packages, but only 21 have
 * status "published" — ai-automation-agency is a "template" placeholder
 * whose roadmap.json is a COMPLETELY DIFFERENT, incompatible shape
 * ({ _mirrors, businessTypeId, milestones: [] }, mirroring
 * BusinessLaunchTemplate, not RoadmapStage[]). This script reads its
 * business list from manifest.json's published packages, not by
 * globbing business-library/technology/*, specifically to avoid ever
 * touching that file. isRoadmapJsonShape() is a second, defensive guard
 * for the same reason — belt and suspenders — since manifest.json’s
 * `status` field only gates which businesses this script attempts.
 *
 * DECISION (Step 2): ADD to the existing checklist items, never discard
 * and regenerate the whole list. Reasoning: (1) the 210 existing items
 * are already human/Claude-authored and reviewed — regenerating them
 * risks a quality regression with no upside; (2) any Business already
 * adopted in production has RoadmapTask rows seeded from the CURRENT
 * checklist text — keeping existing translationKeys stable (only ever
 * appending new numeric indices, never touching index 0/1) means this
 * script can't silently invalidate content a real user has already seen
 * or completed; (3) it lets a human reviewer sanity-check only the NEW
 * items post-run, not re-review everything from scratch.
 *
 * Usage:
 *   NODE_OPTIONS=--conditions=react-server tsx scripts/expand-roadmap-checklists.ts --dry-run
 *     Shows what would change for all 21 businesses, writes nothing.
 *   NODE_OPTIONS=--conditions=react-server tsx scripts/expand-roadmap-checklists.ts --business=software-house --dry-run
 *     Same, scoped to one business — for spot-checking prompt quality
 *     before committing to all 21.
 *   NODE_OPTIONS=--conditions=react-server tsx scripts/expand-roadmap-checklists.ts --business=software-house
 *     Runs for real, but only writes that one business's roadmap.json
 *     (messages/{en,ro}.json still get the new keys, since that's where
 *     ALL businesses' translations already live in one shared file).
 *   NODE_OPTIONS=--conditions=react-server tsx scripts/expand-roadmap-checklists.ts
 *     Runs for real against all 21 published businesses.
 *   Optional: --delay-ms=2000 to change the pause between OpenAI calls
 *   (default 1500ms — ~210 calls total across all 21 businesses, so the
 *   full run takes roughly 5-10 minutes end to end even before OpenAI's
 *   own latency).
 *
 * STEP 4 — flagged, not resolved: this script only updates the AUTHORED
 * SOURCE content (business-library + messages/*.json). Any Business
 * already adopted in production has RoadmapTask rows seeded from the OLD
 * checklist at adoption time (see seedRoadmapIfMissing() in
 * roadmap-seeding.ts) and will NOT automatically pick up the new items —
 * seeding only ever runs once per Business (plus the Part 3 self-heal
 * path for Businesses that never got seeded at all, which is a different
 * case). A follow-up backfill script would need to: diff each existing
 * Roadmap's current RoadmapTask titles against the newly-expanded
 * checklist, insert RoadmapTask rows only for genuinely new items (not
 * duplicate ones already completed or already present), and decide how
 * to handle `order`/`month` for items inserted after users may have
 * already completed some of the original ones. Deliberately NOT
 * designed or built here — that's a decision for after the regenerated
 * content itself has been generated and reviewed, not before.
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { z } from "zod";
import { openai } from "../src/ai/openai";

const REPO_ROOT = path.join(__dirname, "..");
const DEFAULT_TECHNOLOGY_DIR = path.join(REPO_ROOT, "business-library", "technology");
const DEFAULT_MANIFEST_PATH = path.join(REPO_ROOT, "business-library", "manifest.json");
const DEFAULT_MESSAGES_EN_PATH = path.join(REPO_ROOT, "messages", "en.json");
const DEFAULT_MESSAGES_RO_PATH = path.join(REPO_ROOT, "messages", "ro.json");

const MODEL = "gpt-4o-mini";
/** Middle of the requested 8-10 range. */
const TARGET_TOTAL_CHECKLIST_ITEMS = 9;

// ---------------------------------------------------------------------------
// Manifest / business list
// ---------------------------------------------------------------------------

interface ManifestPackageEntry {
  slug: string;
  status: string;
}
interface Manifest {
  packages: ManifestPackageEntry[];
}

export function loadPublishedBusinessSlugs(manifestPath: string): string[] {
  const manifest = JSON.parse(readFileSync(manifestPath, "utf-8")) as Manifest;
  return manifest.packages.filter((entry) => entry.status === "published").map((entry) => entry.slug);
}

// ---------------------------------------------------------------------------
// roadmap.json shape — only the fields this script reads/writes
// ---------------------------------------------------------------------------

export interface RoadmapStageJson {
  stage: string;
  objectiveTranslationKeys: string[];
  deliverableTranslationKeys: string[];
  checklistTranslationKeys: string[];
  [key: string]: unknown;
}
export interface RoadmapJson {
  stages: RoadmapStageJson[];
  [key: string]: unknown;
}

/** Defensive shape guard — see the ai-automation-agency note in this file's top comment for why this matters. */
export function isRoadmapJsonShape(value: unknown): value is RoadmapJson {
  return !!value && typeof value === "object" && Array.isArray((value as { stages?: unknown }).stages);
}

// ---------------------------------------------------------------------------
// messages/*.json helpers — dotted-path resolution/insertion, mirroring
// blueprint-generation-context.ts's / roadmap-seed-content.ts's
// resolveTranslationKey() (read-only there; this script also needs to
// WRITE new leaves, which those don't).
// ---------------------------------------------------------------------------

export type MessagesTree = Record<string, unknown>;

function getNode(tree: MessagesTree, dottedPath: string): unknown {
  return dottedPath.split(".").reduce<unknown>((node, part) => {
    if (node && typeof node === "object" && part in (node as Record<string, unknown>)) {
      return (node as Record<string, unknown>)[part];
    }
    return undefined;
  }, tree);
}

export function resolveText(tree: MessagesTree, key: string): string | undefined {
  const node = getNode(tree, key);
  return typeof node === "string" ? node : undefined;
}

/** Ensures every intermediate object in a dotted path exists (without clobbering what's already there), returns the final object new leaf keys get written into. */
export function ensurePath(tree: MessagesTree, dottedPath: string): Record<string, unknown> {
  const parts = dottedPath.split(".");
  let node: Record<string, unknown> = tree;
  for (const part of parts) {
    const child = node[part];
    if (!child || typeof child !== "object") {
      node[part] = {};
    }
    node = node[part] as Record<string, unknown>;
  }
  return node;
}

/**
 * Derives the shared translationKey prefix (e.g.
 * "businessLibrary.softwareHouse.roadmap") from this stage's own first
 * existing checklist key, rather than re-deriving a kebab-case-to-
 * camelCase transform independently — safer, since it can't disagree
 * with whatever casing the original content was actually authored with
 * for an irregular slug. Every stage in every published business
 * currently has at least 1 checklist item (confirmed for all 21 — see
 * this file's top comment), so this never needs a fallback in practice;
 * throwing here (rather than guessing) is deliberate if that ever
 * changes.
 */
export function deriveKeyPrefix(firstChecklistKey: string, stage: string): string {
  const marker = `.${stage}.checklist.`;
  const index = firstChecklistKey.indexOf(marker);
  if (index === -1) {
    throw new Error(`Could not derive a translationKey prefix from "${firstChecklistKey}" for stage "${stage}" — expected it to contain "${marker}".`);
  }
  return firstChecklistKey.slice(0, index);
}

// ---------------------------------------------------------------------------
// OpenAI call: prompt + Zod validation + retry-once (same shape as
// generateAndValidateSection() in request-section-generation.ts)
// ---------------------------------------------------------------------------

const newChecklistItemSchema = z.object({
  en: z.string().min(15),
  ro: z.string().min(15),
});
const checklistExpansionResponseSchema = z.object({
  newItems: z.array(newChecklistItemSchema),
});
export type NewChecklistItem = z.infer<typeof newChecklistItemSchema>;

const SYSTEM_PROMPT = [
  "You are an expert startup operations consultant authoring a business launch roadmap.",
  "Every checklist item you write must be a single, concrete, checkable action a founder can literally mark done after doing it — never a goal, a category, or generic advice.",
  'Match this quality bar: "Get explicit client sign-off before publishing any case study." — specific, verifiable, and grounded in one real business.',
].join(" ");

interface ExpansionPromptParams {
  businessName: string;
  businessTagline: string;
  blueprintExcerpt: string;
  stage: string;
  objectives: string[];
  deliverables: string[];
  existingChecklist: string[];
  newItemsNeeded: number;
}

export function buildExpansionUserPrompt(params: ExpansionPromptParams): string {
  const { businessName, businessTagline, blueprintExcerpt, stage, objectives, deliverables, existingChecklist, newItemsNeeded } = params;
  return [
    `Business: ${businessName} — ${businessTagline}`,
    "",
    "Business context (for grounding — do not quote it verbatim):",
    blueprintExcerpt,
    "",
    `Roadmap stage: "${stage}"`,
    "This stage's existing objectives:",
    ...objectives.map((o) => `- ${o}`),
    "This stage's existing deliverables:",
    ...deliverables.map((d) => `- ${d}`),
    `This stage's EXISTING checklist items (already authored — keep these in mind, do NOT duplicate or rephrase them):`,
    ...existingChecklist.map((c, i) => `${i + 1}. ${c}`),
    "",
    `TASK: Write exactly ${newItemsNeeded} NEW checklist items to ADD to this stage's existing ${existingChecklist.length} item(s), so the stage ends up with ${existingChecklist.length + newItemsNeeded} total. Each new item must be:`,
    "- A single, concrete, checkable action — not a goal, theme, or category",
    "- Genuinely distinct from the existing items and from each other — no rephrasing, no overlap",
    "- Specific to THIS business and THIS stage of its journey, grounded in the business context above",
    "",
    "For each new item, write both a natural, professional English version AND a natural, professional Romanian version — written as a native Romanian business consultant would write it, not a mechanical/literal translation.",
    "",
    `Return a single JSON object: { "newItems": [ { "en": "...", "ro": "..." }, ... ] } with exactly ${newItemsNeeded} objects in the array.`,
  ].join("\n");
}

/** Cheap, deliberately simple defensive check (this is a batch-authoring tool with mandatory human review before use, not a live per-user path — see this file's top comment — so a lighter check than Blueprint's looksLikeWrongLanguage() heuristic is proportionate). Rejects only the unambiguous failure: the model copying English verbatim into the Romanian field. */
function roMatchesEnVerbatim(item: NewChecklistItem): boolean {
  return item.en.trim().toLowerCase() === item.ro.trim().toLowerCase();
}

async function callOpenAiOnce(systemPrompt: string, userPrompt: string, newItemsNeeded: number): Promise<NewChecklistItem[]> {
  const completion = await openai.chat.completions.create({
    model: MODEL,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });
  const raw = completion.choices[0]?.message?.content ?? "";
  const parsed: unknown = JSON.parse(raw);
  const validated = checklistExpansionResponseSchema.parse(parsed);

  if (validated.newItems.length < newItemsNeeded) {
    throw new Error(`Expected at least ${newItemsNeeded} new items, got ${validated.newItems.length}.`);
  }
  if (validated.newItems.some(roMatchesEnVerbatim)) {
    throw new Error("At least one item's Romanian text is identical to its English text — the model likely didn't translate it.");
  }
  return validated.newItems.slice(0, newItemsNeeded);
}

/** One call, retried once on any failure (network, JSON parse, Zod validation, or the defensive checks above) — same retry-once shape as generateAndValidateSection() in request-section-generation.ts. */
export async function generateNewChecklistItems(params: ExpansionPromptParams): Promise<NewChecklistItem[]> {
  const userPrompt = buildExpansionUserPrompt(params);
  try {
    return await callOpenAiOnce(SYSTEM_PROMPT, userPrompt, params.newItemsNeeded);
  } catch {
    return await callOpenAiOnce(SYSTEM_PROMPT, userPrompt, params.newItemsNeeded);
  }
}

// ---------------------------------------------------------------------------
// Per-business expansion
// ---------------------------------------------------------------------------

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readBlueprintExcerpt(technologyDir: string, slug: string): string {
  try {
    return readFileSync(path.join(technologyDir, slug, "blueprint.md"), "utf-8");
  } catch {
    return ""; // Grounding is best-effort — a missing blueprint.md shouldn't block expansion.
  }
}

function readBusinessIdentity(technologyDir: string, slug: string): { name: string; tagline: string } {
  try {
    const dna = JSON.parse(readFileSync(path.join(technologyDir, slug, "business-dna.json"), "utf-8")) as {
      identity?: { name?: { en?: string }; tagline?: { en?: string } };
    };
    return {
      name: dna.identity?.name?.en ?? slug,
      tagline: dna.identity?.tagline?.en ?? "",
    };
  } catch {
    return { name: slug, tagline: "" };
  }
}

export interface ExpandBusinessResult {
  slug: string;
  stageSummaries: string[];
  newItemCount: number;
}

/**
 * Expands one business's roadmap.json IN MEMORY (mutates the passed
 * roadmapJson and messages trees directly — does not read or write any
 * files itself, so it's safely reusable against real files, dry-run
 * previews, or a verification script's temp copies). Callers decide
 * whether/where to persist the result.
 *
 * Deliberately fail-fast, not resilient-per-stage: a stage's generation
 * failure (both retry attempts) throws and propagates all the way up
 * through runExpansion(), aborting the rest of that business AND any
 * businesses still queued after it. This is a supervised, human-run
 * authoring tool, not a live per-user background job (unlike Blueprint
 * generation, which must degrade gracefully to a "failed" status instead
 * of crashing) — stopping loudly so the operator can see exactly what
 * failed and re-run is the right behavior here, not swallowing the error
 * and silently producing a partially-expanded roadmap.
 */
export async function expandBusiness(params: {
  slug: string;
  technologyDir: string;
  roadmapJson: RoadmapJson;
  messagesEn: MessagesTree;
  messagesRo: MessagesTree;
  delayMs: number;
}): Promise<ExpandBusinessResult> {
  const { slug, technologyDir, roadmapJson, messagesEn, messagesRo, delayMs } = params;
  const blueprintExcerpt = readBlueprintExcerpt(technologyDir, slug);
  const { name, tagline } = readBusinessIdentity(technologyDir, slug);

  const stageSummaries: string[] = [];
  let newItemCount = 0;

  for (const stageJson of roadmapJson.stages) {
    const existingCount = stageJson.checklistTranslationKeys.length;
    const newItemsNeeded = Math.max(0, TARGET_TOTAL_CHECKLIST_ITEMS - existingCount);
    if (newItemsNeeded === 0) {
      stageSummaries.push(`${slug}/${stageJson.stage}: already has ${existingCount} items (>= ${TARGET_TOTAL_CHECKLIST_ITEMS}) — skipped.`);
      continue;
    }

    const [firstKey] = stageJson.checklistTranslationKeys;
    if (!firstKey) {
      stageSummaries.push(`${slug}/${stageJson.stage}: SKIPPED — no existing checklist item to derive a translationKey prefix from.`);
      continue;
    }
    const keyPrefix = deriveKeyPrefix(firstKey, stageJson.stage);

    const existingChecklistText = stageJson.checklistTranslationKeys
      .map((key) => resolveText(messagesEn, key))
      .filter((text): text is string => !!text);
    const objectives = stageJson.objectiveTranslationKeys.map((key) => resolveText(messagesEn, key)).filter((text): text is string => !!text);
    const deliverables = stageJson.deliverableTranslationKeys.map((key) => resolveText(messagesEn, key)).filter((text): text is string => !!text);

    const newItems = await generateNewChecklistItems({
      businessName: name,
      businessTagline: tagline,
      blueprintExcerpt,
      stage: stageJson.stage,
      objectives,
      deliverables,
      existingChecklist: existingChecklistText,
      newItemsNeeded,
    });

    const enChecklistNode = ensurePath(messagesEn, `${keyPrefix}.${stageJson.stage}.checklist`);
    const roChecklistNode = ensurePath(messagesRo, `${keyPrefix}.${stageJson.stage}.checklist`);

    newItems.forEach((item, i) => {
      const newIndex = existingCount + i;
      stageJson.checklistTranslationKeys.push(`${keyPrefix}.${stageJson.stage}.checklist.${newIndex}`);
      enChecklistNode[String(newIndex)] = item.en;
      roChecklistNode[String(newIndex)] = item.ro;
    });

    newItemCount += newItems.length;
    stageSummaries.push(`${slug}/${stageJson.stage}: +${newItems.length} (was ${existingCount}, now ${existingCount + newItems.length})`);

    if (delayMs > 0) await sleep(delayMs);
  }

  return { slug, stageSummaries, newItemCount };
}

// ---------------------------------------------------------------------------
// Orchestration — the only place that touches the real filesystem
// ---------------------------------------------------------------------------

export interface RunExpansionOptions {
  technologyDir: string;
  manifestPath: string;
  messagesEnPath: string;
  messagesRoPath: string;
  dryRun: boolean;
  onlyBusinessSlug: string | null;
  delayMs: number;
}

export interface RunExpansionResult {
  results: ExpandBusinessResult[];
  totalNewItems: number;
}

export async function runExpansion(options: RunExpansionOptions): Promise<RunExpansionResult> {
  const { technologyDir, manifestPath, messagesEnPath, messagesRoPath, dryRun, onlyBusinessSlug, delayMs } = options;

  const allSlugs = loadPublishedBusinessSlugs(manifestPath);
  const slugs = onlyBusinessSlug ? allSlugs.filter((slug) => slug === onlyBusinessSlug) : allSlugs;
  if (onlyBusinessSlug && slugs.length === 0) {
    throw new Error(`--business=${onlyBusinessSlug} is not a published business. Published slugs: ${allSlugs.join(", ")}`);
  }

  const messagesEn = JSON.parse(readFileSync(messagesEnPath, "utf-8")) as MessagesTree;
  const messagesRo = JSON.parse(readFileSync(messagesRoPath, "utf-8")) as MessagesTree;

  const results: ExpandBusinessResult[] = [];
  let totalNewItems = 0;

  for (const slug of slugs) {
    const roadmapPath = path.join(technologyDir, slug, "roadmap.json");
    const roadmapRaw: unknown = JSON.parse(readFileSync(roadmapPath, "utf-8"));

    if (!isRoadmapJsonShape(roadmapRaw)) {
      console.warn(`Skipping ${slug} — roadmap.json isn't in the expected { stages: [...] } shape (see this file's ai-automation-agency note).`);
      continue;
    }

    const result = await expandBusiness({ slug, technologyDir, roadmapJson: roadmapRaw, messagesEn, messagesRo, delayMs });
    results.push(result);
    totalNewItems += result.newItemCount;

    if (!dryRun && result.newItemCount > 0) {
      writeFileSync(roadmapPath, JSON.stringify(roadmapRaw, null, 2) + "\n");
    }
  }

  if (!dryRun && totalNewItems > 0) {
    writeFileSync(messagesEnPath, JSON.stringify(messagesEn, null, 2) + "\n");
    writeFileSync(messagesRoPath, JSON.stringify(messagesRo, null, 2) + "\n");
  }

  return { results, totalNewItems };
}

// ---------------------------------------------------------------------------
// CLI entrypoint — only runs when this file is executed directly, not
// when imported (see scripts/expand-roadmap-checklists-check.ts, which
// imports the functions above against temp-directory copies without
// triggering this).
// ---------------------------------------------------------------------------

function parseCliArgs(argv: string[]) {
  const dryRun = argv.includes("--dry-run");
  const businessArg = argv.find((arg) => arg.startsWith("--business="));
  const delayArg = argv.find((arg) => arg.startsWith("--delay-ms="));
  return {
    dryRun,
    onlyBusinessSlug: businessArg ? businessArg.slice("--business=".length) : null,
    delayMs: delayArg ? Number(delayArg.slice("--delay-ms=".length)) : 1500,
  };
}

async function main(): Promise<void> {
  const { dryRun, onlyBusinessSlug, delayMs } = parseCliArgs(process.argv.slice(2));

  console.log(`Roadmap checklist expansion — ${dryRun ? "DRY RUN" : "LIVE (will write files)"}${onlyBusinessSlug ? `, business=${onlyBusinessSlug}` : ", all published businesses"}`);

  const { results, totalNewItems } = await runExpansion({
    technologyDir: DEFAULT_TECHNOLOGY_DIR,
    manifestPath: DEFAULT_MANIFEST_PATH,
    messagesEnPath: DEFAULT_MESSAGES_EN_PATH,
    messagesRoPath: DEFAULT_MESSAGES_RO_PATH,
    dryRun,
    onlyBusinessSlug,
    delayMs,
  });

  console.log("\n=== Summary ===");
  for (const result of results) {
    for (const line of result.stageSummaries) console.log(line);
  }
  console.log(`\nTotal new checklist items: ${totalNewItems}`);
  console.log(dryRun ? "DRY RUN — no files were written." : "Files written.");
}

// CommonJS entrypoint guard (this repo's scripts run as CommonJS under
// tsx — no "type": "module" in package.json, and __dirname is used
// above) — the standard `require.main === module` check, NOT
// import.meta.url, which is ESM-only and would throw here.
if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
