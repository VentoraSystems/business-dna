# Real Estate Agency

- **Business Name:** Bellwood Realty Group
- **Version:** 1.0.0
- **Status:** published
- **Category:** real-estate (see `../../taxonomy/categories.json`)
- **Industry:** homeServices (see `../../taxonomy/industries.json`)
- **Business Model:** agency (see `../../taxonomy/business-models.json`)
- **Created At:** 2026-07-10
- **Last Updated:** 2026-07-10
- **Canonical:** false — this is a real authored business, not the
  reference structure (see `../ai-automation-agency/` for that).

## Description

A solo, commission-based residential real estate agent representing
buyers and sellers in a specific local neighborhood, working under a
sponsoring brokerage, growing primarily through neighborhood farming and
past-client referrals. The `homeServices` industry assignment is a
deliberately acknowledged imperfect fit — no `IndustryType` value maps
precisely onto real estate brokerage — but it is the closest existing
value and no new enum value was introduced to accommodate it. This is a
transaction/brokerage business — distinct from `architecture-studio`
elsewhere in this library, which is a design/build fee-for-service
professional practice. Real estate agents broker existing-property
transactions for a commission; architects design and legally oversee new
construction for a fee. The first business authored under the new
`real-estate` category.

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
`translationKey` under `businessLibrary.realEstateAgency.*` in
`messages/en.json` and `messages/ro.json`. `business-dna.json`'s
narrative fields are inline bilingual `{ en, ro }` objects instead, per
`features/business-dna`'s own (frozen) schema convention — except its
Section 18 `resources` list, which uses `translationKey` references into
`businessLibrary.realEstateAgency.businessDna.resources.*`.
