import "server-only";
import type {
  BusinessMarketingTemplate,
  BusinessFinancialTemplate,
  BusinessLaunchTemplate,
} from "@prisma/client";
import { db } from "@/lib/db";
import type {
  BusinessMarketingTemplateInput,
  BusinessFinancialTemplateInput,
  BusinessLaunchTemplateInput,
} from "../schemas/templates";
import type { BusinessTypeTemplateBundle } from "../types/templates";
import { blueprintRepository } from "./blueprint-repository";

/**
 * Covers the three generation templates other than the Blueprint (see
 * blueprint-repository.ts for that one), plus `getBundle`, which is what
 * the future document generators should actually call — it fetches all
 * four skeletons for a BusinessType in one pass.
 */
export interface TemplateRepository {
  findMarketingTemplate(businessTypeId: string): Promise<BusinessMarketingTemplate | null>;
  findFinancialTemplate(businessTypeId: string): Promise<BusinessFinancialTemplate | null>;
  findLaunchTemplate(businessTypeId: string): Promise<BusinessLaunchTemplate | null>;
  upsertMarketingTemplate(input: BusinessMarketingTemplateInput): Promise<BusinessMarketingTemplate>;
  upsertFinancialTemplate(input: BusinessFinancialTemplateInput): Promise<BusinessFinancialTemplate>;
  upsertLaunchTemplate(input: BusinessLaunchTemplateInput): Promise<BusinessLaunchTemplate>;
  getBundle(businessTypeId: string): Promise<BusinessTypeTemplateBundle>;
}

class PrismaTemplateRepository implements TemplateRepository {
  async findMarketingTemplate(businessTypeId: string) {
    return db.businessMarketingTemplate.findUnique({ where: { businessTypeId } });
  }

  async findFinancialTemplate(businessTypeId: string) {
    return db.businessFinancialTemplate.findUnique({ where: { businessTypeId } });
  }

  async findLaunchTemplate(businessTypeId: string) {
    return db.businessLaunchTemplate.findUnique({ where: { businessTypeId } });
  }

  async upsertMarketingTemplate(input: BusinessMarketingTemplateInput) {
    return db.businessMarketingTemplate.upsert({
      where: { businessTypeId: input.businessTypeId },
      update: { channelTypes: input.channelTypes, promptContext: input.promptContext },
      create: {
        businessTypeId: input.businessTypeId,
        channelTypes: input.channelTypes,
        promptContext: input.promptContext,
      },
    });
  }

  async upsertFinancialTemplate(input: BusinessFinancialTemplateInput) {
    return db.businessFinancialTemplate.upsert({
      where: { businessTypeId: input.businessTypeId },
      update: {
        lineItemCategories: input.lineItemCategories,
        assumptionsSchema: input.assumptionsSchema,
      },
      create: {
        businessTypeId: input.businessTypeId,
        lineItemCategories: input.lineItemCategories,
        assumptionsSchema: input.assumptionsSchema,
      },
    });
  }

  async upsertLaunchTemplate(input: BusinessLaunchTemplateInput) {
    return db.businessLaunchTemplate.upsert({
      where: { businessTypeId: input.businessTypeId },
      update: { milestones: input.milestones },
      create: { businessTypeId: input.businessTypeId, milestones: input.milestones },
    });
  }

  async getBundle(businessTypeId: string): Promise<BusinessTypeTemplateBundle> {
    const [blueprint, marketing, financial, launch] = await Promise.all([
      blueprintRepository.findByBusinessTypeId(businessTypeId),
      this.findMarketingTemplate(businessTypeId),
      this.findFinancialTemplate(businessTypeId),
      this.findLaunchTemplate(businessTypeId),
    ]);

    return { blueprint, marketing, financial, launch };
  }
}

export const templateRepository: TemplateRepository = new PrismaTemplateRepository();
