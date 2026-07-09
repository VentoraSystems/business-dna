# Roadmap — architecture

`features/roadmap` is the authoring framework for the **Growth Roadmap**
document — a 10-stage, stage-by-stage playbook, schemas/templates/validation
only. No generated advice, no invented milestones.

## Specification History

v1 (9 stages: Preparation, Validation, MVP, First Client, Product-Market
Fit, Growth, Scaling, Expansion, Exit-optional) → **v2 (10 stages),
officially superseded** — this is an intentional product evolution, not
a bug. v2 changes: "Launch" inserted between MVP and First Customer;
"First Client" renamed to "First Customer"; "Exit" is no longer
documented as optional — it's a standard stage like every other. The
per-stage shape (`objectives`/`deliverables`/`checklist`/`kpis`/
`commonMistakes`/`successCriteria`/`aiRecommendations`) is unchanged.

## Purpose

A Roadmap document is the stage-by-stage playbook (objectives,
deliverables, checklist, KPIs, common mistakes, success criteria, AI
recommendations per stage) behind one BusinessType's plan — the fifth
generator in the pipeline below. `templates/empty-roadmap.json` is the
"fill in the blanks" starting point: all 10 stages present as skeleton
entries with empty arrays.

## Pipeline

```
Business Library → Business DNA Profile → Matching Engine → Blueprint → Marketing → Financial → Roadmap → Resources → AI Co-Founder
                                                                                        ↑ this feature
```

## KNOWN CONFLICT — three stage lists, still not merged

This feature's stage list is now on its **second** revision (v1 → v2,
see "Specification History" above), and remains **intentionally
different** from business-dna's existing 8-stage `BusinessLifecycleStage`
(`@/features/business-dna/types/sections/business-lifecycle.ts`), which
was never touched or aliased. That's now a **three-way divergence** —
Roadmap v1 → Roadmap v2 → business-dna's Business Lifecycle — and all
three still await a future reconciliation decision; none of this sprint's
changes attempt to resolve it.

| # | Roadmap **v1** (9 stages, superseded) | # | Roadmap **v2** (10 stages, current) | # | business-dna's `BusinessLifecycleStage` (existing, 8 stages) |
|---|---|---|---|---|---|
| 1 | Preparation | 1 | Preparation | — | *(no equivalent — new)* |
| 2 | Validation | 2 | Validation | 2 | Validation |
| 3 | MVP | 3 | MVP | 3 | MVP |
| — | *(none)* | 4 | **Launch (NEW in v2)** | — | *(no equivalent)* |
| 4 | First Client | 5 | **First Customer (renamed in v2)** | 4 | First Clients |
| 5 | Product Market Fit | 6 | Product Market Fit | — | *(no equivalent — new; closest is "Stable Revenue" conceptually, not the same thing)* |
| 6 | Growth | 7 | Growth | — | *(no equivalent — new; business-dna jumps straight from First Clients to Stable Revenue)* |
| 7 | Scaling | 8 | Scaling | 6 | Scaling |
| 8 | Expansion | 9 | Expansion | 7 | Expansion |
| 9 | Exit (optional) | 10 | **Exit (standard, no longer optional in v2)** | 8 | Exit |
| — | *(no equivalent)* | — | *(no equivalent)* | 1 | Idea |
| — | *(no equivalent)* | — | *(no equivalent)* | 5 | Stable Revenue |

None of the three lists is a strict subset/superset of another — they
diverge in the early stages (business-dna has "Idea" before Validation;
Roadmap has "Preparation" instead, and treats Validation as the true
first checkpoint), in the launch transition (v2 inserts a distinct
"Launch" checkpoint that neither v1 nor business-dna has), and in the
middle stages (Roadmap splits out "Product Market Fit" and "Growth" as
distinct checkpoints between First Customer and Scaling, where
business-dna has one "Stable Revenue" stage covering that whole span).
`kpis` on each `RoadmapStage` still reuses business-dna's fixed
`BusinessDnaKpiKey` vocabulary — only the stage list itself is kept
separate, in all three versions.

## Reuse table

| Section | Reuses from | Genuinely new | Conflict to flag |
|---|---|---|---|
| Stage list (`RoadmapStageKey`, v2: 10 stages) | — | The whole enum | See "KNOWN CONFLICT" above — deliberately not merged with business-dna's `BusinessLifecycleStage` (8 stages); this is now a three-way divergence (v1 → v2 → business-dna) |
| Per-stage `objectives`/`deliverables`/`checklist`/`commonMistakes`/`successCriteria`/`aiRecommendations` | — | The whole shape | — |
| Per-stage `kpis` | `BusinessDnaKpiKey` (business-dna's fixed enum) — same pattern as Blueprint's/Financial's/Marketing's KPI sections | Wrapper (`kpis: BusinessDnaKpiKey[]` per stage, not a document-level list) | — |
| AI Metadata | Same *pattern* as the other Business Assets' AI Metadata | The field set itself | Independently defined, same reasoning as `features/blueprint`'s `BlueprintAiMetadata` |

## Architecture notes

- **No `services/` folder** — same reasoning as the other Business
  Assets features.
- **`InMemoryRoadmapRepository` is an empty in-memory stub**, not a
  throwing placeholder — matches features/business-dna's precedent.
- **Keyed by `businessTypeId`**, same relationship the other Business
  Assets have to their BusinessType.

## Tests

`tests/` asserts `templates/empty-roadmap.json` validates against
`roadmapSchema`, plus accept/reject cases for malformed DTOs.
