import type {
  BusinessGenomeAIUsage,
  BusinessGenomeAutomation,
  BusinessGenomeOperations,
  BusinessGenomeRecommendedTools,
} from "../reused-from-business-library";

/**
 * Section 13 — Operations DNA. Full reuse of business-library's
 * `operations` (§28) and `automation` (§14).
 */
export interface OperationsDna {
  operations: BusinessGenomeOperations;
  automation: BusinessGenomeAutomation;
}

/**
 * Section 14 — Technology DNA. Full reuse of business-library's
 * `aiUsage` (§32) and `recommendedTools` (§33). `recommendedTools` is
 * the tech-stack list — deliberately NOT duplicated again under Section
 * 19, Resources (see resources.ts), which is scoped to learning/
 * reference material, not software tools.
 */
export interface TechnologyDna {
  aiUsage: BusinessGenomeAIUsage;
  recommendedTools: BusinessGenomeRecommendedTools;
}
