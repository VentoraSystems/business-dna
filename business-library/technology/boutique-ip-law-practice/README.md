# Boutique IP Law Practice

- **Business Name:** Northgate IP Partners
- **Version:** 1.0.0
- **Status:** published
- **Category:** law-firms (see `../../taxonomy/categories.json`)
- **Industry:** professionalServices (see `../../taxonomy/industries.json`)
- **Business Model:** service (see `../../taxonomy/business-models.json`)
- **Created At:** 2026-07-15
- **Last Updated:** 2026-07-15
- **Canonical:** false — this is a real authored business, not the
  reference structure (see `../ai-automation-agency/` for that).

> **Disclaimer:** This package contains educational business-building
> guidance only — how to run and grow a boutique intellectual-property
> law practice as a business. It is not legal advice for any end
> client, and must never be treated as a substitute for advice from a
> licensed patent attorney or registered patent agent.

## Description

A boutique intellectual-property law practice serving startups and
independent creators with trademark registration, patent prosecution,
and ongoing IP-portfolio management, built on patent-bar-qualified
specialization rather than general business-law practice. Deliberately
distinct from `law-firm` elsewhere in this library (Fairview Legal
Partners — general contracts, formation documents, and general-counsel
retainers for startups and SMBs): this practice is fully remote,
narrowly focused on trademark and patent work, priced with a
flat-fee/hourly split by matter type rather than a blended hourly/GC
retainer model, sourced through accelerator and VC portfolio referrals
rather than lawyer/consultant referrals, and requires deeper technical
subject-matter fluency (investor-reporting and IP-portfolio strategy)
that a general practice doesn't.

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
`translationKey` under `businessLibrary.boutiqueIpLawPractice.*` in
`messages/en.json` and `messages/ro.json`. `business-dna.json`'s
narrative fields are inline bilingual `{ en, ro }` objects instead, per
`features/business-dna`'s own (frozen) schema convention — except its
Section 18 `resources` list, which uses `translationKey` references into
`businessLibrary.boutiqueIpLawPractice.businessDna.resources.*`.
