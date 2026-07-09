import type { FinancialCreateDto, FinancialDto, FinancialUpdateDto } from "../dto";
import type { FinancialRepository } from "./financial-repository.interface";

/**
 * An EMPTY, in-memory stub — matches features/business-dna's precedent
 * (no Prisma table, no seeded content this sprint — see that feature's
 * README for the full reasoning this mirrors).
 */
export class InMemoryFinancialRepository implements FinancialRepository {
  private readonly store = new Map<string, FinancialDto>();

  async findByBusinessTypeId(businessTypeId: string): Promise<FinancialDto | null> {
    return this.store.get(businessTypeId) ?? null;
  }

  async list(): Promise<FinancialDto[]> {
    return Array.from(this.store.values());
  }

  async create(businessTypeId: string, input: FinancialCreateDto): Promise<FinancialDto> {
    this.store.set(businessTypeId, input);
    return input;
  }

  async update(businessTypeId: string, input: FinancialUpdateDto): Promise<FinancialDto | null> {
    const existing = this.store.get(businessTypeId);
    if (!existing) return null;
    const updated: FinancialDto = { ...existing, ...input };
    this.store.set(businessTypeId, updated);
    return updated;
  }

  async delete(businessTypeId: string): Promise<boolean> {
    return this.store.delete(businessTypeId);
  }
}

export const financialRepository: FinancialRepository = new InMemoryFinancialRepository();
