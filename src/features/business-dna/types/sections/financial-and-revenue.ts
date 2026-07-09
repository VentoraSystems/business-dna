import type {
  BusinessGenomeBudget,
  BusinessGenomeFinancialInformation,
  BusinessGenomeProfitMargin,
  BusinessGenomeRevenueSpeed,
} from "../reused-from-business-library";

/**
 * Section 3 — Financial DNA. Full reuse of business-library's `budget`
 * (§10) and `financialInformation` (§24) — the cost/investment side of
 * a business's finances.
 */
export interface FinancialDna {
  budget: BusinessGenomeBudget;
  financialInformation: BusinessGenomeFinancialInformation;
}

/**
 * Section 4 — Revenue DNA. Full reuse of business-library's
 * `revenueSpeed` (§11) and `profitMargin` (§12) — the revenue-side
 * counterpart to Financial DNA. Deliberately does NOT repeat
 * `financialInformation.revenueStreams` here — that itemized array
 * lives once, under `FinancialDna.financialInformation`, and this
 * section's ratings summarize it rather than duplicating it.
 */
export interface RevenueDna {
  revenueSpeed: BusinessGenomeRevenueSpeed;
  profitMargin: BusinessGenomeProfitMargin;
}
