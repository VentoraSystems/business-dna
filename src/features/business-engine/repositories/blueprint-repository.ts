import "server-only";
import type { BusinessBlueprintTemplate } from "@prisma/client";
import { db } from "@/lib/db";
import type { BusinessBlueprintTemplateInput } from "../schemas/templates";

/**
 * Named distinctly from the Marketing/Financial/Launch templates (see
 * template-repository.ts) because the Business Plan is the primary
 * document BusinessDNA generates — everything else builds on it. This
 * repository only manages the *skeleton*: which sections exist for a given
 * BusinessType, not their generated content.
 */
export interface BlueprintRepository {
  findByBusinessTypeId(businessTypeId: string): Promise<BusinessBlueprintTemplate | null>;
  upsert(input: BusinessBlueprintTemplateInput): Promise<BusinessBlueprintTemplate>;
  delete(businessTypeId: string): Promise<void>;
}

class PrismaBlueprintRepository implements BlueprintRepository {
  async findByBusinessTypeId(businessTypeId: string) {
    return db.businessBlueprintTemplate.findUnique({ where: { businessTypeId } });
  }

  async upsert(input: BusinessBlueprintTemplateInput) {
    return db.businessBlueprintTemplate.upsert({
      where: { businessTypeId: input.businessTypeId },
      update: { sections: input.sections, promptContext: input.promptContext },
      create: {
        businessTypeId: input.businessTypeId,
        sections: input.sections,
        promptContext: input.promptContext,
      },
    });
  }

  async delete(businessTypeId: string) {
    await db.businessBlueprintTemplate.delete({ where: { businessTypeId } });
  }
}

export const blueprintRepository: BlueprintRepository = new PrismaBlueprintRepository();
