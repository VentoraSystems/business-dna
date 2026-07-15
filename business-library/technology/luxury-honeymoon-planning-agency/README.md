# Luxury Honeymoon Planning Agency

- **Business Name:** Aisle & Away
- **Version:** 1.0.0
- **Status:** published
- **Category:** boutique-travel-agencies (see `../../taxonomy/categories.json`)
- **Industry:** travel (see `../../taxonomy/industries.json`)
- **Business Model:** agency (see `../../taxonomy/business-models.json`)
- **Created At:** 2026-07-15
- **Last Updated:** 2026-07-15
- **Canonical:** false — this is a real authored business, not the
  reference structure (see `../ai-automation-agency/` for that).

## Description

A bespoke luxury honeymoon planning agency for newly engaged couples,
curating private-villa and 5-star-resort stays, private guides, and
romantic experiences through preferred-partner relationships with
luxury destination management companies (DMCs) and resorts, priced on
a planning fee plus a commission/markup on the trip. Deliberately
differentiated from `adventure-travel-boutique-agency` elsewhere in
this category: a romantic/luxury occasion rather than an adventure/
expedition occasion, a materially higher price tier (€8,000-€25,000+
per couple vs. €2,500-€6,000 per person), luxury-resort and DMC
preferred-partner relationships rather than firsthand guide-network
expertise, and a wedding-industry vendor referral channel rather than
an outdoor-adventure-community channel. Solo-friendly, matching the
adventure agency's precedent.

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
`translationKey` under `businessLibrary.luxuryHoneymoonPlanningAgency.*`
in `messages/en.json` and `messages/ro.json`. `business-dna.json`'s
narrative fields are inline bilingual `{ en, ro }` objects instead, per
`features/business-dna`'s own (frozen) schema convention — except its
Section 18 `resources` list, which uses `translationKey` references into
`businessLibrary.luxuryHoneymoonPlanningAgency.businessDna.resources.*`.
