# Financial — architecture

`features/financial` is the authoring framework for the **Financial**
document — 18 sections, schemas/templates/validation only. No forecasts,
no calculations, no invented figures. See
[`features/business-dna/README.md`](../business-dna/README.md) and
[`features/blueprint/README.md`](../blueprint/README.md) (whose
"Financial Overview" section aliases business-dna's `FinancialDna`
directly — this feature is the expanded, section-by-section authoring
surface behind that summary).

## Purpose

A Financial document is the detailed cost/revenue assumption set behind
one BusinessType's plan — the third generator in the pipeline below.
`templates/empty-financial.json` is the "fill in the blanks" starting
point, mirroring `business-library/technology/ai-automation-agency/financial.json`'s
own empty template from the prior sprint (which itself already mirrors
`BusinessFinancialTemplate`).

## Pipeline

```
Business Library → Business DNA Profile → Matching Engine → Blueprint → Marketing → Financial → AI Co-Founder
                                                                                        ↑ this feature
```

## Reuse table

| Section | Reuses from | Genuinely new | Conflict to flag |
|---|---|---|---|
| 1. Startup Costs | `lineItemCategories` pattern — `BusinessFinancialTemplate` (business-engine) | Wrapper shape | — |
| 2. Monthly Fixed Costs | same | Wrapper shape | — |
| 3. Variable Costs | same | Wrapper shape | — |
| 4. Revenue Streams | `RevenueStreamItem` — business-dna's `FinancialDna.financialInformation.revenueStreams` item shape (via indexed-access type, not a redeclared interface) | Wrapper shape | Zod validation mirrors this shape structurally rather than importing business-library's `revenueStreamSchema` directly — this feature wasn't granted business-dna's business-library import exception; see `schemas/sections.schema.ts` |
| 5. Pricing Assumptions | `assumptionsSchema` pattern — `BusinessFinancialTemplate` | Wrapper shape | — |
| 6. Revenue Forecast | same `assumptionsSchema` pattern | Wrapper shape | No calculation — structural placeholder only |
| 7. Cash Flow | `lineItemCategories` pattern | Wrapper shape | — |
| 8. Break-even | — | The whole section | Structural estimate field only, never computed |
| 9. Gross Margin | — | The whole section | Same |
| 10. Net Margin | — | The whole section | Same |
| 11. Hiring Costs | `lineItemCategories` pattern | Wrapper shape | — |
| 12. Marketing Budget | `lineItemCategories` pattern | Wrapper shape | — |
| 13. Taxes | `lineItemCategories` pattern | Wrapper shape | — |
| 14. Emergency Reserve | `lineItemCategories` pattern | Wrapper shape | — |
| 15. Financial KPIs | `kpis` (`BusinessDnaKpiKey[]`, business-dna's fixed enum) | Wrapper shape | — |
| 16. Scenarios | — | The whole section (conservative/expected/optimistic) | Every scenario is a structural placeholder, never a computed projection |
| 17. Financial Risks | — | The whole section | Not the same as business-dna's `RiskDna` (the general business risk section, reused by `features/blueprint`'s "Risks") — kept distinct since this epic didn't name it as a cross-reference target |
| 18. AI Metadata | Same *pattern* as business-dna's/blueprint's AI Metadata | The field set itself | Independently defined, same reasoning as `features/blueprint`'s `BlueprintAiMetadata` |

## Shared export added

`financialAssumptionTypeSchema` in
`src/features/business-engine/schemas/templates.ts` was module-private
(no `export` keyword) — it now has one, plus a
`FinancialAssumptionType` type export, so this feature can reuse the
exact `"number"|"percent"|"currency"` vocabulary instead of redeclaring
it. No other change to that file.

## Architecture notes

- **No `services/` folder** — same reasoning as `features/blueprint`.
- **`InMemoryFinancialRepository` is an empty in-memory stub**, not a
  throwing placeholder — matches features/business-dna's precedent.
- **Keyed by `businessTypeId`**, mirroring `BusinessFinancialTemplate`.

## Tests

`tests/` asserts `templates/empty-financial.json` validates against
`financialSchema`, plus accept/reject cases for malformed DTOs.
