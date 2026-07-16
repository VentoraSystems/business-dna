# Remote-First HR Advisory

- **Business Name:** Latitude HR Advisory
- **Version:** 1.0.0
- **Status:** published
- **Category:** hr-consultancies (see `../../taxonomy/categories.json`)
- **Industry:** professionalServices (see `../../taxonomy/industries.json`)
- **Business Model:** service (see `../../taxonomy/business-models.json`)
- **Created At:** 2026-07-16
- **Last Updated:** 2026-07-16
- **Canonical:** false — this is a real authored business, not the
  reference structure (see `../ai-automation-agency/` for that).

> **Disclaimer:** This package contains educational business-building
> guidance only — how to run and grow a multi-jurisdiction HR advisory
> as a business. It is not employment-law compliance or legal advice
> for any end client in any jurisdiction, and must never be treated as
> a substitute for advice from a licensed professional — a caution that
> matters even more here than for a single-jurisdiction generalist HR
> practice, given the number of jurisdictions this advisory touches.

## Description

An HR advisory built specifically for fully-distributed, remote-first
companies — venture-backed startups and scale-ups, not local SMBs.
Core expertise is multi-jurisdiction employment compliance for hiring
across states and countries: navigating different labor laws, statutory
benefits, and termination rules per jurisdiction; Employer-of-Record
(EOR) versus direct-entity hiring guidance; worker/contractor
misclassification risk review; and remote-specific culture and
operations frameworks (async-first communication norms, time-zone-fair
meeting and PTO policies, distributed onboarding). Revenue is a monthly
retainer tiered by employee headcount and number of hiring
jurisdictions, plus one-off project fees for jurisdiction-expansion
reviews such as "we're hiring our first employee in Germany — audit
what changes."

Distinct from `hr-consultancy` elsewhere in this library — Northbridge
HR Partners serves local/hybrid small businesses (10-75 employees) that
need general HR expertise without a full-time hire (HR audits,
policy/handbook work, standard single-jurisdiction employment).
Latitude HR Advisory serves distributed, often venture-backed companies
whose defining HR problem is multi-jurisdiction complexity — hiring
people in multiple states or countries at once, not general HR support.
The two also differ in work mode (`remote` here versus Northbridge's
`hybrid`, consistent with serving remote-first clients and practicing
what it advises) and in acquisition channel (startup/remote-work-
community channels, VC portfolio-company introductions, and EOR-
platform partner co-marketing here, versus Northbridge's general
small-business referral network of accountants and consultants).

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

Authored with `industry: "professionalServices"`, mirroring
`../hr-consultancy/`'s structure within the same `hr-consultancies`
category — see `../hr-consultancy/README.md` for background on why
`financial.json`/`marketing.json`/`roadmap.json`/`resources.json`
validate against the current `features/*` Business Assets schemas
rather than `../ai-automation-agency/`'s stale mirrors.

## Translation keys

Every narrative field in `financial.json`, `marketing.json`,
`roadmap.json`, `resources.json`, and `business-insights.json` is a
`translationKey` under `businessLibrary.remoteFirstHrAdvisory.*` in
`messages/en.json` and `messages/ro.json`. `business-dna.json`'s
narrative fields are inline bilingual `{ en, ro }` objects instead, per
`features/business-dna`'s own (frozen) schema convention — except its
Section 18 `resources` list, which uses `translationKey` references into
`businessLibrary.remoteFirstHrAdvisory.businessDna.resources.*`.
