# Boutique Pilates Reformer Studio

- **Business Name:** Concord Pilates Studio
- **Version:** 1.0.0
- **Status:** published
- **Category:** boutique-fitness-studios (see `../../taxonomy/categories.json`)
- **Industry:** health (see `../../taxonomy/industries.json`)
- **Business Model:** service (see `../../taxonomy/business-models.json`)
- **Created At:** 2026-07-16
- **Last Updated:** 2026-07-16
- **Canonical:** false — this is a real authored business, not the
  reference structure (see `../ai-automation-agency/` for that).

## Description

A small-group reformer Pilates studio built around low-impact strength
training on dedicated reformer equipment, delivered through
membership-based recurring revenue rather than one-off appointments.
Targets women aged 28-55 seeking low-impact strength and mobility work
— including a meaningful injury-recovery and midlife-fitness segment
underserved by higher-impact boutique fitness formats (HIIT, cycling).
Not a licensed clinical practice — Pilates instruction is a certified
craft skill, not a government-regulated profession, so this package
follows the same non-regulated staffed-craft-business framing already
established for `beauty-salon` elsewhere in this catalog, not the
Batch-4 licensed-clinical-practice discipline. The first business
authored under the new `boutique-fitness-studios` category.

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
`translationKey` under `businessLibrary.boutiquePilatesStudio.*` in
`messages/en.json` and `messages/ro.json`. `business-dna.json`'s
narrative fields are inline bilingual `{ en, ro }` objects instead, per
`features/business-dna`'s own (frozen) schema convention — except its
Section 18 `resources` list, which uses `translationKey` references into
`businessLibrary.boutiquePilatesStudio.businessDna.resources.*`.
