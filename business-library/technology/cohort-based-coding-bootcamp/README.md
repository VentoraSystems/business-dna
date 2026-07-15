# Cohort-Based Coding Bootcamp

- **Business Name:** Foundry Code School
- **Version:** 1.0.0
- **Status:** published
- **Category:** online-course-platforms (see `../../taxonomy/categories.json`)
- **Industry:** education (see `../../taxonomy/industries.json`)
- **Business Model:** service (see `../../taxonomy/business-models.json`)
- **Created At:** 2026-07-15
- **Last Updated:** 2026-07-15
- **Canonical:** false — this is a real authored business, not the
  reference structure (see `../ai-automation-agency/` for that).

## Description

A live, instructor-led, cohort-based full-stack web development
bootcamp for career changers, delivered in small cohorts of 20-30
students with fixed start dates, structured accountability, and
job-placement support — monetized through upfront tuition or an
income-share-agreement (ISA) alternative. The first business authored
under `online-course-platforms` — a live-instruction, cohort-based
service business, deliberately distinct in kind from the self-paced,
content-based `saas`/`subscription`/`content` businesses still
unauthored elsewhere in this category (e.g. a future self-paced
language-learning platform would be asynchronous and infinitely
scalable; this bootcamp is synchronous, cohort-capped, and bounded by
instructor capacity per cohort). Not solo-friendly — running live
cohort instruction plus dedicated career-services support requires a
small team of instructors and career coaches from day one.

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
`translationKey` under `businessLibrary.cohortBasedCodingBootcamp.*`
in `messages/en.json` and `messages/ro.json`. `business-dna.json`'s
narrative fields are inline bilingual `{ en, ro }` objects instead, per
`features/business-dna`'s own (frozen) schema convention — except its
Section 18 `resources` list, which uses `translationKey` references into
`businessLibrary.cohortBasedCodingBootcamp.businessDna.resources.*`.
