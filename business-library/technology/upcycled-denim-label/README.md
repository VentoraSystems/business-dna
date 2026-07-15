# Upcycled Denim Label

- **Business Name:** Reweave Denim Co.
- **Version:** 1.0.0
- **Status:** published
- **Category:** sustainable-fashion-brands (see `../../taxonomy/categories.json`)
- **Industry:** fashion (see `../../taxonomy/industries.json`)
- **Business Model:** physicalProduct (see `../../taxonomy/business-models.json`)
- **Created At:** 2026-07-15
- **Last Updated:** 2026-07-15
- **Canonical:** false — this is a real authored business, not the
  reference structure (see `../ai-automation-agency/` for that).

## Description

A small-batch fashion label that sources secondhand denim and factory
deadstock, deconstructs and redesigns it into limited-run garments
(jackets, patchwork jeans, bags), sold primarily D2C through scarcity-
driven "drop" releases, with secondary wholesale and made-to-order
revenue. Distinct from the mass-market, algorithmically-scaled
`ecommerce-brand` elsewhere in this library — this business is
deliberately capacity-constrained by hand production and unpredictable
raw-material sourcing, trading scale for authenticity and premium
pricing.

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
`translationKey` under `businessLibrary.upcycledDenimLabel.*` in
`messages/en.json` and `messages/ro.json`. `business-dna.json`'s
narrative fields are inline bilingual `{ en, ro }` objects instead, per
`features/business-dna`'s own (frozen) schema convention — except its
Section 18 `resources` list, which uses `translationKey` references into
`businessLibrary.upcycledDenimLabel.businessDna.resources.*`.
