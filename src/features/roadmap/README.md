# Roadmap — architecture

`features/roadmap` is the authoring framework for the **Growth Roadmap**
document — a 9-stage, stage-by-stage playbook, schemas/templates/validation
only. No generated advice, no invented milestones.

## Purpose

A Roadmap document is the stage-by-stage playbook (objectives,
deliverables, checklist, KPIs, common mistakes, success criteria, AI
recommendations per stage) behind one BusinessType's plan — the fifth
generator in the pipeline below. `templates/empty-roadmap.json` is the
"fill in the blanks" starting point: all 9 stages present as skeleton
entries with empty arrays.

## Pipeline

```
Business Library → Business DNA Profile → Matching Engine → Blueprint → Marketing → Financial → Roadmap → Resources → AI Co-Founder
                                                                                        ↑ this feature
```

## KNOWN CONFLICT — two stage lists, not merged

This epic explicitly specifies Roadmap's own 9-stage model, which is
**intentionally different** from business-dna's existing 8-stage
`BusinessLifecycleStage`
(`@/features/business-dna/types/sections/business-lifecycle.ts`). Per the
epic's explicit instruction, this feature implements its own distinct
`RoadmapStageKey` type — it does **not** alias, extend, or otherwise merge
with `BusinessLifecycleStage`. Reconciling the two lists (if ever
desired) is left as a **future decision**, not made here.

| # | `features/roadmap`'s `RoadmapStageKey` (this feature, 9 stages) | # | business-dna's `BusinessLifecycleStage` (existing, 8 stages) |
|---|---|---|---|
| 1 | Preparation | — | *(no equivalent — new)* |
| 2 | Validation | 2 | Validation |
| 3 | MVP | 3 | MVP |
| 4 | First Client | 4 | First Clients |
| 5 | Product Market Fit | — | *(no equivalent — new; closest is "Stable Revenue" conceptually, not the same thing)* |
| 6 | Growth | — | *(no equivalent — new; business-dna jumps straight from First Clients to Stable Revenue)* |
| 7 | Scaling | 6 | Scaling |
| 8 | Expansion | 7 | Expansion |
| 9 | Exit (optional) | 8 | Exit |
| — | *(no equivalent)* | 1 | Idea |
| — | *(no equivalent)* | 5 | Stable Revenue |

Neither list is a strict subset/superset of the other — they diverge in
both the early stages (business-dna has "Idea" before Validation; this
feature has "Preparation" instead, and treats Validation as the true
first checkpoint) and the middle stages (this feature splits out "Product
Market Fit" and "Growth" as distinct checkpoints between First Client and
Scaling, where business-dna has one "Stable Revenue" stage covering that
whole span). `kpis` on each `RoadmapStage` still reuses business-dna's
fixed `BusinessDnaKpiKey` vocabulary — only the stage list itself is kept
separate.

## Reuse table

| Section | Reuses from | Genuinely new | Conflict to flag |
|---|---|---|---|
| Stage list (`RoadmapStageKey`, 9 stages) | — | The whole enum | See "KNOWN CONFLICT" above — deliberately not merged with business-dna's `BusinessLifecycleStage` (8 stages) |
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
