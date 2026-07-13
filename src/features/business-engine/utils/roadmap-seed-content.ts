import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import type { Locale } from "@/i18n/config";
import { RoadmapStageKey, ROADMAP_STAGE_ORDER } from "@/features/roadmap/types/sections";

const BUSINESS_LIBRARY_DIR = path.join(process.cwd(), "business-library", "technology");

/**
 * Bundler-resolved import, not fs.readFileSync — the same fix applied to
 * blueprint-generation-context.ts's loadMessages() for the identical
 * Vercel serverless ENOENT reason (see that file/its commit for the full
 * investigation). roadmap.json itself stays on fs.readFileSync below,
 * same as business-library/** everywhere else — outputFileTracingIncludes
 * in next.config.mjs already covers it (keyed "/**", not per-file).
 */
async function loadMessages(locale: Locale): Promise<Record<string, unknown>> {
  const messages = locale === "en" ? await import("../../../../messages/en.json") : await import("../../../../messages/ro.json");
  return messages.default as Record<string, unknown>;
}

/** Mirrors blueprint-generation-context.ts's resolveTranslationKey exactly. */
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

interface RoadmapJsonStage {
  stage: RoadmapStageKey;
  checklistTranslationKeys: string[];
}

interface RoadmapJson {
  stages: RoadmapJsonStage[];
}

export interface SeedableRoadmapTask {
  stage: RoadmapStageKey;
  /** 1-based position of this stage in ROADMAP_STAGE_ORDER — a simple placeholder timeline bucket, not real duration modeling (business-dna.json's growthDna.milestones has real monthsFromLaunch data a later phase could use instead). */
  month: number;
  /** Index within this stage's checklist array — preserves the source content's authored order. */
  order: number;
  title: string;
}

/**
 * Reads one BusinessType's authored roadmap.json (all 10 stages) and
 * resolves each checklist item's translation key into real text for the
 * given locale — one SeedableRoadmapTask per checklist item, across all
 * stages. Read-only, same convention as readBusinessDisplayContent()/
 * readBlueprintGenerationContext(). Returns [] (not a throw) if the
 * business has no authored roadmap.json — deterministic roadmap seeding
 * is an enrichment, not a hard requirement for adoption to succeed.
 */
export async function readRoadmapSeedTasks(slug: string, locale: Locale): Promise<SeedableRoadmapTask[]> {
  let raw: RoadmapJson;
  try {
    raw = JSON.parse(readFileSync(path.join(BUSINESS_LIBRARY_DIR, slug, "roadmap.json"), "utf-8")) as RoadmapJson;
  } catch {
    return [];
  }

  const messages = await loadMessages(locale);

  const tasks: SeedableRoadmapTask[] = [];
  for (const stageEntry of raw.stages) {
    const month = ROADMAP_STAGE_ORDER.indexOf(stageEntry.stage) + 1;
    stageEntry.checklistTranslationKeys.forEach((key, index) => {
      tasks.push({
        stage: stageEntry.stage,
        month: month > 0 ? month : ROADMAP_STAGE_ORDER.length,
        order: index,
        title: resolveTranslationKey(key, messages),
      });
    });
  }
  return tasks;
}
