# Mobile App Development Agency

- **Business Name:** Copperline Mobile Studio
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

A mobile app development studio built around fixed-scope, per-platform
project delivery: a small team of platform specialists (iOS, Android, or
cross-platform) builds native and cross-platform apps for funded startups
and enterprises, with a dedicated release manager handling App Store and
Play Store submission. Post-launch, clients are converted into an
OS-compatibility maintenance retainer. Distinct from `software-house`
(general custom software/internal tooling, not mobile-specialized) in
this same `technology-services` category — this business specifically
manages mobile-only risks like app-store rejection and OS-version
fragmentation.

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
`translationKey` under `businessLibrary.mobileAppDevelopmentAgency.*` in
`messages/en.json` and `messages/ro.json`. `business-dna.json`'s
narrative fields are inline bilingual `{ en, ro }` objects instead, per
`features/business-dna`'s own (frozen) schema convention.
