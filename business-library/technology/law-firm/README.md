# Law Firm

- **Business Name:** Fairview Legal Partners
- **Version:** 1.0.0
- **Status:** published
- **Category:** law-firms (see `../../taxonomy/categories.json`)
- **Industry:** professionalServices (see `../../taxonomy/industries.json`)
- **Business Model:** service (see `../../taxonomy/business-models.json`)
- **Created At:** 2026-07-09
- **Last Updated:** 2026-07-09
- **Canonical:** false — this is a real authored business, not the
  reference structure (see `../ai-automation-agency/` for that).

> **Disclaimer:** This package contains educational business-building
> guidance only — how to run and grow a boutique business-law practice
> as a business. It is not legal advice for any end client, and must
> never be treated as a substitute for advice from a licensed attorney.

## Description

A boutique business-law practice serving startups and small companies
with contracts, formation documents, and general-counsel retainers,
built on flat-fee predictability and bar-certified reliability.

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

This is the first package authored with `industry: "professionalServices"`
— the new `IndustryType` value added in this sprint's Taxonomy Expansion
(see `../../taxonomy/industries.json` and
`src/features/business-engine/schemas/enums.ts`). See
`../accounting-firm/README.md` for why `financial.json`/`marketing.json`/
`roadmap.json`/`resources.json` validate against the current
`features/*` Business Assets schemas rather than
`../ai-automation-agency/`'s stale business-engine-template mirrors.

## Translation keys

Every narrative field in `financial.json`, `marketing.json`,
`roadmap.json`, `resources.json`, and `business-insights.json` is a
`translationKey` under `businessLibrary.lawFirm.*` in `messages/en.json`
and `messages/ro.json`. `business-dna.json`'s narrative fields are
inline bilingual `{ en, ro }` objects instead, per `features/business-dna`'s
own (frozen) schema convention.
