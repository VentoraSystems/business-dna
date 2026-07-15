# Home Repair & Handyman Marketplace

- **Business Name:** Tradeline Home Services Marketplace
- **Version:** 1.0.0
- **Status:** published
- **Category:** local-service-marketplaces (see `../../taxonomy/categories.json`)
- **Industry:** homeServices (see `../../taxonomy/industries.json`)
- **Business Model:** marketplace (see `../../taxonomy/business-models.json`)
- **Created At:** 2026-07-15
- **Last Updated:** 2026-07-15
- **Canonical:** false — this is a real authored business, not the
  reference structure (see `../ai-automation-agency/` for that).

## Description

A two-sided marketplace connecting homeowners (demand side) with
vetted, licensed, and insured independent handymen and tradespeople
(supply side) for small-to-medium home repair jobs, monetized through
a commission on completed job value plus an optional job-guarantee fee.
The second genuine two-sided marketplace authored in this library,
after `tutoring-help-marketplace` — deliberately differentiated from
it: a different vertical (home repair, not education), quote-based job
pricing rather than hourly session booking, contractor
licensing/insurance verification rather than background-check-only
vetting, a larger average transaction size, and a job-guarantee
insurance angle rather than a minor-safety angle. Not solo-friendly —
the operational complexity of contractor licensing verification,
geo-radius dispatch, and payment escrow requires a small team from day
one.

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
`translationKey` under `businessLibrary.homeRepairMarketplace.*` in
`messages/en.json` and `messages/ro.json`. `business-dna.json`'s
narrative fields are inline bilingual `{ en, ro }` objects instead, per
`features/business-dna`'s own (frozen) schema convention — except its
Section 18 `resources` list, which uses `translationKey` references into
`businessLibrary.homeRepairMarketplace.businessDna.resources.*`.
