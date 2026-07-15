# Indoor Cycling Studio

- **Business Name:** Pulseline Cycling Studio
- **Version:** 1.0.0
- **Status:** published
- **Category:** boutique-fitness-studios (see `../../taxonomy/categories.json`)
- **Industry:** health (see `../../taxonomy/industries.json`)
- **Business Model:** subscription (see `../../taxonomy/business-models.json`)
- **Created At:** 2026-07-15
- **Last Updated:** 2026-07-15
- **Canonical:** false — this is a real authored business, not the
  reference structure (see `../ai-automation-agency/` for that).

## Description

A high-intensity, music-driven indoor cycling studio built around
45-minute rhythm-based rides on power-meter-equipped bikes, with
live performance leaderboards and milestone-ride rewards driving
retention, monetized through an unlimited monthly membership plus
class packs and drop-ins. The second business authored under
`boutique-fitness-studios`, after `boutique-pilates-studio` —
deliberately differentiated from it: high-intensity cardio rather
than low-impact strength and mobility, a younger cardio-focused
target customer rather than an injury-recovery and midlife-fitness
niche, and a competitive leaderboard/milestone-ride retention
mechanic rather than a straightforward membership-renewal model. Not
a licensed clinical practice — a certified craft-skill service
business, matching the `boutique-pilates-studio` precedent. Not
solo-friendly: running a full weekly class schedule requires a small
team of certified instructors from day one.

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
`translationKey` under `businessLibrary.indoorCyclingStudio.*` in
`messages/en.json` and `messages/ro.json`. `business-dna.json`'s
narrative fields are inline bilingual `{ en, ro }` objects instead, per
`features/business-dna`'s own (frozen) schema convention — except its
Section 18 `resources` list, which uses `translationKey` references into
`businessLibrary.indoorCyclingStudio.businessDna.resources.*`.
