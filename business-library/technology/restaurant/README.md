# Restaurant

- **Business Name:** Ember & Oak
- **Version:** 1.0.0
- **Status:** published
- **Category:** restaurants (see `../../taxonomy/categories.json`)
- **Industry:** food (see `../../taxonomy/industries.json`)
- **Business Model:** physicalProduct (see `../../taxonomy/business-models.json`)
- **Created At:** 2026-07-15
- **Last Updated:** 2026-07-15
- **Canonical:** false — this is a real authored business, not the
  reference structure (see `../ai-automation-agency/` for that).

## Description

A full-service, scratch-kitchen neighborhood restaurant built around a
seasonal New American dinner menu and a full bar program, serving a
planned dining-out occasion (date nights, celebrations, a reliable
weekend "go-to" spot) rather than a daily-habit stop. Distinct from
`coffee-shops` elsewhere in this catalog (also a physical food-service
location): this business runs a full commercial kitchen with a much
larger back-of-house and front-of-house staff, requires liquor
licensing on top of standard food-service permitting, carries the
highest startup capital and thinnest margins of the two, and adds a
private-event/catering booking revenue stream as its premium
differentiator. The first business authored under the new `restaurants`
category.

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
`translationKey` under `businessLibrary.restaurant.*` in
`messages/en.json` and `messages/ro.json`. `business-dna.json`'s
narrative fields are inline bilingual `{ en, ro }` objects instead, per
`features/business-dna`'s own (frozen) schema convention — except its
Section 18 `resources` list, which uses `translationKey` references into
`businessLibrary.restaurant.businessDna.resources.*`.
