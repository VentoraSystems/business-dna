# RPA Workflow Automation Consultancy

- **Business Name:** Steadywork Automation
- **Version:** 1.0.0
- **Status:** published
- **Category:** technology-services (see `../../taxonomy/categories.json`)
- **Industry:** tech (see `../../taxonomy/industries.json`)
- **Business Model:** service (see `../../taxonomy/business-models.json`)
- **Created At:** 2026-07-15
- **Last Updated:** 2026-07-15
- **Canonical:** false — this is a real authored business, not the
  reference structure (see `../ai-automation-agency/` for that).

## Description

A robotic process automation (RPA) consultancy that builds and
maintains rules-based software bots — not AI agents, not custom
software — to eliminate specific, repetitive, manual data-entry and
data-transfer work between systems that don't natively integrate:
copying line items from an invoice PDF into an ERP, moving data between
a legacy system and a spreadsheet, reconciling two reports by hand
every week. Deliberately distinct from `ai-automation-agency` (broad AI
automation strategy), `ai-chatbot-support-studio` (AI-native customer
support), and `software-house` (custom software development): this
business sells narrow, deterministic, rules-based bot builds against
tools like UiPath and Power Automate, priced per workflow rather than
per project scope, with a fixed monthly maintenance retainer once a bot
is live.

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
`translationKey` under `businessLibrary.rpaWorkflowConsultancy.*` in
`messages/en.json` and `messages/ro.json`. `business-dna.json`'s
narrative fields are inline bilingual `{ en, ro }` objects instead, per
`features/business-dna`'s own (frozen) schema convention — except its
Section 18 `resources` list, which uses `translationKey` references into
`businessLibrary.rpaWorkflowConsultancy.businessDna.resources.*`.
