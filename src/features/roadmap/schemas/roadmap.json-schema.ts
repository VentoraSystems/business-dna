import { zodToJsonSchema } from "zod-to-json-schema";
import { roadmapSchema } from "./roadmap.schema";

/** Standard json-schema.org (draft-07) export for the top-level Roadmap shape — same approach the other Business Assets features took. */
export function generateRoadmapJsonSchema() {
  return zodToJsonSchema(roadmapSchema, "Roadmap");
}
