# Adventure Travel Boutique Agency

- **Business Name:** Ridge & Range Adventures
- **Version:** 1.0.0
- **Status:** published
- **Category:** boutique-travel-agencies (see `../../taxonomy/categories.json`)
- **Industry:** travel (see `../../taxonomy/industries.json`)
- **Business Model:** agency (see `../../taxonomy/business-models.json`)
- **Created At:** 2026-07-16
- **Last Updated:** 2026-07-16
- **Canonical:** false — this is a real authored business, not the
  reference structure (see `../ai-automation-agency/` for that).

## Description

A boutique travel agency specializing in curated small-group and custom
adventure trips (multi-day trekking, hiking, adventure sports) for
active travelers aged 30-55, built on the founder's own firsthand trip
experience rather than a generic booking-platform catalog. Distinct
from `boutique-travel-agencies`' "Luxury Honeymoon Planning Agency"
elsewhere in this catalog (also a P2 candidate in the same category):
this business targets active, adventure-seeking travelers rather than
romantic/luxury occasions, and requires genuine frequent personal
travel by the founder to vet destinations and guide partners — the
only business authored so far in this library with a genuine, frequent
travel requirement as a defining characteristic. The first
`boutique-travel-agencies` P2 business authored under this batch.

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
`translationKey` under `businessLibrary.adventureTravelBoutiqueAgency.*`
in `messages/en.json` and `messages/ro.json`. `business-dna.json`'s
narrative fields are inline bilingual `{ en, ro }` objects instead, per
`features/business-dna`'s own (frozen) schema convention — except its
Section 18 `resources` list, which uses `translationKey` references into
`businessLibrary.adventureTravelBoutiqueAgency.businessDna.resources.*`.
