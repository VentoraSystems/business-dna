import type { Blueprint } from "../types/blueprint";

/** Input to update an existing Blueprint — partial at the section level, same granularity as features/business-dna's UpdateDto. */
export type BlueprintUpdateDto = Partial<Blueprint>;
