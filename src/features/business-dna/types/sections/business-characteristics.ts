/**
 * Section 8 — Business Characteristics. The epic asks for "17
 * boolean/enum flags as listed" but the prompt this feature was built
 * from did not actually enumerate all 17 by name (unlike Skill DNA's 12
 * keys, which were spelled out). The 17 below are this implementation's
 * own reasonable design, chosen to (a) mostly derive from ratings
 * business-library already has, turned into simple checklist-style
 * flags, and (b) flag the handful that are genuinely new. Each field's
 * docstring says which of the two it is — this is a judgement call, not
 * a verbatim spec, and is called out as such in the top-level README.
 */
export interface BusinessCharacteristics {
  /** Derived from `lifestyle.workMode !== "inPerson"` (business-library §21). */
  isRemoteFriendly: boolean;
  /** Derived from `lifestyle.workMode === "remote"` (§21). */
  isFullyRemote: boolean;
  /** Derived from `lifestyle.travelRequirement !== "none"` (§21). */
  requiresTravel: boolean;
  /** Derived from `lifestyle.onlineOffline` (§21). */
  isOnlineBusiness: boolean;
  /** Derived from `lifestyle.salesChannel` (§21) — NOT the Knowledge Engine's `SalesMethods` domain, a different concept (who vs. how a sale happens). */
  isB2B: boolean;
  /** Derived from `lifestyle.salesChannel` (§21). */
  isB2C: boolean;
  /** Derived from `teamSize.atLaunch === "solo"` (§22). */
  isSoloFounderFriendly: boolean;
  /** Derived from `teamSize.atLaunch !== "solo"` (§22). */
  requiresEmployees: boolean;
  /** Derived from `scalability.level === "high"` (§13). */
  isHighlyScalable: boolean;
  /** Derived from `automation.level === "high"` (§14). */
  isHighlyAutomatable: boolean;
  /** Derived from `aiResistance.level === "high"` (§15). */
  isAIResistant: boolean;
  /** Derived from `locationDependency.level !== "none"` (§20). */
  requiresPhysicalLocation: boolean;
  /** Derived from `businessModel.primary === "subscription"` or `.secondary` including it (§5). */
  isSubscriptionBased: boolean;
  /** Derived from `budget` (§10), but the "intensive" threshold is this section's own judgement call, not a business-library field. */
  isCapitalIntensive: boolean;
  /** GENUINELY NEW — no business-library equivalent. */
  requiresInventory: boolean;
  /** GENUINELY NEW — no business-library equivalent. */
  isSeasonalBusiness: boolean;
  /** GENUINELY NEW — loosely related to `exitPotential.typicalPaths` (§36) but that's about exit, not franchising as an operating model. */
  isFranchisable: boolean;
  /** GENUINELY NEW — no business-library equivalent. */
  isRecessionResistant: boolean;
}
