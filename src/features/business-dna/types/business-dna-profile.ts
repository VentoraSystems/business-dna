import type {
  AiMetadata,
  BlueprintReferences,
  BusinessCharacteristics,
  BusinessLifecycle,
  EntrepreneurDnaMatch,
  FinancialDna,
  FounderFit,
  GrowthDna,
  Identity,
  KpisSection,
  LifestyleDna,
  MarketingDna,
  OperationsDna,
  ResourcesSection,
  RevenueDna,
  RiskDna,
  SalesDna,
  ScalabilityDna,
  SkillDna,
  SuccessDna,
  TechnologyDna,
} from "./sections";

/**
 * The canonical runtime model — all 21 sections. See README.md's mapping
 * table for how each section relates to business-library/schema.ts, and
 * ../interfaces/business-genome-mapper.ts for the (not yet implemented)
 * `fromBusinessGenome()` adapter that would eventually produce one of
 * these from a validated `BusinessGenome`.
 */
export interface BusinessDnaProfile {
  /** 1. */
  identity: Identity;
  /** 2. */
  founderFit: FounderFit;
  /** 3. */
  financialDna: FinancialDna;
  /** 4. */
  revenueDna: RevenueDna;
  /** 5. */
  lifestyleDna: LifestyleDna;
  /** 6. */
  skillDna: SkillDna;
  /** 7. */
  entrepreneurDnaMatch: EntrepreneurDnaMatch;
  /** 8. */
  businessCharacteristics: BusinessCharacteristics;
  /** 9. */
  scalabilityDna: ScalabilityDna;
  /** 10. */
  riskDna: RiskDna;
  /** 11. */
  marketingDna: MarketingDna;
  /** 12. */
  salesDna: SalesDna;
  /** 13. */
  operationsDna: OperationsDna;
  /** 14. */
  technologyDna: TechnologyDna;
  /** 15. */
  growthDna: GrowthDna;
  /** 16. */
  successDna: SuccessDna;
  /** 17. */
  blueprintReferences: BlueprintReferences;
  /** 18. */
  resources: ResourcesSection;
  /** 19. */
  kpis: KpisSection;
  /** 20. */
  aiMetadata: AiMetadata;
  /** 21. */
  businessLifecycle: BusinessLifecycle;
}
