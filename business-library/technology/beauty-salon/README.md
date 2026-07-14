# Beauty Salon

- **Business Name:** Lumière Hair & Beauty Studio
- **Version:** 1.0.0
- **Status:** published
- **Category:** beauty-wellness (see `../../taxonomy/categories.json`)
- **Industry:** health (see `../../taxonomy/industries.json`)
- **Business Model:** service (see `../../taxonomy/business-models.json`)
- **Created At:** 2026-07-14
- **Last Updated:** 2026-07-14
- **Canonical:** false — this is a real authored business, not the
  reference structure (see `../ai-automation-agency/` for that).

## Description

A small multi-chair hair and beauty salon leasing a storefront, offering
haircuts, coloring, and styling plus blowouts and brow shaping, built
around a consistent stylist relationship rather than a walk-in chain
experience. `health` is a deliberately acknowledged loose `IndustryType`
fit — per the earlier Industry Mapping Report's reconciliation, no value
maps precisely onto personal-care/beauty services, but `health` is the
closest existing value and no new enum value was introduced to
accommodate it. Not solo-friendly — the business needs at least one
additional stylist from day one to support a real chair schedule, unlike
most other services in this library. The first business authored under
the new `beauty-wellness` category.

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
`translationKey` under `businessLibrary.beautySalon.*` in
`messages/en.json` and `messages/ro.json`. `business-dna.json`'s narrative
fields are inline bilingual `{ en, ro }` objects instead, per
`features/business-dna`'s own (frozen) schema convention — except its
Section 18 `resources` list, which uses `translationKey` references into
`businessLibrary.beautySalon.businessDna.resources.*`.
