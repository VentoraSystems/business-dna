# Cloud Bookkeeping Service for Startups

- **Business Name:** Runway Bookkeeping
- **Version:** 1.0.0
- **Status:** published
- **Category:** accounting-firms (see `../../taxonomy/categories.json`)
- **Industry:** finance (see `../../taxonomy/industries.json`)
- **Business Model:** service (see `../../taxonomy/business-models.json`)
- **Created At:** 2026-07-16
- **Last Updated:** 2026-07-16
- **Canonical:** false — this is a real authored business, not the
  reference structure (see `../ai-automation-agency/` for that).

> **Disclaimer:** This package contains educational business-building
> guidance only — how to run and grow a startup-focused bookkeeping
> practice as a business. It is not accounting, tax, or financial advice
> for any end client, and must never be treated as a substitute for
> advice from a licensed professional. This follows the same
> educational-framing discipline already established for `accounting-firm`
> and the other regulated Professional/Financial Services packages in
> this library.

## Description

A fully remote, cloud-native bookkeeping subscription built specifically
for early-stage venture-backed and bootstrapped startups (pre-seed
through Series A), delivering investor-ready monthly financials —
P&L, burn rate, and runway — through heavy automation on top of modern
fintech tools (Ramp, QuickBooks Online). Distinct from `accounting-firm`
elsewhere in this catalog (a general small-business bookkeeping and tax
practice with hybrid delivery, referral-driven sales through lawyers and
consultants, and a path toward fractional-CFO work for general SMBs):
this business is fully remote (not hybrid), sells flat predictable
monthly tiers rather than a transaction-volume retainer, acquires
clients through startup accelerator and VC network relationships rather
than professional-services referrals, and is built around
investor-reporting fluency (burn rate, runway, R&D tax credits) as its
core differentiator rather than general month-end-close speed. A
genuinely different niche and go-to-market, not a reskin of the same
business.

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
`translationKey` under `businessLibrary.cloudBookkeepingStartups.*` in
`messages/en.json` and `messages/ro.json`. `business-dna.json`'s
narrative fields are inline bilingual `{ en, ro }` objects instead, per
`features/business-dna`'s own (frozen) schema convention — except its
Section 18 `resources` list, which uses `translationKey` references into
`businessLibrary.cloudBookkeepingStartups.businessDna.resources.*`.
