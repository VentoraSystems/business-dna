# Knowledge Graph Specification

**Companion documents:** [01 — Canon](./01-businessdna-canon.md) ·
[02 — Entrepreneur DNA Specification](./02-entrepreneur-dna-specification.md) ·
[03 — Business DNA Profile Specification](./03-business-dna-profile-specification.md).
**Source of truth in code:**
[`src/features/knowledge-engine/`](../../src/features/knowledge-engine/README.md)
(`types/domain.ts` → `KnowledgeDomain`, `types/knowledge-entry.ts` →
`KnowledgeEntry`), [`business-library/schema.ts`](../../business-library/schema.ts),
[`src/features/matching-engine/`](../../src/features/matching-engine/README.md),
and [`src/features/explanation-engine/`](../../src/features/explanation-engine/README.md).

This document describes the **conceptual graph** connecting
Entrepreneur DNA, Business DNA, and the Knowledge Engine's reference
domains. It is architecture documentation of the system as it actually
exists — no graph database, node store, or traversal engine has been
built. Every "node type" below is a real TypeScript/Zod shape already in
the codebase; every "relationship type" is either a real field
cross-referencing another shape's vocabulary, or — where noted
explicitly — a conceptual relationship the schema doesn't yet enforce.

## Why a graph, conceptually

Documents 2 and 3 each specify one *kind* of node (a fourteen-dimension
Entrepreneur DNA profile; a thirty-eight-section Business DNA genome).
Neither is useful in isolation — the product's whole premise is the
*relationship* between them (a match), and the *reference material* both
draw on to be meaningful in the first place (what "SaaS" means, what
skill "negotiation" implies, which tools an "AI Automation Agency" might
use). Modeling this explicitly as nodes and typed relationships — rather
than as ad hoc string comparisons scattered across features — is what
lets `KnowledgeEngine.getRelatedEntries()` (once implemented) or a future
`ScoreCalculator` reason about "what connects to what" instead of every
consumer re-deriving it.

## Node types

### Entrepreneur DNA

- **Shape:** `AssessmentFeatureVector` (`matching-engine/types/assessment-input.ts`)
  — one node per person, per completed Assessment, containing up to
  fourteen `DimensionInput` values keyed by `MatchingDimension`.
- **Full specification:** [Document 2](./02-entrepreneur-dna-specification.md).
- **Identity:** `assessmentId` + `userId`.

### Business DNA

- **Shape:** `BusinessGenome` (`business-library/schema.ts`) — one node
  per business concept, with 38 sections.
- **Full specification:** [Document 3](./03-business-dna-profile-specification.md).
- **Identity:** `identity.slug`.

### Knowledge Engine domains

Every `KnowledgeDomain` member (`knowledge-engine/types/domain.ts`) is a
node *category*; an individual `KnowledgeEntry` (`domain` + `key`) is a
node. This document covers the seven domains the epic named explicitly —
see [`knowledge-engine/README.md`](../../src/features/knowledge-engine/README.md)
for all 18.

| Domain | `KnowledgeDomain` value | Backing vocabulary | Node identity |
|---|---|---|---|
| Skills | `Skills` (`"skills"`) | `SkillKey` — reused from `skillKeySchema` (business-library) | one entry per skill key (10 today: marketing, sales, programming, ai, finance, management, design, content, negotiation, communication) |
| Industries | `Industries` (`"industries"`) | `IndustryType` — reused from `business-engine/schemas/enums.ts` | one entry per industry (10 today) |
| Business Tools | `BusinessTools` (`"businessTools"`) | none (open catalog — see `knowledge-engine/README.md` "Domains without a closed vocabulary") | one entry per named tool, `key` a free-form slug |
| AI Tools | `AITools` (`"aiTools"`) | none (open catalog, same reasoning as Business Tools) | one entry per named AI tool |
| Revenue Models | `RevenueModels` (`"revenueModels"`) | `RevenueModelKey` (local, closed) | one entry per revenue model (8 today) |
| Marketing Channels | `MarketingChannels` (`"marketingChannels"`) | `MarketingChannelKey` (local, closed) | one entry per channel (8 today) |
| Customer Types | `CustomerTypes` (`"customerTypes"`) | `CustomerTypeKey` (local, closed) | one entry per customer type (6 today: b2b, b2c, b2b2c, d2c, government, nonprofit) |
| KPIs | `KPIs` (`"kpis"`) | none (open catalog) | one entry per named metric, `key` a free-form slug |

`Business Tools` and `AI Tools` are modeled as **two separate node
types**, not one merged "Tools" type — this mirrors the actual
`KnowledgeDomain` enum, which has distinct `BusinessTools`/`AITools`
members. A future ingestion step could still tag a shared "is a tool"
supertype across both if useful, but nothing in the code does that today.

No `KnowledgeEntry` of any of these domains exists yet — the Knowledge
Engine is, like Matching and Explanation, architecture only (interfaces,
repository contracts, Zod schemas, zero seeded content; see
`knowledge-engine/README.md`).

### Resources

- **Shape:** `BusinessResource` (conceptually — `business-engine/schemas/lookups.ts`
  → `businessResourceCreateSchema`), categorized by `resourceTypeSchema`
  (`article` / `guide` / `video` / `playbook` / `checklist`).
- **Description:** Not a `KnowledgeEngine`/`KnowledgeDomain` concept —
  Resources is its own Business Engine lookup table, joined to a
  `BusinessType` via `businessTypeResourceCreateSchema`. It's included as
  a node type here because it's one of the eight systems Document 1/the
  epic names as a future Knowledge Graph participant, and because a
  Resource conceptually plays the same "reference material a Business DNA
  points at" role a Knowledge Engine entry does — just via a different,
  older mechanism (a Prisma-backed lookup table rather than a
  `KnowledgeEntry`). Whether Resources should eventually be re-modeled as
  a `KnowledgeDomain` is a candidate future decision, not one this
  document makes.
- **Identity:** `slug` (per `businessResourceCreateSchema`).
- **Current state:** `src/features/resources/` is empty scaffolding
  today (no components beyond a placeholder); the schema exists in
  Business Engine but nothing seeds or renders resources yet.

## Relationship types

Each relationship below states whether it's **backed** (an actual field
cross-references the target vocabulary today) or **conceptual** (the
epic names this relationship, but no current field enforces it — flagged
honestly rather than implied as already wired).

| Relationship | From → To | Backed by | Status |
|---|---|---|---|
| `IS_CATEGORIZED_BY` (Industry) | Business DNA → Industries | `businessGenomeSchema.industry.primary`/`.secondary` (§3, Document 3) — same `IndustryType` values the Knowledge Engine's `Industries` domain would use | **Backed** — vocabulary is literally shared |
| `IS_CATEGORIZED_BY` (Business Model) | Business DNA → (a future `BusinessModels` Knowledge domain) | `businessGenomeSchema.businessModel.primary`/`.secondary` (§5) — same `BusinessModelType` values | **Backed** (vocabulary shared); not one of the epic's seven named domains for this document, included for completeness |
| `REQUIRES` (Skills) | Business DNA → Skills | `requiredSkills[].key` (§7) and `matchingMetadata.requiredSkills`/`.preferredSkills` (§38) — both typed as `skillKeySchema`, the same vocabulary `SkillKey` reuses | **Backed** |
| `TARGETS` (Customer Types) | Business DNA → Customer Types | — | **Conceptual only.** `customerProfile` (§25, Document 3) is free-form `LocalizedText` prose (`description`, `segments[]`, etc.), not a `CustomerTypeKey` cross-reference. `lifestyle.salesChannel` (§21) is the closest existing field, but it's business-engine's `b2b`/`b2c`/`both` — a different, coarser vocabulary than the Knowledge Engine's six-value `CustomerTypeKey`. Wiring `customerProfile` to `CustomerTypeKey` is future work. |
| `USES` (Marketing Channels) | Business DNA → Marketing Channels | `marketingStrategy.channels[].channelType` (§26) | **Conceptual only, today.** `channelType` is an explicitly freeform string in `schema.ts` (commented "a future candidate for its own enum") — it does not yet validate against `MarketingChannelKey`. |
| `USES` (Tools) | Business DNA → Business Tools / AI Tools | `recommendedTools[].category` (§33) | **Conceptual only.** `category` is a freeform string; a future ingestion step would resolve each tool `name` into a `BusinessTools`/`AITools` `KnowledgeEntry.key` rather than a free string. |
| `TRACKS` (KPIs) | Business DNA → KPIs | `kpis[].key` (§34) | **Conceptual, and will remain so even once implemented** — `KPIs` is an open-catalog domain with no closed vocabulary (see `knowledge-engine/README.md`), so this relationship is meant to resolve `kpis[].key` to a matching `KnowledgeEntry.key` by string identity, not by enum membership. |
| `MATCHES_AGAINST` | Entrepreneur DNA → Business DNA | `matching-engine`'s pipeline (`ScoreCalculator.calculateDimensionScores()` + `CompatibilityCalculator.calculate()` → `CompatibilityResult`) | **Backed as a contract, not an implementation.** Every dimension in `matchingMetadata` (§38) is meant to be compared against the corresponding Entrepreneur DNA dimension (Document 2), but `ScoreCalculator`/`CompatibilityCalculator` are still placeholders — see `matching-engine/README.md`. |
| `EXPLAINS` | Explanation Engine → a `MATCHES_AGAINST` edge | `explanation-engine`'s `ExplanationEngineInput` (wraps `assessmentFeatures` + `businessGenome` + `compatibilityResult`) → `ExplanationResult` | **Backed as a contract, not an implementation.** Once real, this relationship annotates a `MATCHES_AGAINST` edge with structured `matchReasons`/`strengthReasons`/`growthAreas`/`warnings`/`recommendedActions`/`confidenceExplanation`/`riskExplanation`/`financialExplanation`/`timelineExplanation` — see `explanation-engine/README.md`'s pipeline. `riskExplanation`/`financialExplanation` specifically read Business DNA's `risks[]` (§30)/`budget`+`financialInformation` (§10, §24) against the Entrepreneur DNA `risk`/`budget` dimensions. |
| `HAS_RESOURCE` | Business DNA → Resources | `businessTypeResourceCreateSchema` (business-engine) | **Backed as a schema, unpopulated.** The join table exists; no rows do. |
| `RELATES_TO` | any `KnowledgeEntry` → any other `KnowledgeEntry` (same or different domain) | `KnowledgeEntry.relatedEntryKeys` (`knowledge-engine/types/knowledge-entry.ts`) | **Backed as a contract.** This is the Knowledge Engine's own generic cross-reference mechanism — e.g. a future `LegalStructures` entry relating to a `FundingOptions` entry (`knowledge-engine/README.md`'s worked example). Distinct from the Business DNA/Entrepreneur DNA-specific relationships above, which cross feature boundaries rather than staying inside the Knowledge Engine. |

### What "backed" does *not* mean

None of the "Backed" relationships above are backed by *computed* logic
— they're backed by a **type-level cross-reference** (the same enum
value, or a real field pointing at the right shape). No relationship in
this graph currently produces a real score, a real explanation, or a
real recommendation. That distinction — a well-typed connection existing
vs. that connection having been *evaluated* — is the same one
`matching-engine/README.md` draws between "the shape exists" and "the
algorithm exists," and it applies identically here.

## A worked, hypothetical traversal

To make the graph concrete (not to imply this traversal is implemented):
a person completes the Assessment → their answers become an
Entrepreneur DNA (`AssessmentFeatureVector`). A future `MATCHES_AGAINST`
step compares that node to every published Business DNA node, producing
`CompatibilityResult`s. For the top result, a future `EXPLAINS` step
produces an `ExplanationResult` — including a `growthAreas` entry
pointing at a skill gap (e.g. `negotiation`), which could
`getRelatedEntries()` from the Knowledge Engine to surface a
`Skills → negotiation` entry's related `HiringStrategies` or
`GrowthStrategies` entries (via `RELATES_TO`), and the matched Business
DNA's own `HAS_RESOURCE` edges to surface a relevant guide from
Resources. Every step in that sentence after "a person completes the
Assessment" is unimplemented today — this paragraph describes the graph
shape the implementation would traverse, once each engine's placeholders
are replaced with real logic.
