# Accounting Firm

- **Business Name:** Meridian Accounting Partners
- **Version:** 1.0.0
- **Status:** published
- **Category:** accounting-firms (see `../../taxonomy/categories.json`)
- **Industry:** finance (see `../../taxonomy/industries.json`)
- **Business Model:** service (see `../../taxonomy/business-models.json`)
- **Created At:** 2026-07-09
- **Last Updated:** 2026-07-09
- **Canonical:** false — this is a real authored business, not the
  reference structure (see `../ai-automation-agency/` for that).

> **Disclaimer:** This package contains educational business-building
> guidance only — how to run and grow an accounting practice as a
> business. It is not accounting, tax, or financial advice for any end
> client, and must never be treated as a substitute for advice from a
> licensed professional.

## Description

A small-business bookkeeping and tax practice built around monthly
retainers, a guaranteed 5-business-day month-end close, and a growth
path toward fractional-CFO advisory work. Targets small businesses and
startups (2-50 employees) that have outgrown a spreadsheet but aren't
ready for an in-house controller.

## What's in this package

| File | Validates against |
|---|---|
| `metadata.json` | Package-level identity/status (`validate-packages.ts`'s required fields) |
| `business-dna.json` | `features/business-dna`'s `BusinessDnaProfile` schema |
| `blueprint.md` | Narrative document following `features/blueprint`'s v2 25-section outline |
| `financial.json` | `features/financial`'s `financialSchema` (18 sections) |
| `marketing.json` | `features/marketing`'s `marketingSchema` (18 sections) |
| `roadmap.json` | `features/roadmap`'s `roadmapSchema` (10-stage v2 vocabulary) |
| `resources.json` | `features/resources`'s `resourcesSchema` (16-category canonical taxonomy) |
| `business-insights.json` | `features/business-insights`'s `businessInsightsSchema` (the "soft knowledge" layer) |
| `ai-notes.md` | `features/business-dna`'s `AiMetadata`, in plain prose |
| `assets/` | Empty — future images/media for this business |

**A note on `financial.json`/`marketing.json`/`roadmap.json`/
`resources.json`:** unlike `../ai-automation-agency/`'s copies of these
files (which mirror business-engine's older `BusinessFinancialTemplate`/
`BusinessMarketingTemplate`/`BusinessLaunchTemplate` shapes, predating
the newer Business Assets features), this package's copies validate
against the newer, purpose-built `features/financial`, `features/marketing`,
`features/roadmap`, and `features/resources` schemas — the current
authoring frameworks for this exact content, built in later sprints.
`business-insights.json` has no `ai-automation-agency` equivalent at all,
since `features/business-insights` didn't exist when that reference
package was scaffolded.

## Translation keys

Every narrative field in `financial.json`, `marketing.json`,
`roadmap.json`, `resources.json`, and `business-insights.json` is a
`translationKey` under `businessLibrary.accountingFirm.*` in
`messages/en.json` and `messages/ro.json`. `business-dna.json`'s
narrative fields are inline bilingual `{ en, ro }` objects instead,
per `features/business-dna`'s own (frozen) schema convention — see that
feature's README for why its Business Genome–derived sections use
inline text rather than translation keys.
