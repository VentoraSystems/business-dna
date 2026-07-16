# Self-Paced Language Platform

- **Business Name:** Lingoloop
- **Version:** 1.0.0
- **Status:** published
- **Category:** online-course-platforms (see `../../taxonomy/categories.json`)
- **Industry:** education (see `../../taxonomy/industries.json`)
- **Business Model:** saas (see `../../taxonomy/business-models.json`)
- **Created At:** 2026-07-16
- **Last Updated:** 2026-07-16
- **Canonical:** false — this is a real authored business, not the
  reference structure (see `../ai-automation-agency/` for that).

## Description

An asynchronous, self-paced language-learning SaaS platform combining
short video micro-lessons, spaced-repetition vocabulary drilling, and
on-demand AI conversation practice — a chat- and voice-based AI tutor
for speaking practice, with no human-tutor scheduling required.
Subscribers can start any day and progress at their own pace, with no
live cohorts, no fixed start dates, and no instructor-capacity
bottleneck, monetized through a tiered monthly/annual subscription (a
free/limited tier plus paid tiers unlocking more languages, unlimited
AI conversation practice, and offline lesson downloads). Distinct from
`cohort-based-coding-bootcamp` elsewhere in this library: this
platform's delivery model is structurally opposite (asynchronous and
infinitely scalable, vs. the bootcamp's synchronous, cohort-capped,
instructor-capacity-bound format), its business model and revenue
economics differ (a recurring `saas` subscription with self-serve
signup and gradually-building MRR, vs. the bootcamp's upfront-tuition-
or-ISA `service` revenue tied to a single cohort's completion), and its
retention mechanics differ (individual habit formation — daily
practice streaks and spaced-repetition review reminders — vs. the
bootcamp's cohort-completion and career-outcome accountability). Not
solo-friendly — the parallel content-production and AI-infrastructure
build is demanding, but for different reasons than the bootcamp: it
requires engineering and content-production capacity, not
people-management of instructors and career coaches.

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
`translationKey` under `businessLibrary.selfPacedLanguagePlatform.*` in
`messages/en.json` and `messages/ro.json`. `business-dna.json`'s
narrative fields are inline bilingual `{ en, ro }` objects instead, per
`features/business-dna`'s own (frozen) schema convention — except its
Section 18 `resources` list, which uses `translationKey` references into
`businessLibrary.selfPacedLanguagePlatform.businessDna.resources.*`.
