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

## RESOLVED — business-dna's Business Lifecycle now reuses this feature's stage list

**Reconciled as of the Architecture Reconciliation sprint: Business DNA
Profile's Business Lifecycle now uses the same 10-stage vocabulary as
`features/roadmap`.** This section previously documented a three-way
divergence (Roadmap v1 → Roadmap v2 → business-dna's own, separate
8-stage `BusinessLifecycleStage`); that divergence is resolved, not left
alongside this note. `features/business-dna/types/sections/business-lifecycle.ts`
now re-exports this feature's `RoadmapStageKey`/`ROADMAP_STAGE_ORDER`
under its original local names (`BusinessLifecycleStage`/
`BUSINESS_LIFECYCLE_STAGE_ORDER`) instead of redeclaring an independent
list — see that file's docstring for the full reasoning, including:

- **"Idea" is a genuine loss, not a rename onto "Preparation."**
  business-dna's old first stage, "Idea" (pure ideation, before any
  concept is settled), has no equivalent in this feature's list —
  "Preparation" describes active pre-launch work *after* a concept
  exists. Adopting this feature's vocabulary means Business DNA
  Profile's Business Lifecycle can no longer represent pure ideation as
  its own stage — documented as a deliberate trade, not silently dropped.
- **A flagged circular import.** `features/roadmap/types/reused.ts`
  already imports `BusinessDnaKpiKey` FROM `features/business-dna`; now
  `features/business-dna`'s Business Lifecycle section imports
  `RoadmapStageKey` FROM `features/roadmap` too — the two features
  import from each other (each side pulling in only the other's small,
  static enum with no initialization-order dependency between them).
  Verified safe via `npm run typecheck` and `npm run build`. This
  reverses the usual layering (every other Business Assets feature only
  imports FROM business-dna, never the other way around) — a deliberate,
  narrow exception made for this reconciliation, not a general pattern
  to repeat.

v1's old 9-stage list (superseded by v2, see "Specification History"
above) never had a business-dna equivalent either, so no further mapping
is needed there.

## Reuse table

| Section | Reuses from | Genuinely new | Conflict to flag |
|---|---|---|---|
| Stage list (`RoadmapStageKey`, v2: 10 stages) | — | The whole enum | **Resolved** — see "RESOLVED" section above. `features/business-dna`'s Business Lifecycle now re-exports this enum rather than declaring its own; not a conflict any more |
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
