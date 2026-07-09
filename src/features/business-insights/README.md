# Business Insights — architecture

`features/business-insights` is the authoring framework for the
**Business Insights** document — 16 sections (15 content sections + AI
Metadata), schemas/templates/validation only. No real content, no
invented advice, no invented stories.

## Purpose

Business Insights captures **qualitative, narrative "soft knowledge"**
about a BusinessType — hidden opportunities and risks, common mistakes,
patterns, founder advice, myths, FAQs, and similar judgment-based
knowledge — that does **not** belong inside the structured, strictly-typed
`features/business-dna` contract (a `BusinessDnaProfile` is a closed,
machine-comparable data record; this feature is the free-form,
editorial layer that sits alongside it). Where business-dna asks "what
is true about this business, structurally," Business Insights asks
"what would an experienced operator tell you about this business that a
structured schema can't capture."

## Pipeline

```
Business Library → Business DNA Profile → Matching Engine → Blueprint → Marketing → Financial → Roadmap → Resources → Business Insights → AI Co-Founder
                                                                                                                ↑ this feature
```

## Reuse table

| Section | Reuses from | Genuinely new | Conflict to flag |
|---|---|---|---|
| 1. Hidden Opportunities | Generic `InsightItem` shape (this feature) | The whole section | — |
| 2. Hidden Risks | Generic `InsightItem` shape | The whole section | — |
| 3. Common Mistakes | Generic `InsightItem` shape | The whole section | — |
| 4. Fastest Wins | Generic `InsightItem` shape | The whole section | — |
| 5. Scaling Advice | Generic `InsightItem` shape | The whole section | — |
| 6. Founder Advice | Generic `InsightItem` shape | The whole section | — |
| 7. Patterns | Generic `InsightItem` shape | The whole section | — |
| 8. Industry Secrets | `IndustryType` (business-engine's `industryTypeSchema`) — entries are industry-scoped rather than inventing a new industry list | The item shape (`IndustryScopedInsightItem`) | — |
| 9. Hidden Costs | Generic `InsightItem` shape | The whole section | Structural placeholder only — no computed figures, same discipline as `features/financial` |
| 10. Market Signals | `IndustryType` (business-engine), same reasoning as Industry Secrets | The item shape | — |
| 11. Success Stories | Generic `InsightItem` shape | The whole section | — |
| 12. Failure Stories | Generic `InsightItem` shape | The whole section | — |
| 13. Frequently Asked Questions | — | The whole section (its own `FaqItem` shape: question/answer, not the generic `InsightItem`) | — |
| 14. Myths | — | The whole section (its own `MythItem` shape: myth/fact, not the generic `InsightItem`) | — |
| 15. Best Practices | Generic `InsightItem` shape | The whole section | — |
| 16. AI Metadata | Same *pattern* as the other Business Assets' AI Metadata | The field set itself | Independently defined, same reasoning as `features/blueprint`'s `BlueprintAiMetadata` |
| *(cross-cutting)* `InsightItem.relatedResources` | `ResourceItem` (`features/resources`' 16-category canonical vocabulary, built last sprint) | — | Any resource-like reference anywhere in this feature routes through this one field/type rather than inventing a parallel resource taxonomy, per this epic's explicit reuse rule |

## Architecture notes

- **No `services/` folder** — same reasoning as the other Business
  Assets features.
- **`InMemoryBusinessInsightsRepository` is an empty in-memory stub**,
  not a throwing placeholder. This matches the precedent established by
  all five of last sprint's Business Assets features
  (`features/business-dna`, `features/blueprint`, `features/financial`,
  `features/marketing`, `features/roadmap`, `features/resources`), which
  all use the same `Map`-based, non-throwing pattern rather than
  matching-engine's/explanation-engine's `NotImplementedError`-throwing
  convention. No third pattern introduced.
- **Keyed by `businessTypeId`**, same relationship the other Business
  Assets have to their BusinessType.

## Tests

`tests/` asserts `templates/empty-business-insights.json` validates
against `businessInsightsSchema`, plus accept/reject cases for malformed
DTOs (industry-scoped items, resource references, FAQ items).
