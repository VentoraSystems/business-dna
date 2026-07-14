# Veterinary Clinic

- **Business Name:** Willowbrook Veterinary Clinic
- **Version:** 1.0.0
- **Status:** published
- **Category:** veterinary-clinics (see `../../taxonomy/categories.json`)
- **Industry:** health (see `../../taxonomy/industries.json`)
- **Business Model:** service (see `../../taxonomy/business-models.json`)
- **Created At:** 2026-07-14
- **Last Updated:** 2026-07-14
- **Canonical:** false — this is a real authored business, not the
  reference structure (see `../ai-automation-agency/` for that).

## Description

A small-animal (dog and cat) general veterinary practice built around a
dedicated, unhurried relationship with one veterinarian, differentiated
from rotating corporate veterinary chains by a wellness-plan subscription
that smooths revenue and keeps preventive care consistent. This is a
regulated, licensed clinical practice — this package is business-planning
content only (how to finance, staff, schedule, and grow the practice as a
business), not veterinary medical, diagnostic, or clinical-treatment
guidance, following the same educational-framing discipline established
for the Professional Services batch and `dental-clinic` elsewhere in this
catalog. No treatment protocols, diagnostic criteria, or clinical
procedures are described anywhere in this package. Distinct from
`dental-clinic` and `psychology-practice` elsewhere in this catalog (also
licensed healthcare-adjacent practices): this business treats animal
patients (not human patients or clients), its core differentiator is a
recurring wellness-plan subscription rather than elective cosmetic
add-ons, and its emotional register is compassion-driven pet-family care
rather than cosmetic enhancement or mental-health support. The first
business authored under the new `veterinary-clinics` category.

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
`translationKey` under `businessLibrary.veterinaryClinic.*` in
`messages/en.json` and `messages/ro.json`. `business-dna.json`'s narrative
fields are inline bilingual `{ en, ro }` objects instead, per
`features/business-dna`'s own (frozen) schema convention — except its
Section 18 `resources` list, which uses `translationKey` references into
`businessLibrary.veterinaryClinic.businessDna.resources.*`.
