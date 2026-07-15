# Personal Trainer Booking Marketplace

- **Business Name:** Coachline
- **Version:** 1.0.0
- **Status:** published
- **Category:** local-service-marketplaces (see `../../taxonomy/categories.json`)
- **Industry:** health (see `../../taxonomy/industries.json`)
- **Business Model:** marketplace (see `../../taxonomy/business-models.json`)
- **Created At:** 2026-07-15
- **Last Updated:** 2026-07-15
- **Canonical:** false — this is a real authored business, not the
  reference structure (see `../ai-automation-agency/` for that).

## Description

A two-sided marketplace connecting clients with certified personal
trainers for in-person sessions at a gym, park, or the client's home,
monetized through a commission on each session booking plus an
optional gym-partner revenue share. The library's third genuine
two-sided marketplace, after `tutoring-help-marketplace` and
`home-repair-marketplace` — deliberately differentiated from both:
session-based booking like tutoring rather than home-repair's
quote-based job pricing, but with home-repair's seriousness of
liability verification rather than tutoring's background-check-only
vetting — trainers here must carry NASM/ACE/ISSA-tier certification
plus professional liability insurance covering physical-injury risk
during training, a distinct risk category from both tutoring's minor-
safety angle and home-repair's property-damage angle. A dedicated
gym-and-studio-partnership supply channel (listing a partner gym's
in-house trainers) is also unique to this marketplace among the
three. Not solo-friendly — the operational complexity of certification
verification, liability-insurance underwriting, and geo-radius
matching requires a small team from day one.

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
`translationKey` under `businessLibrary.personalTrainerMarketplace.*` in
`messages/en.json` and `messages/ro.json`. `business-dna.json`'s
narrative fields are inline bilingual `{ en, ro }` objects instead, per
`features/business-dna`'s own (frozen) schema convention — except its
Section 18 `resources` list, which uses `translationKey` references into
`businessLibrary.personalTrainerMarketplace.businessDna.resources.*`.
