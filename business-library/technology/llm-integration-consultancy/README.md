# LLM Integration Consultancy

- **Business Name:** Substrate AI
- **Version:** 1.0.0
- **Status:** published
- **Category:** technology-services (see `../../taxonomy/categories.json`)
- **Industry:** tech (see `../../taxonomy/industries.json`)
- **Business Model:** service (see `../../taxonomy/business-models.json`)
- **Created At:** 2026-07-16
- **Last Updated:** 2026-07-16
- **Canonical:** false — this is a real authored business, not the
  reference structure (see `../ai-automation-agency/` for that).

## Description

A boutique software-engineering consultancy that designs and ships bespoke
LLM integrations directly into a client's own proprietary systems and
data: custom RAG (retrieval-augmented generation) pipelines over a
client's internal knowledge base or document corpus, fine-tuning or deep
prompt engineering against a proprietary dataset, and LLM capability
embedded directly into a client's existing enterprise software (ERPs,
internal tools, data warehouses, case-management systems). Sold as
fixed-scope, project-based engineering work — a paid discovery sprint,
then a milestone-billed build, then an optional maintenance retainer —
for mid-market and enterprise companies with a specific, proprietary use
case that doesn't fit an off-the-shelf product, such as a law firm
wanting an internal RAG system over its own case files, a manufacturer
wanting an LLM copilot over its internal parts catalog, or an insurer
wanting document intelligence over its own claims history.

Distinct from `ai-consulting` elsewhere in this library (a vendor-neutral
AI *strategy* diagnostic that explicitly does not implement anything):
this business is pure hands-on implementation — it never sells a
diagnostic sprint or a prioritized roadmap on its own, only a shipped,
working integration, and would be the kind of firm `ai-consulting`'s
clients get referred to for the build phase. Also distinct from
`ai-chatbot-support-studio` (a narrower, productized managed service that
builds customer-support chatbots on top of established platforms like
Intercom Fin and Zendesk, and which explicitly names this business as its
broader, bespoke counterpart): Substrate AI has no fixed product
category, platform dependency, or single use case — every engagement is
custom engineering scoped around one client's own proprietary systems and
data, spanning legal, manufacturing, insurance, and any other vertical
with a genuinely proprietary integration need. Further distinct from
`nocode-ai-workflow-saas` (a self-serve visual-builder SaaS product) and
`ai-document-processing-saas` (a shared, multi-tenant document-extraction
API): this business builds nothing multi-tenant or self-serve — every
integration is one-off engineering delivered directly into one client's
own infrastructure.

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
`translationKey` under `businessLibrary.llmIntegrationConsultancy.*` in
`messages/en.json` and `messages/ro.json`. `business-dna.json`'s
narrative fields are inline bilingual `{ en, ro }` objects instead, per
`features/business-dna`'s own (frozen) schema convention — except its
`resources` list, which uses `translationKey` references into
`businessLibrary.llmIntegrationConsultancy.businessDna.resources.*`.
