import type { FinancialDto } from "../dto/financial.dto";

/** Read-only query surface future consumers should import against instead of the full CRUD `FinancialRepository`. Keyed by `businessTypeId`, mirroring `BusinessFinancialTemplate` (business-engine). */
export interface FinancialSource {
  getByBusinessTypeId(businessTypeId: string): Promise<FinancialDto | null>;
  list(): Promise<FinancialDto[]>;
}
