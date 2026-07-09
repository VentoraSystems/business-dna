# Insurance Brokerage

- **Business Name:** Harborlight Insurance Brokerage
- **Version:** 1.0.0
- **Status:** published
- **Category:** insurance-brokerages (see `../../taxonomy/categories.json`)
- **Industry:** finance (see `../../taxonomy/industries.json`)
- **Business Model:** agency (see `../../taxonomy/business-models.json`)
- **Created At:** 2026-07-09
- **Last Updated:** 2026-07-09
- **Canonical:** false — this is a real authored business, not the
  reference structure (see `../ai-automation-agency/` for that).

> **Disclaimer:** This package contains educational business-building
> guidance only — how to run and grow an independent insurance
> brokerage as a business. It is not insurance, coverage, or claims
> advice for any end client, and must never be treated as a substitute
> for advice from a licensed insurance professional.

## Description

An independent, multi-carrier insurance brokerage built on new-business
and renewal commissions, cross-selling into an existing client book,
and a growing commercial-lines practice. Targets homeowners, families,
and small-business owners tired of dealing with a captive single-carrier
agent.

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

See `../accounting-firm/README.md` for the full explanation of why
this package's `financial.json`/`marketing.json`/`roadmap.json`/
`resources.json` validate against the newer `features/*` Business
Assets schemas rather than `../ai-automation-agency/`'s stale
business-engine-template mirrors.

## Translation keys

Every narrative field in `financial.json`, `marketing.json`,
`roadmap.json`, `resources.json`, and `business-insights.json` is a
`translationKey` under `businessLibrary.insuranceBrokerage.*` in
`messages/en.json` and `messages/ro.json`. `business-dna.json`'s
narrative fields are inline bilingual `{ en, ro }` objects instead, per
`features/business-dna`'s own (frozen) schema convention.
