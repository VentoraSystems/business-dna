# Blueprint — architecture

`features/blueprint` is the authoring framework for the **Business
Blueprint** document — 21 sections, schemas/templates/validation only.
No content generation, no invented values, no AI. See
[`features/business-dna/README.md`](../business-dna/README.md) for the
canonical runtime contract this feature draws several sections from, and
[`business-library/README.md`](../../../business-library/README.md) for
where a real Blueprint would eventually be authored
(`technology/<slug>/blueprint.md`, already scaffolded as an empty
template last sprint).

## Purpose

A Blueprint is the human-readable business plan document generated for
one BusinessType — the first of the four generators in the pipeline
below. This sprint defines its shape only: `templates/empty-blueprint.json`
and `templates/empty-blueprint.md` are the "fill in the blanks" starting
points, mirroring `business-library/technology/ai-automation-agency/`'s
own empty `blueprint.md` from the prior sprint.

## Pipeline

```
Business Library → Business DNA Profile → Matching Engine → Blueprint → Marketing → Financial → AI Co-Founder
                                                                  ↑ this feature
```

Once a real Matching Engine produces a `CompatibilityResult` for a
person against a Business DNA Profile, a future Blueprint Generator
would read `financialDna`/`marketingDna`/`riskDna`/`successDna`/
`resources`/`aiMetadata.blueprintHints` off that profile (see the reuse
table below for exactly which fields) to populate this document — no
such generator exists yet.

## Reuse table

| Section | Reuses from | Genuinely new | Conflict to flag |
|---|---|---|---|
| 1. Executive Summary | `businessModel` (`BusinessModelType`, business-engine), `revenueType` (`RevenueModelKey`, knowledge-engine) | The section itself — a lightweight snapshot, not importing Financial DNA's full budget shape | — |
| 2. Business Overview | `industry` (`IndustryType`, business-engine) | The section itself | — |
| 3. Founder Fit | **Full reuse** — `business-dna`'s `FounderFit` (type alias, not redeclared) | — | — |
| 4. Market | — | The whole section | — |
| 5. Ideal Customer | `customerType` (`CustomerTypeKey`, knowledge-engine) | The section itself | — |
| 6. Offer | — | The whole section | — |
| 7. Pricing | `pricingModel` (`PricingModelKey`, knowledge-engine) | The section itself | — |
| 8. Revenue | `revenueModel` (`RevenueModelKey`, knowledge-engine) | The section itself | — |
| 9. Marketing | **Full reuse** — `business-dna`'s `MarketingDna` (type alias) | — | — |
| 10. Sales | `salesMethods` (`SalesMethodKey[]`, knowledge-engine) | The section itself — **not** one of the epic's 7 named cross-references, so kept local rather than aliasing business-dna's `SalesDna` |  |
| 11. Operations | — | The whole section | — |
| 12. Technology | `toolKeys`/`aiToolKeys` loosely reference `business-library/taxonomy/{tools,ai-tools}.json` entries (open catalogs, no closed enum to import) | The whole section | — |
| 13. Team | — | The whole section | — |
| 14. Financial Overview | **Full reuse** — `business-dna`'s `FinancialDna` (type alias) | — | — |
| 15. KPIs | `kpis` (`BusinessDnaKpiKey[]`, business-dna's fixed 10-value enum) | The wrapper shape | — |
| 16. Launch Checklist | — | The whole section | — |
| 17. Growth Roadmap | — | The whole section | **Not** the same thing as `features/roadmap` (this epic's dedicated 9-stage system) — this is a lightweight in-document summary list only |
| 18. Risks | **Full reuse** — `business-dna`'s `RiskDna` (type alias) | — | — |
| 19. Success Factors | **Full reuse** — `business-dna`'s `SuccessDna` (type alias) | — | — |
| 20. Resources | **Full reuse** — `business-dna`'s `ResourcesSection` (type alias), per the epic's cross-reference table | — | `features/resources` (this same epic) defines a broader, 16-category vocabulary meant as the new canonical superset for "resources" generally — not switched to here, since the epic's table specifies business-dna's narrower type for Blueprint specifically. See `features/resources/README.md`. |
| 21. AI Metadata | Same *pattern* as business-dna's `AiMetadata` (a bundle of translationKey hints) | The field set itself | **Not a straight reuse, despite the epic's table saying "AI Metadata→AI Metadata".** business-dna's shape is `{matchingHints, blueprintHints, marketingHints, financialHints, generationHints}`; this epic specifies Blueprint's own `{generationHints, explanationHints, financialHints, marketingHints, matchingHints}` — note `explanationHints` where business-dna has `blueprintHints` (which would be redundant here, since this section *is* the blueprint). Flagged, not silently reconciled. |

## Architecture notes

- **No `services/` folder.** This sprint's structure is
  `schemas/`/`dto/`/`interfaces/`/`repositories/`/`templates/`/`types/`
  only — no unimplemented algorithm stage exists to place behind a
  `services/` folder this round.
- **Repository is an empty in-memory stub, not a throwing placeholder.**
  `InMemoryBlueprintRepository` matches features/business-dna's precedent
  exactly (see that feature's README) — there's no Prisma table for
  Blueprint content yet, and no content is authored this sprint, so an
  ever-empty-until-`create()`-something `Map` is more useful than a
  `NotImplementedError` throw.
- **Keyed by `businessTypeId`, not an independent id.** A Blueprint is
  always one-per-BusinessType, mirroring `BusinessBlueprintTemplate` in
  `src/features/business-engine/schemas/templates.ts`.

## Tests

`tests/` asserts `templates/empty-blueprint.json` validates against
`blueprintSchema`, plus accept/reject cases for malformed DTOs. Run with
`npm test`.
