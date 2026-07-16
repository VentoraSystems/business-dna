# Clean Beauty Subscription Box

- **Business Name:** Meadowlane Beauty Co.
- **Version:** 1.0.0
- **Status:** published
- **Category:** subscription-boxes (see `../../taxonomy/categories.json`)
- **Industry:** health (see `../../taxonomy/industries.json`)
- **Business Model:** subscription (see `../../taxonomy/business-models.json`)
- **Created At:** 2026-07-16
- **Last Updated:** 2026-07-16
- **Canonical:** false — this is a real authored business, not the
  reference structure (see `../ai-automation-agency/` for that).

## Description

A curated clean-beauty subscription box that ships personalized
skincare and beauty products — free from a defined "dirty list" of
chemicals (parabens, sulfates, phthalates, synthetic fragrance) and
cruelty-free/GOTS-or-equivalent-certified where applicable — to
subscribers who take a short skin-type/concern intake quiz at signup,
so each box is fit-matched to the subscriber's skin type and stated
concerns (acne-prone, sensitive, anti-aging, etc.) rather than a pure
novelty/discovery rotation. Revenue comes from a tiered monthly/
bi-monthly box subscription, a full-size à la carte reorder shop for
products a subscriber loved in a past box, and an affiliate/referral
program.

Distinct from `specialty-coffee-subscription-box` elsewhere in this
library — same top-level category (`subscription-boxes`) and business
model (`subscription`), but built on genuinely different mechanics, not
just a different industry. Retention here is driven by intake-quiz
personalization accuracy and "skip a month" / "swap a product"
flexibility, not by rotating discovery variety — product-fit mismatch
(the wrong product for a subscriber's skin type or concern, which can
cause an immediate cancellation or even a bad reaction) is this
business's dominant churn driver, not novelty fatigue. Box cadence and
the à la carte reorder shop follow real per-product depletion timing (a
serum lasts 2-3 months, a cleanser closer to 1 month), not a uniform
monthly-consumable assumption. And the sourcing story is clean-ingredient
verification — working with a roster of small-batch, ingredient-transparent
beauty brands and independent formulators, and vetting "clean" claims
against a defined dirty-ingredient list — rather than the coffee box's
rotating-roaster-partnership sourcing model.

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
`translationKey` under `businessLibrary.cleanBeautySubscriptionBox.*`
in `messages/en.json` and `messages/ro.json`. `business-dna.json`'s
narrative fields are inline bilingual `{ en, ro }` objects instead, per
`features/business-dna`'s own (frozen) schema convention — except its
Section 18 `resources` list, which uses `translationKey` references into
`businessLibrary.cleanBeautySubscriptionBox.businessDna.resources.*`.
