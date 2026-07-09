import type { Roadmap } from "../types/roadmap";

/** Input to update an existing Roadmap — partial at the top level, same granularity as the other Business Assets UpdateDtos. */
export type RoadmapUpdateDto = Partial<Roadmap>;
