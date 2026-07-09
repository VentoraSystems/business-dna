import type { IndustryType, ResourceItem } from "./reused";

/**
 * The 16 Business Insights sections (15 content sections + AI Metadata).
 * This feature captures qualitative/narrative "soft knowledge" that does
 * NOT belong inside the structured, strictly-typed Business DNA Profile
 * (`features/business-dna`) — see README.md's "Purpose" section. Every
 * narrative field is a `translationKey` (points into messages/*.json) —
 * no inline prose, per this sprint's convention.
 */

/**
 * The base shape shared by most sections below. `relatedResources` is
 * optional and reuses `features/resources`' `ResourceItem` rather than
 * inventing a parallel resource taxonomy, per this epic's explicit
 * reuse rule.
 */
export interface InsightItem {
  titleTranslationKey: string;
  detailTranslationKey?: string;
  relatedResources?: ResourceItem[];
}

/** Used by sections that need to be scoped to a real industry rather than applying universally. */
export interface IndustryScopedInsightItem extends InsightItem {
  industry?: IndustryType;
}

/** 1. Hidden Opportunities */
export interface HiddenOpportunities {
  items: InsightItem[];
}

/** 2. Hidden Risks */
export interface HiddenRisks {
  items: InsightItem[];
}

/** 3. Common Mistakes */
export interface CommonMistakes {
  items: InsightItem[];
}

/** 4. Fastest Wins */
export interface FastestWins {
  items: InsightItem[];
}

/** 5. Scaling Advice */
export interface ScalingAdvice {
  items: InsightItem[];
}

/** 6. Founder Advice */
export interface FounderAdvice {
  items: InsightItem[];
}

/** 7. Patterns */
export interface Patterns {
  items: InsightItem[];
}

/** 8. Industry Secrets — industry-scoped, cross-references business-engine's IndustryType rather than inventing a new industry list. */
export interface IndustrySecrets {
  items: IndustryScopedInsightItem[];
}

/** 9. Hidden Costs */
export interface HiddenCosts {
  items: InsightItem[];
}

/** 10. Market Signals — industry-scoped, same reasoning as Industry Secrets. */
export interface MarketSignals {
  items: IndustryScopedInsightItem[];
}

/** 11. Success Stories */
export interface SuccessStories {
  items: InsightItem[];
}

/** 12. Failure Stories */
export interface FailureStories {
  items: InsightItem[];
}

/** 13. Frequently Asked Questions — its own item shape (question/answer), not the generic InsightItem. */
export interface FaqItem {
  questionTranslationKey: string;
  answerTranslationKey?: string;
}
export interface FrequentlyAskedQuestions {
  items: FaqItem[];
}

/** 14. Myths — its own item shape (myth/fact), not the generic InsightItem. */
export interface MythItem {
  mythTranslationKey: string;
  factTranslationKey?: string;
}
export interface Myths {
  items: MythItem[];
}

/** 15. Best Practices */
export interface BestPractices {
  items: InsightItem[];
}

/**
 * 16. AI Metadata — independently defined, same pattern as the other
 * Business Assets features' AI Metadata (a bundle of translationKey
 * hints), different field set by design intent.
 */
export interface BusinessInsightsAiMetadata {
  generationHintsTranslationKey?: string;
  explanationHintsTranslationKey?: string;
  matchingHintsTranslationKey?: string;
}
