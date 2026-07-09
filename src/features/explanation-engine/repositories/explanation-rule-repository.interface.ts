import type { RuleCondition } from "@/features/matching-engine/rules/rule-types";
import type { BusinessGenome } from "../dto/explanation-engine-input.dto";

/**
 * A custom, data-driven rule for how an explanation should be phrased or
 * emphasized — mirrors `MatchingRule` in
 * matching-engine/rules/rule-types.ts (conditions as data, not code) but
 * for explanation *content* rather than match *scoring*. Reuses
 * `RuleCondition`/`RuleOperator` rather than redefining a parallel
 * condition shape.
 */
export interface ExplanationRule {
  id: string;
  /** Translation key for the explanation text this rule contributes when it fires. */
  translationKey: string;
  /** Restrict this rule to one industry — see BusinessGenome.industry.primary. Undefined applies to all industries. */
  appliesToIndustry?: BusinessGenome["industry"]["primary"];
  /** All conditions must hold (AND) for this rule to fire. */
  conditions: RuleCondition[];
  isActive: boolean;
}

/**
 * Pure data access contract for future custom, industry-aware explanation
 * rules — the "Custom business rules" and "Industry-specific
 * explanations" extension points described in ../README.md. No
 * implementation exists yet; nothing calls this.
 */
export interface ExplanationRuleRepository {
  listActiveRules(filters?: { industry?: BusinessGenome["industry"]["primary"] }): Promise<ExplanationRule[]>;
}
