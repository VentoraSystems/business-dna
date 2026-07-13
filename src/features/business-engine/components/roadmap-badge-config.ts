import { Footprints, Rocket, Handshake, Flag, Trophy } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { RoadmapBadgeKey } from "@/features/business-engine/actions/roadmap-view";

/**
 * Duplicated from roadmap-progress.ts's ROADMAP_BADGE_KEYS (not imported)
 * deliberately — that module has `import "server-only"` at the top, which
 * breaks if pulled into this client component tree. Both must stay in
 * sync by hand; TypeScript's Record<RoadmapBadgeKey, ...> below at least
 * guarantees this file can't silently drop or misspell a key.
 */
export const ROADMAP_BADGE_KEYS = ["firstStep", "readyToLaunch", "firstCustomer", "halfwayThere", "roadmapComplete"] as const;

export const ROADMAP_BADGE_ICONS: Record<RoadmapBadgeKey, LucideIcon> = {
  firstStep: Footprints,
  readyToLaunch: Rocket,
  firstCustomer: Handshake,
  halfwayThere: Flag,
  roadmapComplete: Trophy,
};
