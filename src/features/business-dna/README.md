# Business DNA Profile v1 — architecture

`features/business-dna` is the **canonical runtime model / contract**
that the Matching Engine, Blueprint Generator, Financial Engine,
Marketing Engine, and AI Co-Founder should eventually consume, instead of
reading raw `BusinessGenome` objects directly. This sprint defines the
target shape only — 21 sections, all as TypeScript types + Zod schemas —
with zero implementation logic, zero seeded content, and zero real
businesses. See [`docs/domain/03-business-dna-profile-specification.md`](../../../docs/domain/03-business-dna-profile-specification.md)
for the Business Genome side of this relationship, and
[`docs/domain/02-entrepreneur-dna-specification.md`](../../../docs/domain/02-entrepreneur-dna-specification.md)
for the Entrepreneur DNA vocabulary Section 7 mirrors.

## Architecture relationship (confirmed with the project owner)

- **[`business-library/`](../../../business-library/README.md)** —
  unchanged, the **content repository**. How a `BusinessType` is
  authored, as bilingual JSON documents validated by `schema.ts`.
- **`features/business-dna/`** (this sprint) — the **canonical runtime
  model**. Business Library content must be *mappable onto* this
  contract; nothing here replaces business-library.
- **Import direction:** `business-dna → business-library` is a
  deliberate, approved exception to business-library's usual decoupling
  from `src/` (see `business-library/README.md`'s file header) —
  specifically for this feature, which exists to be the consumer-facing
  contract over that content. Every business-library import is
  centralized in `types/reused-from-business-library.ts` so that
  exception is visible in exactly one place.
- **No mapping function is implemented.** `utils/from-business-genome.ts`
  declares `fromBusinessGenome(genome: BusinessGenome): BusinessDnaProfile`
  with a body that throws `NotImplementedError` — the adapter is future
  work.

## The mapping table

One row per section. "Reuses from business-library" names the field(s)
imported via `types/reused-from-business-library.ts` (not redeclared);
"Genuinely new" names what this sprint actually invented; the last
column calls out unresolved conflicts explicitly, per this sprint's
instruction not to silently resolve them.

| # | Section | Reuses from business-library | Genuinely new | Naming/scale conflict to flag |
|---|---|---|---|---|
| 1 | Identity | `identity` (§1) — full reuse | — | — |
| 2 | Founder Fit | `founderProfile` (§6) — full reuse, incl. 6-key `founderArchetypeSchema` | — | See row 7 — three archetype vocabularies now exist |
| 3 | Financial DNA | `budget` (§10), `financialInformation` (§24) | — | — |
| 4 | Revenue DNA | `revenueSpeed` (§11), `profitMargin` (§12) | — | `financialInformation.revenueStreams` stays under Financial DNA, not duplicated here |
| 5 | Lifestyle DNA | `lifestyle` (§21) — full reuse | — | — |
| 6 | Skill DNA | 8 of 12 key *names* overlap `skillKeySchema` (sales, marketing, communication, negotiation, finance, programming, ai, management) | The 1-10 scale itself; 4 keys (leadership, operations, technology, automation) with no `skillKeySchema` equivalent | **Scale conflict, not silently resolved:** this section is 1-10; business-library's `requiredSkills`/`ratingScaleSchema` is 1-5. Same names, different scales — not rescaled. `skillKeySchema` also has 2 keys (`design`, `content`) with no Skill DNA equivalent |
| 7 | Entrepreneur DNA Match | — | The section; its 7-key vocabulary mirrors (not imports) `DnaArchetypeKey` — assessment's results page config | **Three archetype vocabularies now exist** — see "Existing archetype vocabularies" below. Also: 1-100 score here vs. the results page's 0-100 |
| 8 | Business Characteristics | Individual flags loosely derive from `lifestyle`, `teamSize`, `scalability`, `automation`, `aiResistance`, `businessModel`, `budget` (see per-field docstrings in `types/sections/business-characteristics.ts`) | 4 flags outright (`requiresInventory`, `isSeasonalBusiness`, `isFranchisable`, `isRecessionResistant`); the 17-flag list itself | The epic named "17 boolean/enum flags" but didn't enumerate them — this implementation designed a reasonable 17; flagged as a judgement call, not verbatim spec |
| 9 | Scalability DNA | `scalability` (§13) only | — | `growthPotential`/`scaling` deliberately live under Growth DNA (row 15) instead, since the epic lists the two as separate sections |
| 10 | Risk DNA | `difficulty` (§9), `aiResistance` (§15), `risks[]` (§30) | — | — |
| 11 | Marketing DNA | `marketingStrategy` (§26), `marketingComplexity` (§17) | — | `channelType` stays freeform (business-library's own choice, not this section's) |
| 12 | Sales DNA | `salesStrategy` (§27), `salesComplexity` (§18) | — | — |
| 13 | Operations DNA | `operations` (§28), `automation` (§14) | — | — |
| 14 | Technology DNA | `aiUsage` (§32), `recommendedTools` (§33) | — | `recommendedTools` also conceptually overlaps a future Knowledge Engine `BusinessTools`/`AITools` domain — not the same as this section's own Resources (row 18) |
| 15 | Growth DNA | `growthPotential` (§23), `scaling` (§29) | — | See row 9 |
| 16 | Success DNA | `advantages` (§31) | `benchmarkNotes` (narrative only, not a computed score) | — |
| 17 | Blueprint References | `blueprintStructure` (§37) — full reuse | 4 `*TemplateId` reference fields | References business-engine's `BusinessBlueprintTemplate`/`BusinessMarketingTemplate`/`BusinessFinancialTemplate`/`BusinessLaunchTemplate` by id — does not reinvent their structures |
| 18 | Resources | `translationKey` convention (business-engine `primitives.ts`); `ResourceType` cross-reference for 2 of 7 categories | The 7-category shape (`books`/`courses`/`youtube`/`communities`/`templates`/`documents`/`checklists`) | **Only partial overlap with `ResourceType`:** `checklists`→`checklist`, `youtube`→`video` map cleanly; `books`/`courses`/`communities`/`templates`/`documents` have no `ResourceType` equivalent |
| 19 | KPIs | — (deliberately not merged with business-library's `kpis`) | The whole fixed 10-key enum (MRR/ARR/CAC/LTV/Churn/GrossMargin/NetMargin/LeadConversion/CloseRate/CustomerRetention) | **Genuinely different concepts, kept distinct:** business-library's `kpis` (§34) is an open-ended array; this is a fixed, closed list. Not one subsuming the other |
| 20 | AI Metadata | `matchingHints` = `matchingMetadata` (§38) — full reuse of its ~17 fields | 4 hint fields (`blueprintHints`, `marketingHints`, `financialHints`, `generationHints`) | `blueprintHints` conceptually overlaps `blueprintStructure.promptContext` (§37) — not hidden, flagged |
| 21 | Business Lifecycle | `LocalizedText` (content fields) | The whole 8-stage lifecycle model | Closest business-library relative is `ninetyDayPlan` (§35), a single-business 90-day plan — not the same as this shared 8-stage model. Cross-references this feature's own KPI enum (row 19) rather than duplicating it |

## Existing archetype vocabularies (still unreconciled)

Per row 7/2 above — **three separate archetype vocabularies now exist in
this codebase**, from three different sprints:

| Vocabulary | Keys | Defined in | Used for |
|---|---|---|---|
| Founder Fit (this feature, §2) / business-library's `founderArchetypeSchema` | 6: `theBuilder`, `theConnector`, `theOperator`, `theVisionary`, `theSpecialist`, `theHustler` | `business-library/schema.ts` | Which founder archetype(s) a Business DNA profile ideally fits |
| **Entrepreneur DNA Match** (this feature, §7) | 7: `builder`, `visionary`, `operator`, `creator`, `seller`, `leader`, `analyst` | `types/sections/entrepreneur-dna-match.ts` (mirrors `DnaArchetypeKey`) | Scoring a *person* against the results page's 7 DNA Profile cards |
| Primary/Overarching Archetype | 5: `systemsBuilder`, `visionaryOperator`, `creativeStrategist`, `growthArchitect`, `executionSpecialist` | `src/features/assessment/components/results/config.ts` (`OverarchingArchetypeKey`) | The results page's single headline archetype label |

This document does not merge them. See
[`docs/domain/02-entrepreneur-dna-specification.md`](../../../docs/domain/02-entrepreneur-dna-specification.md)
for the fuller discussion — reconciling these three (or deciding they
should coexist) is a deliberate future decision.

## The generic vs. reused section shapes

Every section in `types/sections/` is either:

- **A full reuse** (Identity, Founder Fit, Lifestyle DNA, Blueprint
  References' `blueprintStructure` field) — a plain type alias of the
  business-library type, no wrapping.
- **A composition of reused fields** (Financial DNA, Revenue DNA,
  Scalability DNA, Risk DNA, Marketing DNA, Sales DNA, Operations DNA,
  Technology DNA, Growth DNA, Success DNA, AI Metadata's `matchingHints`)
  — a new interface whose fields are each a reused business-library
  type, not a redeclaration of their shape.
- **Genuinely new** (Skill DNA, Entrepreneur DNA Match, Business
  Characteristics, KPIs, Resources, Business Lifecycle) — no
  business-library equivalent exists.

## Why some schemas aren't annotated `z.ZodType<T>`

Several of business-library's schemas use `.default(...)` (e.g.
`businessGenomeBudgetSchema.currency`, `businessGenomeRisksSchema`,
`businessGenomeOperationsSchema.coreProcesses`) — `.default()` makes a
schema's Zod *Input* type and *Output* type diverge (Input allows
`undefined`, Output does not), which is incompatible with
`z.ZodType<T>`'s single-type-parameter form. Every schema in
`schemas/sections.schema.ts` that embeds one of these directly
(`financialDnaSchema`, `riskDnaSchema`, `operationsDnaSchema`,
`technologyDnaSchema`, `growthDnaSchema`, `successDnaSchema`,
`aiMetadataSchema`, and therefore the top-level
`businessDnaProfileSchema`/`businessDnaProfileCreateSchema`/
`businessDnaProfileUpdateSchema`) skips the annotation and exports a
plain `z.infer`-derived type instead — the same resolution
`explanation-engine` used for its own `businessGenomeSchema` embedding.
Every other schema, with no such nested default, keeps the
`z.ZodType<T>` annotation for compile-time drift protection.

## JSON Schema export

`schemas/business-dna-profile.json-schema.ts` exports
`generateBusinessDnaProfileJsonSchema()`, and
`schemas/business-dna-profile.schema.json` is its checked-in output — a
standard [json-schema.org](https://json-schema.org) draft-07 document
for the top-level `BusinessDnaProfile` shape.

**Approach taken: added `zod-to-json-schema` as a minimal new
dependency** and generated the file from the real Zod schema, rather
than hand-authoring a static JSON Schema. With 21 sections — several
several levels deep, with enums, unions, and `.refine()` rules — hand-
authoring would drift from `schemas/` almost immediately; generating it
guarantees the two stay identical, and `tests/json-schema.test.ts`
asserts the generator still produces all 21 top-level properties.

## Repository: empty implementation, not a throwing one

`repositories/business-dna-profile-repository.ts` exports
`InMemoryBusinessDnaProfileRepository` — a real, working, **empty**
in-memory store (an ever-empty-until-you-`create()`-something `Map`),
not a `NotImplementedError`-throwing placeholder like
matching-engine/explanation-engine's `services/`.

**Why the deviation from this codebase's usual placeholder convention:**
matching-engine and explanation-engine's placeholders model an
unimplemented *algorithm* stage (scoring, ranking, generation) — there,
throwing loudly is correct, because calling the method implies "compute
something real," and nothing real exists yet. A repository for
`BusinessDnaProfile` is different: there is no Prisma table for it yet
(this sprint doesn't touch Prisma), and this sprint seeds zero content —
so the *repository* itself has nothing wrong with it; it's the *data*
that's legitimately empty. Throwing on `list()` would be actively less
useful than returning `[]`, and would make this repository unusable from
tests or future callers exercising the interface. `utils/errors.ts` and
`NotImplementedError` still exist, and are still used — for
`fromBusinessGenome()` (see `utils/from-business-genome.ts`), which
*does* represent an unimplemented algorithm (the actual genome → profile
mapping logic).

## Where `interfaces/`, `repositories/`, and `utils/` split

- `repositories/business-dna-profile-repository.interface.ts` — the full
  CRUD contract (`BusinessDnaProfileRepository`), paired in the same
  folder with its stub implementation, mirroring how business-engine
  keeps a repository's interface and implementation together (e.g.
  `business-repository.ts`).
- `interfaces/business-dna-profile-source.interface.ts` —
  `BusinessDnaProfileSource`, a narrower **read-only** contract
  (`getById`/`getBySlug`/`list`) future consumer features should import
  against instead of the full CRUD repository, since a generator reading
  a profile to ground its output has no business calling
  `create`/`update`/`delete`.
- `utils/from-business-genome.ts` — the not-implemented
  `fromBusinessGenome()` adapter. Placed in `utils/` (which this sprint's
  spec explicitly scopes to "local NotImplementedError + any generic
  helpers") rather than a `services/` folder, since this sprint's folder
  list doesn't include one.

## Future consumers

None of these are implemented — this is where each would eventually call
in, reading `BusinessDnaProfileDto` via `BusinessDnaProfileSource`
instead of a raw `BusinessGenome`:

- **Matching Engine** — would read `aiMetadata.matchingHints` (the same
  `BusinessGenomeMatchingMetadata` shape it already expects, per
  `matching-engine/README.md`) instead of reaching into a `BusinessGenome`
  directly, plus `entrepreneurDnaMatch`/`skillDna` once those have real
  scoring logic behind them.
- **Blueprint Generator** — would read `blueprintReferences` (resolving
  `blueprintTemplateId` into the Business Engine's actual
  `BusinessBlueprintTemplate` row) plus `aiMetadata.blueprintHints`.
- **Financial Engine** — would read `financialDna`/`revenueDna` plus
  `aiMetadata.financialHints` as its starting assumptions.
- **Marketing Engine** — would read `marketingDna` plus
  `aiMetadata.marketingHints` and, for channel selection, `resources`
  filtered to whichever categories map onto its own vocabulary.
- **AI Co-Founder** — would read `operationsDna`, `riskDna`, and
  `businessLifecycle` (matching the user's actual `Business` to a
  lifecycle stage) for grounded, stage-appropriate advice.

## Tests

`tests/` covers, per this sprint's spec — schemas validating/rejecting
correctly- and incorrectly-shaped DTOs, the empty template validating
against the top-level schema, and compile-time-checked reuse assertions
— plus (beyond the minimum) a sanity suite for the in-memory repository
stub and the JSON Schema generator. Run with `npm test` (`vitest run`).
