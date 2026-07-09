import type { ResourceItem, ResourcesAiMetadata } from "./sections";

/** Top-level Resources document — a flat, categorized resource list plus AI Metadata. */
export interface Resources {
  resources: ResourceItem[];
  aiMetadata: ResourcesAiMetadata;
}
