# Business Consultancy

- **Business Name:** Vantage Point Consulting
- **Version:** 1.0.0
- **Status:** published
- **Category:** business-consultancies (see `../../taxonomy/categories.json`)
- **Industry:** professionalServices (see `../../taxonomy/industries.json`)
- **Business Model:** service (see `../../taxonomy/business-models.json`)
- **Created At:** 2026-07-09
- **Last Updated:** 2026-07-09
- **Canonical:** false — this is a real authored business, not the
  reference structure (see `../ai-automation-agency/` for that).

> **Disclaimer:** This package contains educational business-building
> guidance only — how to run and grow a strategy and management
> consultancy as a business. It is not strategic, legal, or financial
> advice for any end client, and must never be treated as a substitute
> for advice from a qualified professional. The epic that authored this
> batch named Law Firm/HR Consultancy/Recruitment Agency as the
> regulated-adjacent businesses requiring this disclaimer; it is added
> here too for consistency, since this business also gives advisory
> guidance that could be mistaken for professional advice if left
> unqualified.

## Description

A strategy and management consultancy serving growing companies (20-200
employees) facing a specific strategic decision, built on a signature
diagnostic framework, project fees, and a growth path toward advisory
retainers and a productized offer.

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
`translationKey` under `businessLibrary.businessConsultancy.*` in
`messages/en.json` and `messages/ro.json`. `business-dna.json`'s
narrative fields are inline bilingual `{ en, ro }` objects instead, per
`features/business-dna`'s own (frozen) schema convention.
