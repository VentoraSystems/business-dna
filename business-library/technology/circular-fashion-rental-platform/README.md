# Circular Fashion Rental Platform

- **Business Name:** Loopwear Rental Co.
- **Version:** 1.0.0
- **Status:** published
- **Category:** sustainable-fashion-brands (see `../../taxonomy/categories.json`)
- **Industry:** fashion (see `../../taxonomy/industries.json`)
- **Business Model:** subscription (see `../../taxonomy/business-models.json`)
- **Created At:** 2026-07-16
- **Last Updated:** 2026-07-16
- **Canonical:** false — this is a real authored business, not the
  reference structure (see `../ai-automation-agency/` for that).

## Description

A clothing rental subscription platform. Members pay a tiered monthly
subscription fee for rotating access to a shared wardrobe of curated
garments — special-occasion wear and versatile work-capsule pieces —
wearing an item, then returning or swapping it rather than owning it.
Revenue combines a tiered monthly subscription (by number of items held
at once / swaps per month) with an optional buy-out price for members
who want to keep a specific piece permanently. Operationally, the
business is defined by a professional reverse-logistics cycle —
garment inspection, industrial cleaning, minor repair, and re-listing
after every single return — a real operational engine, run out of a
physical garment-processing hub, that is fundamentally different from
any business that sells a garment once and is done with it.

Distinct from BOTH `upcycled-denim-label` and `organic-cotton-basics-brand`
elsewhere in this library (same `sustainable-fashion-brands` category):
both of those businesses are one-time-sale, ownership-transfer
businesses — Reweave Denim Co. (`businessModel: physicalProduct`) sells
a limited-run garment once through a scarcity-driven drop, and
Fieldstate Basics Co. (`businessModel: ecommerce`) sells a repeatable,
restocked core-SKU catalog once per unit — in both cases a customer
pays once, owns the garment forever, and the business is done with that
unit. Loopwear Rental Co. (`businessModel: subscription`) never
transfers ownership: the same physical garment is rented out repeatedly
to many different members over its lifetime, cleaned and re-inspected
after every single wear cycle. This is a genuinely different
operational and financial engine, not a cosmetic difference: garments
are a capitalized, depreciating rental-fleet asset (not COGS-per-unit-
sold inventory), revenue is recurring subscription access measured
against fleet-utilization rate (not a one-off per-unit sale price), and
the core recurring cost is the reverse-logistics cycle — industrial
cleaning, inspection, and repair after every return — rather than a
one-time production or sourcing cost per unit (see `financial.json`'s
utilization-rate and reverse-logistics-cost framing versus the denim
label's material-sourcing COGS and the cotton brand's per-unit
manufacturing COGS). Scalability also differs from both: the denim
label is capacity-constrained by hand production
(`scalabilityDna.scalability.level: moderate`, hand-craft-bound), the
cotton brand is highly scalable because manufacturing is fully
outsourced (`scalabilityDna.scalability.level: high`), while Loopwear
sits at `moderate` for a different reason entirely — growth requires
capital for both rental-fleet inventory AND reverse-logistics/cleaning-
facility capacity, real infrastructure-bound scaling that is neither
hand-craft-bound nor purely outsourced. Work mode differs too: the
denim label is `hybrid`/`hybrid` because of a design/production studio,
and the cotton brand is `remote`/`online` because manufacturing is
fully outsourced with no physical ops at all, while Loopwear is also
`hybrid`/`hybrid` but for yet another reason — a physical garment-
processing and cleaning/inspection hub, not a design studio. (Worth
noting for future authors: `secondhand-fashion-resale-marketplace`, another
`sustainable-fashion-brands` catalog row, is not yet authored in this
library — but conceptually, resale would still be an ownership-transfer
model, just of a pre-owned item via a marketplace, whereas rental, as
built here, never transfers ownership at all.)

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
`translationKey` under `businessLibrary.circularFashionRentalPlatform.*` in
`messages/en.json` and `messages/ro.json`. `business-dna.json`'s
narrative fields are inline bilingual `{ en, ro }` objects instead, per
`features/business-dna`'s own (frozen) schema convention — except its
Section 18 `resources` list, which uses `translationKey` references into
`businessLibrary.circularFashionRentalPlatform.businessDna.resources.*`.
