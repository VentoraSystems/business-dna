# Organic Cotton Basics Brand

- **Business Name:** Fieldstate Basics Co.
- **Version:** 1.0.0
- **Status:** published
- **Category:** sustainable-fashion-brands (see `../../taxonomy/categories.json`)
- **Industry:** fashion (see `../../taxonomy/industries.json`)
- **Business Model:** ecommerce (see `../../taxonomy/business-models.json`)
- **Created At:** 2026-07-16
- **Last Updated:** 2026-07-16
- **Canonical:** false — this is a real authored business, not the
  reference structure (see `../ai-automation-agency/` for that).

## Description

A D2C e-commerce apparel brand selling everyday wardrobe staples
(t-shirts, underwear, basics/loungewear) made from GOTS-certified
organic cotton, sourced through a direct-trade relationship with a
certified organic cotton farm co-op and a GOTS-certified manufacturing
partner, with full batch-level supply-chain traceability. Sold as a
scalable, repeatable, inventory-forward online storefront with
consistent core SKUs and regular restocking, with a
subscription/replenishment option for repeat staples plus a smaller
wholesale channel to sustainable-retail boutiques.

Distinct from `upcycled-denim-label` elsewhere in this library (same
`sustainable-fashion-brands` category): Reweave Denim Co. uses
`businessModel: physicalProduct` and is deliberately
capacity-constrained by hand-deconstruction of one-off secondhand
denim and factory deadstock, sold through scarcity-driven limited
"drop" releases where each release is genuinely unrepeatable. Fieldstate
Basics Co. uses `businessModel: ecommerce` — a scalable, repeatable,
inventory-forward operation with consistent core SKUs made from a
reliable ongoing organic-cotton supply, restocked regularly rather than
scarcity-marketed (`scalabilityDna.scalability.level` is `high` here vs.
`moderate` for the denim label, and `businessCharacteristics.isHighlyScalable`
is `true` here vs. `false` there). The sourcing story is also opposite in
kind: the denim label's story is salvage/deadstock sourcing (rescuing
existing textile waste — unpredictable, one-off), while Fieldstate's
story is a stable, certified, traceable primary-material supply chain
(a farm co-op relationship, GOTS certification, batch traceability) — a
"grow it right" story, not a "rescue what exists" story, reflected in
`financial.json`'s predictable per-unit COGS versus the denim label's
more variable, opportunistic material costs. Finally, the denim label
is `onlineOffline: hybrid` / `workMode: hybrid` (a physical
studio/production element), while Fieldstate is `onlineOffline: online`
/ `workMode: remote` — a purely digital-first operation with
manufacturing fully outsourced to its certified partner.

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
`translationKey` under `businessLibrary.organicCottonBasicsBrand.*` in
`messages/en.json` and `messages/ro.json`. `business-dna.json`'s
narrative fields are inline bilingual `{ en, ro }` objects instead, per
`features/business-dna`'s own (frozen) schema convention — except its
Section 18 `resources` list, which uses `translationKey` references into
`businessLibrary.organicCottonBasicsBrand.businessDna.resources.*`.
