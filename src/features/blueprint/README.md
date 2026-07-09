# Blueprint — architecture

`features/blueprint` is the authoring framework for the **Business
Blueprint** document — 25 sections (v2), schemas/templates/validation
only. No content generation, no invented values, no AI. See
[`features/business-dna/README.md`](../business-dna/README.md) for the
canonical runtime contract this feature draws several sections from, and
[`business-library/README.md`](../../../business-library/README.md) for
where a real Blueprint would eventually be authored
(`technology/<slug>/blueprint.md`, already scaffolded as an empty
template last sprint).

## Specification History

**v1 (21 sections) → v2 (25 sections), officially superseded — this is
an intentional product evolution, not a bug.** v1's section list and
reuse table below have been fully replaced; nothing in this README
should be read as describing v1 as still current. See the "v1 → v2
section mapping" table below for exactly what changed.

## Purpose

A Blueprint is the human-readable business plan document generated for
one BusinessType — the first of the generators in the pipeline below.
This sprint defines its shape only: `templates/empty-blueprint.json`
and `templates/empty-blueprint.md` are the "fill in the blanks" starting
points, mirroring `business-library/technology/ai-automation-agency/`'s
own empty `blueprint.md` from two sprints ago.

## Pipeline

```
Business Library → Business DNA Profile → Matching Engine → Blueprint → Marketing → Financial → AI Co-Founder
                                                                  ↑ this feature
```

Once a real Matching Engine produces a `CompatibilityResult` for a
person against a Business DNA Profile, a future Blueprint Generator
would read `financialDna`/`marketingDna`/`riskDna`/`successDna`/
`aiMetadata.blueprintHints` off that profile, plus `features/resources`'
`ResourceItem` list (see "v1 → v2 section mapping" below for exactly
which fields per section) to populate this document — no such generator
exists yet.

## v1 → v2 section mapping

| # (v2) | v2 section | v1 equivalent | Relationship |
|---|---|---|---|
| 1 | Executive Summary | Executive Summary (§1) | Unchanged, renumbered only |
| 2 | Entrepreneur Fit | Founder Fit (§3) | **Renamed** — same full reuse of business-dna's `FounderFit`, local alias renamed `BlueprintFounderFit` → `EntrepreneurFit` |
| 3 | Business Overview | Business Overview (§2) | Unchanged, renumbered only |
| 4 | Market Intelligence | Market (§4) | **Renamed**, same shape |
| 5 | Customer Intelligence | Ideal Customer (§5) | **Renamed**, same shape |
| 6 | Offer Architecture | Offer (§6) | **Renamed**, same shape |
| 7 | Revenue Architecture | Revenue (§8) | **Renamed**, same shape. Also **reordered** ahead of Pricing (v1 had Pricing before Revenue) |
| 8 | Pricing Strategy | Pricing (§7) | **Renamed**, same shape |
| 9 | Marketing System | Marketing (§9) | **Renamed** — same full reuse of business-dna's `MarketingDna`, local alias renamed `BlueprintMarketing` → `MarketingSystem` |
| 10 | Sales System | Sales (§10) | **Renamed**, same shape |
| 11 | Operations System | Operations (§11) | **Renamed**, same shape |
| 12 | Technology Stack | Technology (§12) | **Renamed**, same shape |
| 13 | Automation Opportunities | *(none)* | **NEW** — no v1 equivalent |
| 14 | Team Structure | Team (§13) | **Renamed**, same shape |
| 15 | Financial Overview | Financial Overview (§14) | Unchanged, renumbered only |
| 16 | KPIs | KPIs (§15) | Unchanged, renumbered only |
| 17 | Risk Analysis | Risks (§18) | **Renamed** — same full reuse of business-dna's `RiskDna` |
| 18 | Competitive Advantages | Success Factors (§19) | **Folded in** — per this epic's explicit instruction, v1's "Success Factors" (full reuse of `SuccessDna`) is consolidated here, and NOT also duplicated into "AI Recommendations" (§23) — a documented judgment call, not a forced 1:1 rename |
| 19 | Launch Strategy | *(none)* | **NEW** — no v1 equivalent (not to be confused with v1's "Launch Checklist", which is consolidated into §20 below, not here) |
| 20 | 90-Day Action Plan | Launch Checklist (§16) + Growth Roadmap (§17) | **Consolidated** — per this epic's explicit instruction, both v1 sections are merged into one structured, week-by-week plan (`checklistTranslationKeys` = old Launch Checklist's items, `milestoneTranslationKeys` = old Growth Roadmap's milestones), not kept side by side with the new section |
| 21 | Scaling Strategy | *(none)* | **NEW** — no v1 equivalent |
| 22 | Exit Opportunities | *(none)* | **NEW** — no v1 equivalent |
| 23 | AI Recommendations | *(none)* | **NEW** — no v1 equivalent. **Not** the same thing as the internal-only `aiMetadata` hints bundle (which persists unchanged from v1, see below) |
| 24 | Resources | Resources (§20) | **Changed reuse target** — see "Resources: a correction, not a silent drift" below |
| 25 | Appendix | *(none)* | **NEW** — no v1 equivalent |
| *(internal-only, not one of the 25)* | AI Metadata | AI Metadata (§21) | Unchanged — still a bundle of translationKey hints, still never rendered as a heading in the `.md` template. Kept internal and uncounted, same convention v1 used |

Judgment call flagged: this epic's own instruction text names only
Automation Opportunities, Competitive Advantages, 90-Day Action Plan,
and Appendix as "(NEW)". Launch Strategy, Scaling Strategy, Exit
Opportunities, and AI Recommendations are **also** genuinely new (no v1
section maps to them, and the epic's own rename-mapping paragraph never
mentions them) — treated as new here despite not being explicitly
tagged, since there is no defensible alternative mapping for them.

## Resources: a correction, not a silent drift

This epic's instructions state Blueprint's Resources section "should
still just reference `features/resources`' types by import, **as it did
in v1**." That premise is incorrect: v1 actually aliased **business-dna's**
(narrower, 7-category) `ResourcesSection` directly — see v1's own reuse
table, preserved in git history. v2 now genuinely switches to
`features/resources`' `ResourceItem` (the 16-category canonical
superset built last sprint), which is what the instruction asked for —
but this is a **v2 change**, not a continuation of v1 behavior. Flagged
here rather than silently going along with the epic's mistaken premise.

## Reuse table (v2, current)

| Section | Reuses from | Genuinely new | Conflict to flag |
|---|---|---|---|
| 1. Executive Summary | `businessModel` (`BusinessModelType`, business-engine), `revenueType` (`RevenueModelKey`, knowledge-engine) | The section itself | — |
| 2. Entrepreneur Fit | **Full reuse** — `business-dna`'s `FounderFit` (type alias, renamed from v1's `BlueprintFounderFit`) | — | — |
| 3. Business Overview | `industry` (`IndustryType`, business-engine) | The section itself | — |
| 4. Market Intelligence | — | The whole section | — |
| 5. Customer Intelligence | `customerType` (`CustomerTypeKey`, knowledge-engine) | The section itself | — |
| 6. Offer Architecture | — | The whole section | — |
| 7. Revenue Architecture | `revenueModel` (`RevenueModelKey`, knowledge-engine) | The section itself | — |
| 8. Pricing Strategy | `pricingModel` (`PricingModelKey`, knowledge-engine) | The section itself | — |
| 9. Marketing System | **Full reuse** — `business-dna`'s `MarketingDna` (type alias) | — | — |
| 10. Sales System | `salesMethods` (`SalesMethodKey[]`, knowledge-engine) | The section itself — still **not** one of the epic's named business-dna cross-references, kept local rather than aliasing business-dna's `SalesDna`, same as v1 | — |
| 11. Operations System | — | The whole section | — |
| 12. Technology Stack | `toolKeys`/`aiToolKeys` loosely reference `business-library/taxonomy/{tools,ai-tools}.json` entries (open catalogs, no closed enum) | The whole section | — |
| 13. Automation Opportunities | `recommendedAiToolKeys` loosely references `business-library/taxonomy/ai-tools.json`, same open-catalog convention as §12 | The whole section | — |
| 14. Team Structure | — | The whole section | — |
| 15. Financial Overview | **Full reuse** — `business-dna`'s `FinancialDna` (type alias) | — | — |
| 16. KPIs | `kpis` (`BusinessDnaKpiKey[]`, business-dna's fixed 10-value enum) | The wrapper shape | — |
| 17. Risk Analysis | **Full reuse** — `business-dna`'s `RiskDna` (type alias, renamed from v1's `Risks`) | — | — |
| 18. Competitive Advantages | **Full reuse** — `business-dna`'s `SuccessDna` (type alias, folded in from v1's "Success Factors") | — | Not also duplicated into "AI Recommendations" — see v1→v2 mapping table |
| 19. Launch Strategy | — | The whole section | — |
| 20. 90-Day Action Plan | Structurally consolidates v1's Launch Checklist + Growth Roadmap fields | The `weeks` structure itself | **Not** the same thing as `features/roadmap` (that feature's dedicated, full stage-by-stage authoring system) — this is a lightweight in-document 90-day summary only |
| 21. Scaling Strategy | — | The whole section | — |
| 22. Exit Opportunities | — | The whole section | Structural placeholder only — no valuation figures or calculations |
| 23. AI Recommendations | — | The whole section | Distinct from the internal-only `aiMetadata` hints bundle — see below |
| 24. Resources | `ResourceItem` — `features/resources`' 16-category canonical vocabulary (built last sprint) | The wrapper shape | **v2 change** — see "Resources: a correction, not a silent drift" above |
| 25. Appendix | — | The whole section | — |
| AI Metadata (internal-only) | Same *pattern* as business-dna's `AiMetadata` (a bundle of translationKey hints) | The field set itself | **Not a straight reuse.** business-dna's shape is `{matchingHints, blueprintHints, marketingHints, financialHints, generationHints}`; this feature's is `{generationHints, explanationHints, financialHints, marketingHints, matchingHints}` — unchanged from v1, still flagged, not silently reconciled |

## Architecture notes

- **No `services/` folder.** Same as v1 — no unimplemented algorithm
  stage exists to place behind a `services/` folder this round.
- **Repository is an empty in-memory stub, not a throwing placeholder.**
  `InMemoryBlueprintRepository` matches features/business-dna's precedent
  exactly — unchanged by this sprint, no repository shape changed (only
  the `Blueprint` type's fields changed, and the repository is generic
  over that type).
- **Keyed by `businessTypeId`, not an independent id.** Unchanged from
  v1 — a Blueprint is always one-per-BusinessType, mirroring
  `BusinessBlueprintTemplate` in
  `src/features/business-engine/schemas/templates.ts`.

## Tests

`tests/` asserts `templates/empty-blueprint.json` validates against
`blueprintSchema`, plus accept/reject cases for malformed DTOs,
including new v2-specific cases (90-Day Action Plan week bounds,
Resources' new 16-category vocabulary). Run with `npm test`.
