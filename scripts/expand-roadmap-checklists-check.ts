/**
 * Verification script for scripts/expand-roadmap-checklists.ts — not a
 * test, not part of the app. This sandbox cannot reach api.openai.com
 * (confirmed, same constraint as every other AI-feature task this
 * session), so this exercises the script's REAL exported functions
 * (imported directly, not reimplemented/mirrored — this script has no
 * requireCurrentUser()/Clerk dependency, unlike every *-check.ts script
 * elsewhere in this repo, so there's no reason to mirror instead of
 * import) against a throwaway temp directory built from COPIES of real
 * business-library content, with a mocked OpenAI client. The real
 * business-library/*.json and messages/*.json files are only ever READ
 * here, never written.
 *
 * Run with `npm run expand-roadmap-checklists:check`.
 */
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { openai } from "../src/ai/openai";
import {
  runExpansion,
  expandBusiness,
  generateNewChecklistItems,
  loadPublishedBusinessSlugs,
  isRoadmapJsonShape,
  deriveKeyPrefix,
  resolveText,
  ensurePath,
  type RoadmapJson,
  type MessagesTree,
} from "./expand-roadmap-checklists";

const REPO_ROOT = path.join(__dirname, "..");
const REAL_TECHNOLOGY_DIR = path.join(REPO_ROOT, "business-library", "technology");
const REAL_MESSAGES_EN_PATH = path.join(REPO_ROOT, "messages", "en.json");
const REAL_MESSAGES_RO_PATH = path.join(REPO_ROOT, "messages", "ro.json");

const TEST_SLUGS = ["software-house", "law-firm"] as const;

type CompletionsCreate = typeof openai.chat.completions.create;
let mockResponseQueue: string[] = [];
const originalCreate: CompletionsCreate = openai.chat.completions.create.bind(openai.chat.completions);
function installMockOpenAi() {
  // @ts-expect-error — narrowing the real SDK's overloaded return type for this test double is not worth the ceremony.
  openai.chat.completions.create = async () => {
    const content = mockResponseQueue.shift();
    if (content === undefined) throw new Error("Mock queue exhausted.");
    return { choices: [{ message: { content } }] } as Awaited<ReturnType<CompletionsCreate>>;
  };
}
function restoreOpenAi() {
  openai.chat.completions.create = originalCreate;
}

function mockNewItemsResponse(count: number, labelPrefix: string) {
  return JSON.stringify({
    newItems: Array.from({ length: count }, (_, i) => ({
      en: `${labelPrefix} mock new checklist item ${i + 1} — a concrete, checkable action.`,
      ro: `${labelPrefix} element nou de verificare simulat ${i + 1} — o acțiune concretă și verificabilă.`,
    })),
  });
}

/** Builds a fresh temp business-library-shaped tree from copies of real files — the real repo files are only ever read here. */
function buildTempFixtures(): {
  tempDir: string;
  technologyDir: string;
  manifestPath: string;
  messagesEnPath: string;
  messagesRoPath: string;
} {
  const tempDir = mkdtempSync(path.join(tmpdir(), "expand-roadmap-check-"));
  const technologyDir = path.join(tempDir, "technology");
  mkdirSync(technologyDir, { recursive: true });

  for (const slug of TEST_SLUGS) {
    const destDir = path.join(technologyDir, slug);
    mkdirSync(destDir, { recursive: true });
    for (const file of ["roadmap.json", "blueprint.md", "business-dna.json"]) {
      writeFileSync(path.join(destDir, file), readFileSync(path.join(REAL_TECHNOLOGY_DIR, slug, file), "utf-8"));
    }
  }

  // A business whose roadmap.json is NOT the { stages: [...] } shape — mirrors the real
  // ai-automation-agency template's incompatible format, to prove isRoadmapJsonShape() catches it.
  const brokenShapeDir = path.join(technologyDir, "broken-shape-business");
  mkdirSync(brokenShapeDir, { recursive: true });
  writeFileSync(path.join(brokenShapeDir, "roadmap.json"), JSON.stringify({ _mirrors: "BusinessLaunchTemplate", businessTypeId: null, milestones: [] }));

  const manifestPath = path.join(tempDir, "manifest.json");
  writeFileSync(
    manifestPath,
    JSON.stringify({
      packages: [
        { slug: "software-house", status: "published" },
        { slug: "law-firm", status: "published" },
        { slug: "broken-shape-business", status: "published" },
        { slug: "unpublished-business", status: "template" },
      ],
    })
  );

  const messagesEnPath = path.join(tempDir, "en.json");
  const messagesRoPath = path.join(tempDir, "ro.json");
  writeFileSync(messagesEnPath, readFileSync(REAL_MESSAGES_EN_PATH, "utf-8"));
  writeFileSync(messagesRoPath, readFileSync(REAL_MESSAGES_RO_PATH, "utf-8"));

  return { tempDir, technologyDir, manifestPath, messagesEnPath, messagesRoPath };
}

function readJson<T>(filePath: string): T {
  return JSON.parse(readFileSync(filePath, "utf-8")) as T;
}

async function main() {
  console.log("=== Step 1: pure-function checks (deriveKeyPrefix / ensurePath / resolveText) ===");
  const prefix = deriveKeyPrefix("businessLibrary.softwareHouse.roadmap.preparation.checklist.0", "preparation");
  console.log(`deriveKeyPrefix -> "${prefix}" (expected "businessLibrary.softwareHouse.roadmap.preparation.checklist.0" minus stage/checklist suffix)`);
  if (prefix !== "businessLibrary.softwareHouse.roadmap") throw new Error(`deriveKeyPrefix wrong: got "${prefix}"`);

  const tree: MessagesTree = {};
  const node = ensurePath(tree, "a.b.c");
  node.hello = "world";
  console.log(`ensurePath + resolveText round-trip: ${resolveText(tree, "a.b.c.hello")} (expected "world")`);
  if (resolveText(tree, "a.b.c.hello") !== "world") throw new Error("ensurePath/resolveText round-trip failed!");
  if (resolveText(tree, "a.b.c.doesNotExist") !== undefined) throw new Error("resolveText should return undefined for a missing key!");

  console.log("\n=== Step 2: manifest filtering — only 'published' slugs are picked up ===");
  const { tempDir, technologyDir, manifestPath, messagesEnPath, messagesRoPath } = buildTempFixtures();
  const publishedSlugs = loadPublishedBusinessSlugs(manifestPath);
  console.log(`Published slugs from temp manifest: ${JSON.stringify(publishedSlugs)}`);
  if (publishedSlugs.includes("unpublished-business")) throw new Error("A non-published business leaked into the published list!");
  if (!publishedSlugs.includes("software-house") || !publishedSlugs.includes("law-firm")) throw new Error("Expected published slugs missing!");

  console.log("\n=== Step 3: isRoadmapJsonShape correctly rejects the ai-automation-agency-style shape ===");
  const brokenShapeRaw = readJson<unknown>(path.join(technologyDir, "broken-shape-business", "roadmap.json"));
  const realShapeRaw = readJson<unknown>(path.join(technologyDir, "software-house", "roadmap.json"));
  console.log(`broken-shape-business recognized as roadmap shape: ${isRoadmapJsonShape(brokenShapeRaw)} (expected false)`);
  console.log(`software-house recognized as roadmap shape: ${isRoadmapJsonShape(realShapeRaw)} (expected true)`);
  if (isRoadmapJsonShape(brokenShapeRaw)) throw new Error("isRoadmapJsonShape incorrectly accepted the incompatible shape!");
  if (!isRoadmapJsonShape(realShapeRaw)) throw new Error("isRoadmapJsonShape incorrectly rejected a real roadmap.json!");

  console.log("\n=== Step 4: retry-once on a validation failure, then succeeds ===");
  mockResponseQueue = ['{"newItems": [{"en": "too short"}]}', mockNewItemsResponse(8, "retry-success")];
  installMockOpenAi();
  const retryResult = await generateNewChecklistItems({
    businessName: "Test Business",
    businessTagline: "Testing.",
    blueprintExcerpt: "A test business.",
    stage: "preparation",
    objectives: ["Objective 1"],
    deliverables: ["Deliverable 1"],
    existingChecklist: ["Existing item 1"],
    newItemsNeeded: 8,
  });
  restoreOpenAi();
  console.log(`Retry-once succeeded: got ${retryResult.length} items (expected 8) after 1 failed + 1 successful call`);
  if (retryResult.length !== 8) throw new Error("Retry-once didn't recover correctly!");

  console.log("\n=== Step 5: both attempts fail -> throws (no silent swallow) ===");
  mockResponseQueue = ["not json at all", "still not json"];
  installMockOpenAi();
  let threw = false;
  try {
    await generateNewChecklistItems({
      businessName: "Test Business",
      businessTagline: "Testing.",
      blueprintExcerpt: "",
      stage: "validation",
      objectives: [],
      deliverables: [],
      existingChecklist: ["Existing item 1"],
      newItemsNeeded: 8,
    });
  } catch {
    threw = true;
  }
  restoreOpenAi();
  console.log(`Both attempts failing correctly throws: ${threw}`);
  if (!threw) throw new Error("Expected generateNewChecklistItems to throw when both attempts fail!");

  console.log("\n=== Step 6: the Romanian-copies-English defensive check rejects and retries ===");
  mockResponseQueue = [
    JSON.stringify({ newItems: Array.from({ length: 8 }, (_, i) => ({ en: `Same text ${i}`, ro: `Same text ${i}` })) }),
    mockNewItemsResponse(8, "recovered"),
  ];
  installMockOpenAi();
  const langCheckResult = await generateNewChecklistItems({
    businessName: "Test Business",
    businessTagline: "Testing.",
    blueprintExcerpt: "",
    stage: "mvp",
    objectives: [],
    deliverables: [],
    existingChecklist: ["Existing item 1"],
    newItemsNeeded: 8,
  });
  restoreOpenAi();
  console.log(`Romanian-copies-English response rejected and retried successfully: ${langCheckResult[0]?.en.startsWith("recovered")}`);
  if (!langCheckResult[0]?.en.startsWith("recovered")) throw new Error("Defensive language check didn't trigger a retry!");

  console.log("\n=== Step 7: --dry-run writes nothing to disk ===");
  const roadmapPathSoftwareHouse = path.join(technologyDir, "software-house", "roadmap.json");
  const beforeDryRun = readFileSync(roadmapPathSoftwareHouse, "utf-8");
  const beforeMessagesEn = readFileSync(messagesEnPath, "utf-8");

  mockResponseQueue = Array.from({ length: 10 }, () => mockNewItemsResponse(8, "dry-run"));
  installMockOpenAi();
  const dryRunResult = await runExpansion({
    technologyDir,
    manifestPath,
    messagesEnPath,
    messagesRoPath,
    dryRun: true,
    onlyBusinessSlug: "software-house",
    delayMs: 0,
  });
  restoreOpenAi();

  const afterDryRun = readFileSync(roadmapPathSoftwareHouse, "utf-8");
  const afterMessagesEn = readFileSync(messagesEnPath, "utf-8");
  console.log(`Dry run reported ${dryRunResult.totalNewItems} new items (expected 80, 8 per stage x 10 stages) but wrote 0 files`);
  console.log(`roadmap.json unchanged on disk: ${beforeDryRun === afterDryRun}, messages/en.json unchanged on disk: ${beforeMessagesEn === afterMessagesEn}`);
  if (dryRunResult.totalNewItems !== 80) throw new Error(`Expected dry run to report 80 new items, got ${dryRunResult.totalNewItems}!`);
  if (beforeDryRun !== afterDryRun) throw new Error("Dry run wrote to roadmap.json on disk!");
  if (beforeMessagesEn !== afterMessagesEn) throw new Error("Dry run wrote to messages/en.json on disk!");

  console.log("\n=== Step 8: --business= scoping — a real (non-dry-run) write only touches the targeted business ===");
  const roadmapPathLawFirm = path.join(technologyDir, "law-firm", "roadmap.json");
  const lawFirmBefore = readFileSync(roadmapPathLawFirm, "utf-8");

  mockResponseQueue = Array.from({ length: 10 }, () => mockNewItemsResponse(8, "live-run"));
  installMockOpenAi();
  const liveRunResult = await runExpansion({
    technologyDir,
    manifestPath,
    messagesEnPath,
    messagesRoPath,
    dryRun: false,
    onlyBusinessSlug: "software-house",
    delayMs: 0,
  });
  restoreOpenAi();

  const lawFirmAfter = readFileSync(roadmapPathLawFirm, "utf-8");
  console.log(`Live run (scoped to software-house) reported ${liveRunResult.totalNewItems} new items; law-firm's roadmap.json untouched: ${lawFirmBefore === lawFirmAfter}`);
  if (lawFirmBefore !== lawFirmAfter) throw new Error("--business= scoping leaked a write into a different business!");

  const softwareHouseAfter = readJson<RoadmapJson>(roadmapPathSoftwareHouse);
  const preparationStage = softwareHouseAfter.stages.find((s) => s.stage === "preparation")!;
  console.log(`software-house/preparation checklist now has ${preparationStage.checklistTranslationKeys.length} items (expected 9: 1 original + 8 new)`);
  if (preparationStage.checklistTranslationKeys.length !== 9) throw new Error("Expected the live run to bring preparation's checklist to 9 items!");
  if (preparationStage.checklistTranslationKeys[0] !== "businessLibrary.softwareHouse.roadmap.preparation.checklist.0") {
    throw new Error("The ORIGINAL checklist item's key was disturbed — expansion must only append, never rewrite existing entries!");
  }

  const messagesEnAfter = readJson<MessagesTree>(messagesEnPath);
  const newItemText = resolveText(messagesEnAfter, "businessLibrary.softwareHouse.roadmap.preparation.checklist.1");
  console.log(`New checklist item's English text resolves correctly: "${newItemText}"`);
  if (!newItemText?.startsWith("live-run mock new checklist item")) throw new Error("New checklist item text wasn't written to messages/en.json correctly!");
  const messagesRoAfter = readJson<MessagesTree>(messagesRoPath);
  const newItemTextRo = resolveText(messagesRoAfter, "businessLibrary.softwareHouse.roadmap.preparation.checklist.1");
  console.log(`New checklist item's Romanian text resolves correctly: "${newItemTextRo}"`);
  if (!newItemTextRo) throw new Error("New checklist item text wasn't written to messages/ro.json correctly!");

  console.log("\n=== Step 9: re-running against an already-expanded stage is a no-op (skipped, not duplicated) ===");
  mockResponseQueue = []; // if the mock queue is called at all, the test fails loudly (queue exhausted)
  installMockOpenAi();
  const secondRunResult = await runExpansion({
    technologyDir,
    manifestPath,
    messagesEnPath,
    messagesRoPath,
    dryRun: false,
    onlyBusinessSlug: "software-house",
    delayMs: 0,
  });
  restoreOpenAi();
  console.log(`Second run against the same (now-expanded) business reported ${secondRunResult.totalNewItems} new items (expected 0 — every stage already has 9)`);
  if (secondRunResult.totalNewItems !== 0) throw new Error("Re-running against an already-expanded business should be a no-op!");

  console.log("\n=== Step 10: expandBusiness skips a stage with no existing checklist item rather than guessing a key prefix ===");
  const syntheticRoadmap: RoadmapJson = {
    stages: [
      { stage: "preparation", objectiveTranslationKeys: [], deliverableTranslationKeys: [], checklistTranslationKeys: [] },
    ],
  };
  const syntheticMessagesEn: MessagesTree = {};
  const syntheticMessagesRo: MessagesTree = {};
  const syntheticResult = await expandBusiness({
    slug: "software-house",
    technologyDir,
    roadmapJson: syntheticRoadmap,
    messagesEn: syntheticMessagesEn,
    messagesRo: syntheticMessagesRo,
    delayMs: 0,
  });
  console.log(`Stage with 0 existing checklist items: ${syntheticResult.stageSummaries[0]}`);
  if (syntheticResult.newItemCount !== 0) throw new Error("A stage with no existing checklist item should be skipped, not guessed at!");

  console.log("\n=== Step 11: untouched JSON formatting survives a read-modify-write round trip ===");
  // Prove the write-back approach (JSON.parse -> mutate -> JSON.stringify(x, null, 2) + "\n")
  // doesn't incidentally reformat content it never touched, by round-tripping WITHOUT any
  // mutation and diffing byte-for-byte against the original.
  const roundTripSource = readFileSync(path.join(technologyDir, "law-firm", "roadmap.json"), "utf-8");
  const roundTripped = JSON.stringify(JSON.parse(roundTripSource), null, 2) + "\n";
  console.log(`Unmodified read-modify-write round trip is byte-for-byte identical: ${roundTripSource === roundTripped}`);
  if (roundTripSource !== roundTripped) {
    console.warn("NOTE: the real roadmap.json files are not byte-identical after an unmodified JSON.stringify(x, null, 2) round trip — a real run will produce a larger mechanical diff than just the new lines. Worth reviewing carefully.");
  }

  console.log("\n=== Cleanup ===");
  rmSync(tempDir, { recursive: true, force: true });
  console.log(`Removed temp directory: ${tempDir}`);
  // Sanity check the real files were genuinely never touched.
  const realStatEn = statSync(REAL_MESSAGES_EN_PATH);
  const realStatRo = statSync(REAL_MESSAGES_RO_PATH);
  console.log(`Real messages/en.json mtime: ${realStatEn.mtime.toISOString()}, messages/ro.json mtime: ${realStatRo.mtime.toISOString()} (verify these predate this run if in doubt)`);

  console.log("\n✅ All expand-roadmap-checklists script checks passed.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
