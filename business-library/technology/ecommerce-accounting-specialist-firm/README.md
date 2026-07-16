# E-commerce Accounting Specialist Firm

- **Business Name:** Nexus Ledger Co.
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
> guidance only — how to run and grow an accounting practice as a
> business. It is not accounting, tax, or financial advice for any end
> client, and must never be treated as a substitute for advice from a
> licensed professional.

## Description

A fully remote bookkeeping and accounting practice specialized
exclusively in multi-channel e-commerce sellers — brands selling across
Shopify, Amazon FBA, Etsy, and wholesale simultaneously. Core expertise
covers three specific mechanics: multi-channel sales reconciliation
(pulling and reconciling revenue, fees, refunds, and payouts from
multiple sales-channel platforms into one clean general ledger),
inventory/COGS accounting (landed-cost calculation across product,
freight, and duties, plus FIFO/weighted-average inventory valuation for
accurate gross-margin reporting), and sales-tax-nexus compliance
(tracking economic-nexus thresholds across US states as a multi-channel
seller crosses them, and coordinating registration and filing). Revenue
comes from a monthly retainer tiered by number of sales channels
connected and monthly order volume, plus a one-off "nexus exposure
review" project fee for sellers unsure which states they already owe
sales tax in.

Distinct from both `accounting-firm` and `cloud-bookkeeping-startups`
elsewhere in this library. `accounting-firm` (Meridian Accounting
Partners) is a generalist small-business bookkeeping and tax practice
serving any industry with hybrid delivery and month-end-close speed as
its core value proposition — multi-channel fee reconciliation, landed
cost, and FIFO inventory valuation are simply not part of its service,
because a typical local-services client never needs them.
`cloud-bookkeeping-startups` (Runway Bookkeeping) is also remote and
niche-specialized, but its niche is venture-backed and bootstrapped
SaaS-style startups needing investor-ready burn-rate and runway
reporting — it does not do retail/inventory accounting, multi-channel
sales reconciliation, or sales-tax-nexus tracking, because those
concepts barely apply to a pre-revenue or early-revenue SaaS company.
Nexus Ledger Co.'s clients are typically profitable or near-profitable
operating e-commerce businesses with real inventory and real multi-state
sales-tax exposure — a genuinely different accounting skill set and
client profile from either sibling: it serves e-commerce sellers only,
its core competency is multi-channel reconciliation and inventory-COGS
accounting rather than general bookkeeping or startup-metrics fluency,
and sales-tax-nexus tracking (a genuine, ongoing compliance risk for a
multi-channel seller crossing state thresholds) is a concern neither
sibling's client base meaningfully carries. A genuinely different niche
and go-to-market, not a reskin of the same business.

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
`translationKey` under `businessLibrary.ecommerceAccountingSpecialistFirm.*`
in `messages/en.json` and `messages/ro.json`. `business-dna.json`'s
narrative fields are inline bilingual `{ en, ro }` objects instead, per
`features/business-dna`'s own (frozen) schema convention — except its
Section 18 `resources` list, which uses `translationKey` references into
`businessLibrary.ecommerceAccountingSpecialistFirm.businessDna.resources.*`.
