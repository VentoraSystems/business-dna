import type { LocalizedText } from "../reused-from-business-library";

/**
 * Section 19 — KPIs. GENUINELY NEW as a shape, and deliberately kept
 * distinct from business-library's `kpis` (§34) rather than merged —
 * see README.md's mapping table:
 *
 *  - business-library's `kpis` is an **open-ended array** of
 *    `{ key: string, label: LocalizedText, targetDescription?: LocalizedText }`
 *    — any genome can name any metric.
 *  - This section is a **fixed, closed list** of ten named business
 *    metrics (MRR, ARR, CAC, LTV, Churn, Gross Margin, Net Margin, Lead
 *    Conversion, Close Rate, Customer Retention) — the standardized
 *    metrics this contract expects every Business DNA profile to be
 *    comparable on.
 *
 * These are genuinely different concepts (fixed schema vs. open list),
 * not a subset/superset of each other — a profile is expected to have
 * both: this fixed list for cross-business comparability, and
 * business-library's open list for anything business-specific that
 * doesn't fit the fixed ten.
 */
export enum BusinessDnaKpiKey {
  MRR = "mrr",
  ARR = "arr",
  CAC = "cac",
  LTV = "ltv",
  Churn = "churn",
  GrossMargin = "grossMargin",
  NetMargin = "netMargin",
  LeadConversion = "leadConversion",
  CloseRate = "closeRate",
  CustomerRetention = "customerRetention",
}

export const ALL_BUSINESS_DNA_KPI_KEYS: readonly BusinessDnaKpiKey[] = Object.values(BusinessDnaKpiKey);

export interface BusinessDnaKpiTarget {
  key: BusinessDnaKpiKey;
  targetDescription?: LocalizedText;
}

export interface KpisSection {
  targets: BusinessDnaKpiTarget[];
}
