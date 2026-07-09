import type { FinancialCreateDto, FinancialDto, FinancialUpdateDto } from "../dto";

/** Full CRUD data-access contract for `Financial`, keyed by `businessTypeId` — mirrors `BusinessFinancialTemplate`'s repository shape in business-engine. */
export interface FinancialRepository {
  findByBusinessTypeId(businessTypeId: string): Promise<FinancialDto | null>;
  list(): Promise<FinancialDto[]>;
  create(businessTypeId: string, input: FinancialCreateDto): Promise<FinancialDto>;
  update(businessTypeId: string, input: FinancialUpdateDto): Promise<FinancialDto | null>;
  delete(businessTypeId: string): Promise<boolean>;
}
