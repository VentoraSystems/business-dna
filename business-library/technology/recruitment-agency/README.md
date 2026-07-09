# Recruitment Agency

- **Business Name:** Crestpoint Talent Partners
- **Version:** 1.0.0
- **Status:** published
- **Category:** recruitment-agencies (see `../../taxonomy/categories.json`)
- **Industry:** professionalServices (see `../../taxonomy/industries.json`)
- **Business Model:** service (see `../../taxonomy/business-models.json`)
- **Created At:** 2026-07-09
- **Last Updated:** 2026-07-09
- **Canonical:** false — this is a real authored business, not the
  reference structure (see `../ai-automation-agency/` for that).

> **Disclaimer:** This package contains educational business-building
> guidance only — how to run and grow a recruitment agency as a
> business. It is not employment-law compliance or legal advice for any
> end client, and must never be treated as a substitute for advice from
> a licensed professional.

## Description

A niche-specialized recruitment agency built on contingency and
retained-search placement fees, a deep candidate pipeline, and a growth
path toward a second recruiter. Targets small-to-mid-sized companies
hiring for hard-to-fill, specialized roles.

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

Authored with `industry: "professionalServices"` — see
`../law-firm/README.md` for background on this sprint's Taxonomy
Expansion, and `../accounting-firm/README.md` for why
`financial.json`/`marketing.json`/`roadmap.json`/`resources.json`
validate against the current `features/*` Business Assets schemas
rather than `../ai-automation-agency/`'s stale mirrors.

## Translation keys

Every narrative field in `financial.json`, `marketing.json`,
`roadmap.json`, `resources.json`, and `business-insights.json` is a
`translationKey` under `businessLibrary.recruitmentAgency.*` in
`messages/en.json` and `messages/ro.json`. `business-dna.json`'s
narrative fields are inline bilingual `{ en, ro }` objects instead, per
`features/business-dna`'s own (frozen) schema convention.
