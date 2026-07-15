# Tutoring & Homework Help Marketplace

- **Business Name:** StudySpark
- **Version:** 1.0.0
- **Status:** published
- **Category:** local-service-marketplaces (see `../../taxonomy/categories.json`)
- **Industry:** education (see `../../taxonomy/industries.json`)
- **Business Model:** marketplace (see `../../taxonomy/business-models.json`)
- **Created At:** 2026-07-16
- **Last Updated:** 2026-07-16
- **Canonical:** false — this is a real authored business, not the
  reference structure (see `../ai-automation-agency/` for that).

## Description

A two-sided marketplace connecting K-12 students and families (demand
side) with vetted, background-checked independent tutors (supply side)
for subject tutoring and homework help, monetized through a commission
on each session booking rather than a flat service fee. The first
genuine two-sided marketplace business authored in this library — every
other authored business to date has been a one-sided service, agency,
or physical-location business delivering directly to one customer type.
This package is deliberately structured around real marketplace
dynamics: solving the two-sided cold-start liquidity problem, vetting
and onboarding independent tutor supply, commission-based (not flat-fee
or subscription) revenue, and higher scalability once liquidity is
achieved than the one-to-one service businesses elsewhere in this
catalog. Not solo-friendly — the operational complexity of vetting
supply, matching demand, and handling payments requires a small team
from day one.

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

## Translation keys

Every narrative field in `financial.json`, `marketing.json`,
`roadmap.json`, `resources.json`, and `business-insights.json` is a
`translationKey` under `businessLibrary.tutoringHelpMarketplace.*` in
`messages/en.json` and `messages/ro.json`. `business-dna.json`'s
narrative fields are inline bilingual `{ en, ro }` objects instead, per
`features/business-dna`'s own (frozen) schema convention — except its
Section 18 `resources` list, which uses `translationKey` references into
`businessLibrary.tutoringHelpMarketplace.businessDna.resources.*`.
