# AI Customer Support Chatbot Studio

- **Business Name:** Loop Chatbot Studio
- **Version:** 1.0.0
- **Status:** published
- **Category:** technology-services (see `../../taxonomy/categories.json`)
- **Industry:** tech (see `../../taxonomy/industries.json`)
- **Business Model:** agency (see `../../taxonomy/business-models.json`)
- **Created At:** 2026-07-16
- **Last Updated:** 2026-07-16
- **Canonical:** false — this is a real authored business, not the
  reference structure (see `../ai-automation-agency/` for that).

## Description

A boutique agency that designs, implements, and manages AI-powered
customer support chatbots for e-commerce and SaaS companies, built on
top of established platforms (Intercom Fin, Zendesk) rather than a
custom in-house LLM product. Distinct from `technology-services`'
"Custom LLM Integration Consultancy" elsewhere in this catalog (a
broader software-engineering consultancy building bespoke AI
integrations): this is a narrower, productized managed service focused
specifically on customer-support ticket deflection and resolution,
sold and delivered like a specialized marketing or web-development
agency rather than a custom-engineering shop. Targets e-commerce and
SaaS companies with real support-ticket volume who want measurable
ticket-resolution results without building an in-house AI team. The
first business authored under P2 Batch 6.

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
`translationKey` under `businessLibrary.aiChatbotSupportStudio.*` in
`messages/en.json` and `messages/ro.json`. `business-dna.json`'s
narrative fields are inline bilingual `{ en, ro }` objects instead, per
`features/business-dna`'s own (frozen) schema convention — except its
Section 18 `resources` list, which uses `translationKey` references into
`businessLibrary.aiChatbotSupportStudio.businessDna.resources.*`.
