# Cleaning Company

- **Business Name:** Brightline Cleaning Co.
- **Version:** 1.0.0
- **Status:** published
- **Category:** cleaning-services (see `../../taxonomy/categories.json`)
- **Industry:** homeServices (see `../../taxonomy/industries.json`)
- **Business Model:** service (see `../../taxonomy/business-models.json`)
- **Created At:** 2026-07-14
- **Last Updated:** 2026-07-14
- **Canonical:** false — this is a real authored business, not the
  reference structure (see `../ai-automation-agency/` for that).

## Description

A residential recurring-cleaning company — an owner-operator who does the
early cleaning visits directly, then hires and trains W2 cleaning
technicians as demand grows, assigning the same 2-person team to the same
recurring clients for continuity. Distinct from `local-service-marketplaces`'
"House Cleaning Services Marketplace" elsewhere in this catalog (not yet
authored): this is a single operating company that employs and trains its
own cleaners, not a marketplace aggregating independent contractors — the
whole value proposition is the opposite of the marketplace model's
rotating, unvetted-cleaner experience. The first business authored under
the new `cleaning-services` category.

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
`translationKey` under `businessLibrary.cleaningCompany.*` in
`messages/en.json` and `messages/ro.json`. `business-dna.json`'s narrative
fields are inline bilingual `{ en, ro }` objects instead, per
`features/business-dna`'s own (frozen) schema convention — except its
Section 18 `resources` list, which uses `translationKey` references into
`businessLibrary.cleaningCompany.businessDna.resources.*`.
