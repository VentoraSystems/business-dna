# Psychology Practice

- **Business Name:** Clearwater Counseling Practice
- **Version:** 1.0.0
- **Status:** published
- **Category:** psychology-practices (see `../../taxonomy/categories.json`)
- **Industry:** health (see `../../taxonomy/industries.json`)
- **Business Model:** service (see `../../taxonomy/business-models.json`)
- **Created At:** 2026-07-14
- **Last Updated:** 2026-07-14
- **Canonical:** false — this is a real authored business, not the
  reference structure (see `../ai-automation-agency/` for that).

## Description

A solo private-pay psychotherapy practice serving working professionals
navigating anxiety, stress, and life transitions, delivered through a
hybrid of telehealth and in-person sessions with a specialty in
evening/early-morning scheduling that fits around a full-time job. This
is a regulated, licensed clinical practice — this package is
business-planning content only (how to license, price, schedule, and
grow the practice as a business), not psychological, diagnostic, or
clinical-treatment guidance, following the same educational-framing
discipline established for the Professional Services batch and
`dental-clinic`/`veterinary-clinic` elsewhere in this catalog. No
treatment modalities, diagnostic criteria, or clinical intervention
techniques are described anywhere in this package. Because this content
is mental-health-adjacent, the business description and positioning are
kept to what a real practice would say in its own marketing — no
clinical claims about outcomes, efficacy, or diagnosis. Distinct from
`dental-clinic` and `veterinary-clinic` elsewhere in this catalog (also
licensed healthcare-adjacent practices): this is the only one of the
three that is genuinely solo-founder-friendly and low-startup-budget,
since talk therapy carries no equivalent capital-equipment burden, and
its client relationship is a private, ongoing one-to-one conversation
rather than a staffed clinical facility visit. The first business
authored under the new `psychology-practices` category.

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
`translationKey` under `businessLibrary.psychologyPractice.*` in
`messages/en.json` and `messages/ro.json`. `business-dna.json`'s
narrative fields are inline bilingual `{ en, ro }` objects instead, per
`features/business-dna`'s own (frozen) schema convention — except its
Section 18 `resources` list, which uses `translationKey` references into
`businessLibrary.psychologyPractice.businessDna.resources.*`.
