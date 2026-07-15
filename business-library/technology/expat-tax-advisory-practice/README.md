# Expat Tax Advisory Practice

- **Business Name:** Meridian Expat Tax
- **Version:** 1.0.0
- **Status:** published
- **Category:** tax-consultancies (see `../../taxonomy/categories.json`)
- **Industry:** finance (see `../../taxonomy/industries.json`)
- **Business Model:** service (see `../../taxonomy/business-models.json`)
- **Created At:** 2026-07-15
- **Last Updated:** 2026-07-15
- **Canonical:** false — this is a real authored business, not the
  reference structure (see `../ai-automation-agency/` for that).

## Regulated-content notice

This is a licensed tax-advisory practice (Enrolled Agent-tier, with
additional cross-border/FATCA-compliance training). Every asset in
this package is educational business-planning content only — how to
build, market, price, and operate an expat tax advisory practice as a
business. Nothing here is tax, legal, or compliance advice for any
end client, and none of it should be treated as a substitute for
advice from a licensed professional.

## Description

A fully remote tax-advisory practice specializing in cross-border
compliance for individuals living outside their country of tax
residency — U.S. citizens and green-card holders living abroad who
must file both a home-country return (including FBAR/FATCA foreign
account disclosures) and a host-country return, plus a smaller base
of digital nomads and cross-border remote workers navigating tax
treaties and totalization agreements. Deliberately differentiated
from `tax-consultancy` elsewhere in this category: a cross-border,
year-round compliance niche rather than a domestic, calendar-year-
concentrated individual/business tax practice — fully remote rather
than hybrid, an annual dual-country compliance retainer rather than a
purely seasonal engagement (`isSeasonalBusiness: false` vs.
`tax-consultancy`'s `true`), a narrower expat/digital-nomad-community
referral channel rather than local-accountant referrals plus local
SEO, and materially higher liability stakes given FBAR/FATCA
non-compliance penalty exposure. Solo-friendly at launch, unlike most
of this batch's other businesses, given the practice can start as a
single credentialed specialist serving clients entirely remotely.

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
`translationKey` under `businessLibrary.expatTaxAdvisoryPractice.*` in
`messages/en.json` and `messages/ro.json`. `business-dna.json`'s
narrative fields are inline bilingual `{ en, ro }` objects instead, per
`features/business-dna`'s own (frozen) schema convention — except its
Section 18 `resources` list, which uses `translationKey` references into
`businessLibrary.expatTaxAdvisoryPractice.businessDna.resources.*`.
