import type { RoadmapAiMetadata, RoadmapStage } from "./sections";

/** Top-level Roadmap document — the 9-stage list plus AI Metadata. */
export interface Roadmap {
  stages: RoadmapStage[];
  aiMetadata: RoadmapAiMetadata;
}
