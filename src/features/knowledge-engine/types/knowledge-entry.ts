import type { KnowledgeDomain } from "./domain";
import type { IndustryType, BusinessModelType, SkillKey } from "./reused-vocabularies";
import type {
  CustomerTypeKey,
  DistributionChannelKey,
  FundingOptionKey,
  LegalStructureKey,
  MarketingChannelKey,
  PricingModelKey,
  RevenueModelKey,
  SalesMethodKey,
} from "./vocabularies";

/**
 * The union of every value `KnowledgeEntry.relatedEnumValue` can hold —
 * only populated for domains backed by a closed vocabulary (the 3 reused
 * ones plus this feature's 8 net-new ones; see ./reused-vocabularies.ts
 * and ./vocabularies.ts). Left `undefined` for the open-catalog domains
 * (Business Tools, AI Tools, Business Risks, KPIs, Growth Strategies,
 * Hiring Strategies, Business Terminology), whose entries are identified
 * by `key` alone.
 */
export type KnowledgeRelatedEnumValue =
  | IndustryType
  | BusinessModelType
  | SkillKey
  | RevenueModelKey
  | CustomerTypeKey
  | PricingModelKey
  | MarketingChannelKey
  | SalesMethodKey
  | DistributionChannelKey
  | LegalStructureKey
  | FundingOptionKey;

/**
 * The one shape every domain's entries share. Deliberately generic
 * rather than one bespoke interface per domain (17+ of them) — see
 * README.md "Why one generic shape" for the reasoning. This is the
 * canonical, internal representation `interfaces/` and `repositories/`
 * operate on; `dto/knowledge-entry.dto.ts` re-exposes it as
 * `KnowledgeEntryDto` for this sprint's requested dto/ + schemas/ split.
 */
export interface KnowledgeEntry {
  id: string;
  domain: KnowledgeDomain;
  /** Stable slug, unique within `domain` (not globally) — e.g. domain=BusinessTools, key="notion". */
  key: string;
  /** Points into messages/*.json — no inline prose lives on this type, same convention business-library uses for genome text. */
  translationKey: string;
  /** Cross-domain references to other entries' `key` values — e.g. a Legal Structures entry relating to a Funding Options entry. */
  relatedEntryKeys: string[];
  /** Populated only for domains backed by a closed vocabulary — see KnowledgeRelatedEnumValue. */
  relatedEnumValue?: KnowledgeRelatedEnumValue;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}
