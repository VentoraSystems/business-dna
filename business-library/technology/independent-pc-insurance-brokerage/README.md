# Independent P&C Insurance Brokerage

- **Business Name:** Keystone P&C Brokerage
- **Version:** 1.0.0
- **Status:** published
- **Category:** insurance-brokerages (see `../../taxonomy/categories.json`)
- **Industry:** finance (see `../../taxonomy/industries.json`)
- **Business Model:** agency (see `../../taxonomy/business-models.json`)
- **Created At:** 2026-07-15
- **Last Updated:** 2026-07-15
- **Canonical:** false — this is a real authored business, not the
  reference structure (see `../ai-automation-agency/` for that).

## Regulated-content notice

This is a licensed insurance-sales business. Every asset in this
package is educational business-planning content only — how to build,
market, price, and operate an independent P&C insurance brokerage as a
business. Nothing here is insurance, coverage, or claims advice for
any end client, and none of it should be treated as a substitute for
advice from a licensed insurance professional.

## Description

An independent property & casualty (P&C) insurance brokerage
specializing in landlords and rental-property investors with
multi-property portfolios, placing landlord policies, umbrella
liability, and builder's-risk coverage across multiple carriers, plus
surplus/excess-lines placement for hard-to-place risks. Deliberately
differentiated from `insurance-brokerage` (the existing general
multi-line personal-insurance P1 package) elsewhere in this category:
a specific niche (landlord/rental-property portfolios) rather than
general personal lines, a portfolio-coverage-gap-review sales
approach rather than a general "shop it for you across carriers"
approach, and a dual commission-plus-surplus-lines-broker-fee revenue
model rather than a purely commission-only model. Solo-friendly at
launch, matching the general brokerage's precedent.

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
`translationKey` under `businessLibrary.independentPcInsuranceBrokerage.*`
in `messages/en.json` and `messages/ro.json`. `business-dna.json`'s
narrative fields are inline bilingual `{ en, ro }` objects instead, per
`features/business-dna`'s own (frozen) schema convention — except its
Section 18 `resources` list, which uses `translationKey` references into
`businessLibrary.independentPcInsuranceBrokerage.businessDna.resources.*`.
