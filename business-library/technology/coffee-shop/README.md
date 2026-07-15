# Coffee Shop

- **Business Name:** Basalt Coffee Roasters
- **Version:** 1.0.0
- **Status:** published
- **Category:** coffee-shops (see `../../taxonomy/categories.json`)
- **Industry:** food (see `../../taxonomy/industries.json`)
- **Business Model:** physicalProduct (see `../../taxonomy/business-models.json`)
- **Created At:** 2026-07-15
- **Last Updated:** 2026-07-15
- **Canonical:** false — this is a real authored business, not the
  reference structure (see `../ai-automation-agency/` for that).

## Description

A neighborhood specialty coffee shop built around counter-service
espresso and brewed coffee, a curated single-origin bean program, and a
small grab-and-go pastry case, serving the daily-habit occasion (a
commuter's or remote worker's regular stop) rather than a dining
occasion. Distinct from `subscription-boxes`' "Specialty Coffee
Subscription Box" — this is a physical dine-in/retail venue
(`physicalProduct`), not a recurring shipped box (`subscription`).
Distinct from `restaurants` elsewhere in this catalog (also a physical
food-service location): this business has a simpler counter-service
menu, faster per-transaction service, no full commercial kitchen or
table service, lower staffing and capital requirements, and serves a
quick daily-ritual occasion rather than a planned dining-out occasion.
The first business authored under the new `coffee-shops` category.

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
`translationKey` under `businessLibrary.coffeeShop.*` in
`messages/en.json` and `messages/ro.json`. `business-dna.json`'s
narrative fields are inline bilingual `{ en, ro }` objects instead, per
`features/business-dna`'s own (frozen) schema convention — except its
Section 18 `resources` list, which uses `translationKey` references into
`businessLibrary.coffeeShop.businessDna.resources.*`.
