# Tech Recruitment Agency

- **Business Name:** Vector Tech Talent
- **Version:** 1.0.0
- **Status:** published
- **Category:** recruitment-agencies (see `../../taxonomy/categories.json`)
- **Industry:** tech (see `../../taxonomy/industries.json`)
- **Business Model:** agency (see `../../taxonomy/business-models.json`)
- **Created At:** 2026-07-16
- **Last Updated:** 2026-07-16
- **Canonical:** false — this is a real authored business, not the
  reference structure (see `../ai-automation-agency/` for that).

## Description

A tech-specialized recruitment agency placing software engineers,
DevOps/SRE, and data professionals for startups and scale-ups competing
in a tight technical talent market. Revenue is contingency placement
fees (a percentage of first-year salary) with a limited
placement-guarantee period, plus an optional retained-search tier for
senior and leadership technical roles.

Distinct from the generalist `recruitment-agency` elsewhere in this
library — this is not "recruitment but for tech," it is a genuinely
different operating model in three concrete ways. First, the screening
competency itself is the differentiator: Crestpoint Talent Partners'
recruiters build broad candidate pipelines and negotiate, while Vector
Tech Talent's recruiters must be able to technically vet engineering
candidates themselves — running a structured technical-interview
rubric and coordinating take-home assessments to verify real skill
against resume keyword-matching, reflected in materially higher
`programming`/`technology` skill ratings than a generalist agency would
plausibly carry. Second, sourcing channels differ concretely: Crestpoint
leans on referrals and broad LinkedIn outreach, while Vector Tech Talent
sources directly from GitHub activity, developer-community Slack/Discord
groups, and engineering-conference sponsorships rather than a
relabeled version of the same generalist channels. Third, work mode
differs — Crestpoint is `hybrid`, while Vector Tech Talent is fully
`remote`, matching how heavily remote-friendly both the technical
talent pool and its startup/scale-up clients are.

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

Authored with `industry: "tech"` as a deliberate per-business override
of the `recruitment-agencies` category's `professionalServices` default
(see `../../taxonomy/categories.json`) — the same kind of documented
override already used by `coaching` and `ecommerce` in that file — since
this business's client base, candidate pool, and operating skill set are
all concretely tech-vertical rather than professional-services-generic.

This package does not carry the generic "educational business-building
guidance, not employment-law advice" disclaimer that `recruitment-agency`
carries: recruitment/staffing is not a licensed practice, so no
regulated-content disclaimer is required here.

## Translation keys

Every narrative field in `financial.json`, `marketing.json`,
`roadmap.json`, `resources.json`, and `business-insights.json` is a
`translationKey` under `businessLibrary.techRecruitmentAgency.*` in
`messages/en.json` and `messages/ro.json`. `business-dna.json`'s
narrative fields are inline bilingual `{ en, ro }` objects instead, per
`features/business-dna`'s own (frozen) schema convention.
