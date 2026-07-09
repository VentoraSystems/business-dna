import type { Resources } from "../types/resources";

/** Input to update an existing Resources document — partial at the top level, same granularity as the other Business Assets UpdateDtos. */
export type ResourcesUpdateDto = Partial<Resources>;
