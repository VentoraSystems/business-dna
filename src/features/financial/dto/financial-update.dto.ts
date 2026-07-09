import type { Financial } from "../types/financial";

/** Input to update an existing Financial document — partial at the section level. */
export type FinancialUpdateDto = Partial<Financial>;
