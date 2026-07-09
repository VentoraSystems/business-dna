import type { Marketing } from "../types/marketing";

/** Input to update an existing Marketing document — partial at the section level, same granularity as features/blueprint's UpdateDto. */
export type MarketingUpdateDto = Partial<Marketing>;
