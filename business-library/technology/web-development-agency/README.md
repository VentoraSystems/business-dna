# Web Development Agency

- **Business Name:** Lightwell Web Studio
- **Version:** 1.0.0
- **Status:** published
- **Category:** technology-services (see `../../taxonomy/categories.json`)
- **Industry:** tech (see `../../taxonomy/industries.json`)
- **Business Model:** agency (see `../../taxonomy/business-models.json`)
- **Created At:** 2026-07-10
- **Last Updated:** 2026-07-10
- **Canonical:** false — this is a real authored business, not the
  reference structure (see `../ai-automation-agency/` for that).

## Description

A fast-turnaround, template-based web design studio built around a
published, fixed-price tiered menu (landing page / brochure site /
e-commerce storefront) and a strict one-round-of-revisions policy that
keeps project turnaround under three weeks. Targets small and local
businesses and startups that need a credible web presence without a
six-figure custom-agency budget. Distinct from `software-house` (bespoke,
fixed-scope engineering for problems a template can't solve) — this
business explicitly competes on speed and price via templates, not custom
code, even though both share the `technology-services` category.

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
`translationKey` under `businessLibrary.webDevelopmentAgency.*` in
`messages/en.json` and `messages/ro.json`. `business-dna.json`'s
narrative fields are inline bilingual `{ en, ro }` objects instead, per
`features/business-dna`'s own (frozen) schema convention.
