# Marketing — architecture

`features/marketing` is the authoring framework for the **Marketing**
document — 18 sections, schemas/templates/validation only. No campaigns,
no copy, no invented content. See
[`features/business-dna/README.md`](../business-dna/README.md) and
[`features/blueprint/README.md`](../blueprint/README.md) (whose
"Marketing" section aliases business-dna's `MarketingDna` directly — this
feature is the expanded, section-by-section authoring surface behind that
summary).

## Purpose

A Marketing document is the detailed positioning/messaging/channel plan
behind one BusinessType's plan — the fourth generator in the pipeline
below. `templates/empty-marketing.json` is the "fill in the blanks"
starting point, mirroring
`business-library/technology/ai-automation-agency/marketing.json`'s own
empty template from the prior sprint (which itself already mirrors
`BusinessMarketingTemplate`).

## Pipeline

```
Business Library → Business DNA Profile → Matching Engine → Blueprint → Marketing → Financial → AI Co-Founder
                                                                            ↑ this feature
```

## Reuse table

| Section | Reuses from | Genuinely new | Conflict to flag |
|---|---|---|---|
| 1. Positioning | — | The whole section | — |
| 2. Brand Promise | — | The whole section | — |
| 3. UVP | — | The whole section | — |
| 4. ICP | `CustomerTypeKey` (knowledge-engine) — same key Blueprint's `IdealCustomer.customerType` uses | Wrapper shape | — |
| 5. Customer Personas | — | The whole section (a list, distinct from the single ICP above) | — |
| 6. Pain Points | — | The whole section | — |
| 7. Desired Outcomes | — | The whole section | — |
| 8. Messaging | — | The whole section | — |
| 9. Brand Voice | — | The whole section | — |
| 10. Content Pillars | — | The whole section | — |
| 11. Channel Strategy (SEO/Social/Email/Paid/Referral) | `channelTypes` pattern — `BusinessMarketingTemplate` (business-engine); `MarketingChannelKey` closed vocabulary (knowledge-engine) = `business-library/taxonomy/marketing-channels.json` | Wrapper shape | The epic lists "SEO/Social/Email/Paid/Referral Strategy" as a slash-separated item; interpreted as ONE section covering all channels via the closed key list, not five separate sections — flagging this interpretation rather than silently picking it |
| 12. Community | — | The whole section | — |
| 13. Lead Magnets | — | The whole section | — |
| 14. Funnels | — | The whole section | — |
| 15. Retention | — | The whole section | — |
| 16. Analytics | — | The whole section | Structural placeholder only, no computed metrics |
| 17. Marketing KPIs | `kpis` (`BusinessDnaKpiKey[]`, business-dna's fixed enum) — same pattern as Blueprint's `BlueprintKpis` and Financial's `FinancialKpis` | Wrapper shape | — |
| 18. AI Metadata | Same *pattern* as business-dna's/blueprint's/financial's AI Metadata | The field set itself | Independently defined, same reasoning as `features/blueprint`'s `BlueprintAiMetadata` and `features/financial`'s `FinancialAiMetadata` |

## Architecture notes

- **No `services/` folder** — same reasoning as `features/blueprint` and
  `features/financial`.
- **`InMemoryMarketingRepository` is an empty in-memory stub**, not a
  throwing placeholder — matches features/business-dna's precedent.
- **Keyed by `businessTypeId`**, mirroring `BusinessMarketingTemplate`.

## Tests

`tests/` asserts `templates/empty-marketing.json` validates against
`marketingSchema`, plus accept/reject cases for malformed DTOs.
