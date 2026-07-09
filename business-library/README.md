# Business Library

## ⚠️ Legacy Format

The original **Business Genome** format (`schema.ts`, `examples/`,
`json/`, `validate.ts`) is **deprecated**. It is kept only for backward
compatibility with the one business already authored under it
(AI Automation Agency) — do **not** author any new business with it, do
not extend its schema, and do not change its validation behavior. Each
of those four files carries a `@deprecated` comment block pointing back
here; nothing in their exported behavior has changed.

**All new content goes through the structure described below** —
`business-library/technology/`, validated against
[`features/business-dna`](../src/features/business-dna/README.md)'s
`BusinessDnaProfile` Zod schema, not `business-library/schema.ts`. See
"Migration" at the end of this document for what happens to the legacy
files next.

## Purpose

This is the single source of truth for every business concept BusinessDNA
can recommend, plan, and generate documents for — **content**, same as
before, just authored in a new structure that maps directly onto
[`features/business-dna`](../src/features/business-dna/README.md)'s
canonical `BusinessDnaProfile` contract instead of the legacy
`schema.ts` format. Nothing in this folder recommends a business,
matches a user, or implements any algorithm — that's still true of the
new structure exactly as it was of the legacy one.

## Architecture

```
Business Library  →  Business DNA Profile  →  Matching Engine  →  Blueprint / Marketing / Financial  →  AI Co-Founder
(this folder)         (features/business-dna)   (src/features/         (generators, not yet built)         (not yet built)
                                                  matching-engine)
```

- **Business Library** (`technology/*/`) — where a business is
  *authored*: `business-dna.json` (validated against
  `BusinessDnaProfile`), plus `blueprint.md`/`financial.json`/
  `marketing.json`/`roadmap.json`/`resources.json`/`ai-notes.md` as
  companion authoring surfaces for the generators listed below.
- **Business DNA Profile** (`features/business-dna`) — the canonical
  runtime shape every other system reads. See
  [that feature's README](../src/features/business-dna/README.md) for
  its 21 sections and how each maps to (or replaces) a legacy Business
  Genome section.
- **Matching Engine** (`src/features/matching-engine`) — will read
  `aiMetadata.matchingHints` (the same `BusinessGenomeMatchingMetadata`
  shape it already expected from the legacy format) once real scoring
  logic exists.
- **Blueprint / Marketing / Financial** — will read `blueprintReferences`/
  `marketingDna`/`financialDna` plus the corresponding `aiMetadata.*Hints`
  field, and this package's own `blueprint.md`/`marketing.json`/
  `financial.json` companion files.
- **AI Co-Founder** — will read `operationsDna`, `riskDna`, and
  `businessLifecycle` for grounded, stage-appropriate advice, same role
  the legacy format's `operations`/`kpis`/`risks`/`scaling.bottlenecks`
  played.

## New folder structure

```
business-library/
  manifest.json              Library-wide metadata — versions, supported
                              languages, and the registry of packages
                              under ./technology (see "Canonical rules").
  taxonomy/                  Small reference vocabularies for the new
                              format's cross-reference fields. Each file
                              reuses an existing canonical enum where one
                              already exists (IndustryType,
                              BusinessModelType, skillKeySchema, or a
                              src/features/knowledge-engine vocabulary)
                              rather than inventing a parallel list — see
                              each file's own "description" field for its
                              source.
    industries.json            ← IndustryType (business-engine)
    business-models.json       ← BusinessModelType (business-engine)
    skills.json                 ← skillKeySchema (business-library, reused as-is)
    categories.json             (no existing enum — small placeholder list)
    revenue-models.json        ← knowledge-engine's RevenueModels domain
    customer-types.json        ← knowledge-engine's CustomerTypes domain
    pricing-models.json        ← knowledge-engine's PricingModels domain
    marketing-channels.json    ← knowledge-engine's MarketingChannels domain
    sales-channels.json        ← knowledge-engine's SalesMethods domain (see file for naming note)
    tools.json                  (knowledge-engine's BusinessTools is an open catalog — small placeholder list)
    ai-tools.json                (same — knowledge-engine's AITools is an open catalog)
    kpis.json                   ← features/business-dna's BusinessDnaKpiKey (fixed 10-value enum)
    resources.json              ← features/business-dna's BusinessDnaResourceCategory
  technology/
    <business-slug>/           One folder per business package.
      README.md                 Human-readable summary.
      metadata.json              Package identity/status — new to this format.
      business-dna.json          Validates against BusinessDnaProfile.
      blueprint.md                Mirrors BusinessBlueprintTemplate.
      financial.json              Mirrors BusinessFinancialTemplate.
      marketing.json              Mirrors BusinessMarketingTemplate.
      roadmap.json                 Mirrors BusinessLaunchTemplate.
      resources.json               This package's own resource list.
      ai-notes.md                   Section headers for AiMetadata's 5 hint fields.
      assets/                        Images/media for this business.
```

`technology/ai-automation-agency/` is today's one package — an **empty
template**, not a real business (see its own README's `Status: template`
and `Canonical: true`). It is the reference structure every future
package should copy, the same role `examples/ai-automation-agency.ts`
played for the legacy format.

## Versioning

Two versions, tracked in `manifest.json`:

- `schemaVersion` — which version of `features/business-dna`'s
  `BusinessDnaProfile` contract (`BUSINESS_DNA_PROFILE_SCHEMA_VERSION` in
  `schemas/business-dna-profile.schema.ts`) every package in
  `technology/` is expected to validate against. A contract change bumps
  this across the whole library.
- `libraryVersion` — this folder's own release version, independent of
  the contract version.

Per-package, `metadata.json`'s own `version` field tracks edits to that
one business, and its `schemaVersion` field must match
`manifest.json`'s — `validate-packages.ts` checks this consistency.

## Canonical rules

Only a package under `technology/` can be `canonical` going forward — no
new content should ever be marked canonical under the legacy
`schema.ts`/`examples/`/`json/` format again. A package's
`metadata.json.canonical` (and its mirror in `manifest.json`'s
`packages[]` entry) marks it as the reference structure future packages
should copy; only one package should carry `canonical: true` at a time
per intent (today, `ai-automation-agency`). A package's
`metadata.json.status` — `template` / `draft` / `published` / etc. — is
separate from `canonical`: a package can be canonical (the structure to
copy) without being published (real, live content), which is exactly
`ai-automation-agency`'s current state. See `manifest.json`'s
`businessCount`, which only counts `published` packages — `template`
packages, however canonical, contribute 0.

## How new businesses are added

1. **Copy `technology/ai-automation-agency/`** as your starting point —
   every required file, and every `business-dna.json` section, is
   easier to match by example than by reading `features/business-dna`'s
   schema alone.
2. **Pick a unique slug** and rename the folder to match. Register it in
   `manifest.json`'s `packages[]` array — `validate-packages.ts` checks
   that every `technology/` folder's slug is registered there.
3. **Fill in `metadata.json`** with real values — `id`, `slug`, `version`,
   `schemaVersion` (matching `manifest.json`'s), `status`, `difficulty`,
   `industry`/`category`/`businessModel` (referencing `taxonomy/`), etc.
4. **Author `business-dna.json`** against `features/business-dna`'s 21
   sections. Cross-reference `taxonomy/*.json` for any field with a
   closed vocabulary (industries, business models, skills, revenue
   models, etc.) rather than inventing new string values.
5. **Fill in the companion files** — `blueprint.md`, `financial.json`,
   `marketing.json`, `roadmap.json`, `resources.json`, `ai-notes.md` —
   as the corresponding generators are built.
6. **Validate before committing.** Run
   `npm run validate:business-library-packages`. It must pass.
7. **Update `manifest.json`'s `businessCount`** once (and only once) the
   package's `metadata.json.status` becomes `published` — a `template`
   or `draft` package should not be counted.

## Validation process

- **`npm run validate:business-library-packages`** (`validate-packages.ts`)
  — the one to use for all new content. Checks every `technology/*/`
  package has its required files, a well-formed `metadata.json`,
  a `business-dna.json` that validates against
  `features/business-dna`'s `BusinessDnaProfile` schema, `schemaVersion`
  consistency between `metadata.json` and `manifest.json`, and that the
  package's slug is registered in `manifest.json`.
- **`npm run validate:business-library`** (`validate.ts`) — legacy,
  unchanged. Only validates `./json/*.json` against the deprecated
  `schema.ts`. Exists solely because the one legacy document is still
  there; do not point new content at it.

## Best practices

- Keep `taxonomy/*.json` values in sync with their source enums by
  convention (same discipline the legacy format used — see its own "Keep
  vocabulary aligned by convention" note below) — if a source enum
  changes, update the corresponding taxonomy file in the same change.
- Never mark more than one package `canonical: true` without a deliberate
  reason — `ai-automation-agency` is canonical today specifically because
  it's the reference *structure*, not because it's a real business.
- Treat `businessCount` as a manually-curated signal of real, published
  content — don't let it silently include templates or drafts.
- One package, one folder, one slug — `metadata.json.slug` should be
  unique across every `technology/` folder and match the folder name.

## Migration

A future sprint will migrate the one legacy Business Genome
(`examples/ai-automation-agency.ts` / `json/ai-automation-agency.json`)
into a real `technology/` package, and then remove
`business-library/schema.ts`, `examples/`, `json/`, and `validate.ts`
entirely. Until that migration happens, the legacy files stay exactly as
they are — see "⚠️ Legacy Format" above.

---

## Legacy reference (Business Genome format — deprecated)

Everything below this line describes the **legacy** Business Genome
format. It is accurate and unchanged from before this document's new
sections above were added — kept for reference only while the one
legacy document above still exists. Do not use anything below for new
content; see "How new businesses are added" above instead.

This is the single source of truth for every business concept BusinessDNA
can recommend, plan, and generate documents for. A **Business Genome** is
one structured JSON document — validated against `schema.ts` — that fully
describes one `BusinessType`: not just its name and category, but its
founder fit, its economics, its risks, its 90-day launch plan, and the
metadata a future matching engine will use to compare it against a real
person's Assessment.

Nothing in this folder recommends a business, matches a user, or
implements any algorithm. This is content and its schema — the standard
every future `BusinessType` must follow, and the one reference example
(**AI Automation Agency**) that demonstrates it fully populated.

## What a Business Genome is

Think of it as a business's DNA in the literal sense the product is named
for: one document holding everything that makes this business concept
what it is, structured so every other system in the platform can read the
one piece it needs without re-deriving it. Where a normal "business idea"
description is a paragraph, a Business Genome is ~40 structured sections
covering identity, economics, founder fit, operations, risk, and growth —
enough that a Blueprint, a Roadmap, a financial model, and a matching score
can all be produced from the same document without guessing.

Every Business Genome is:

- **Bilingual at the content level.** Every narrative field is a
  `{ en, ro }` pair (`localizedTextSchema` in `schema.ts`), not a
  translation key into `messages/*.json` — a genome is a large,
  self-contained package of long-form content, and that content belongs
  with the document, not scattered across the app's UI strings.
- **Strictly validated.** `schema.ts` is a Zod schema; nothing gets into
  `./json` that doesn't parse. Run `npm run validate:business-library` to
  check every document, or `npm test` for the schema's own test suite
  (`schema.test.ts`).
- **Versioned twice.** `schemaVersion` on the document tracks which
  version of the *standard* (`schema.ts`) it follows; `identity.version`
  tracks edits to that *specific* genome. A schema migration bumps the
  former across every document; editing one business's numbers bumps only
  its own `identity.version`.

## Folder structure

```
business-library/
  schema.ts        The Zod schema — the standard itself.
  validate.ts       CLI: validates every ./json/*.json file against schema.ts.
  schema.test.ts    Vitest suite covering the schema's validation rules.
  README.md         This file.
  examples/
    ai-automation-agency.ts   The one reference genome, as typed TS source
                              (parsed against the schema at import time).
  json/
    ai-automation-agency.json  The same document, as the plain JSON file
                                every other system should actually read.
```

`examples/` is where a genome is *authored* — as TypeScript, so an editor
gives real autocomplete and type errors while writing one, and so
`businessGenomeSchema.parse()` at the bottom of the file fails the build
immediately if an edit breaks validation. `json/` is where a genome
*lives* for consumption — the plain-data form every generator, the
matching engine, and (eventually) an ingestion script into the Business
Engine's database should read. The two are kept in sync by the author; a
future improvement would be a small build step that emits `json/*.json`
from `examples/*.ts` automatically rather than by hand.

## How each part of the platform consumes it

**Matching Engine** (`src/features/matching-engine`) reads
`matchingMetadata` — and only `matchingMetadata`. Every field there
(`requiredSkills`, `preferredPersonality`, `requiredBudget`, `riskProfile`,
`timeAvailability`, `idealFounderArchetypes`, and so on) exists specifically
to be compared against a normalized Assessment profile
(`AssessmentFeatureVector` — see that feature's README). None of it is
consumed yet, because the engine is still a framework of placeholders —
but the shape is what `ScoreCalculator` and `CompatibilityCalculator` will
eventually read from, once real scoring logic exists. The rest of a
genome's ~37 other sections are deliberately outside the matching
engine's concern.

**Blueprint Generator** (not yet built — see
`src/features/business-engine`'s `BusinessBlueprintTemplate`) reads
`blueprintStructure.sections` for which sections to produce and in what
order, then draws supporting facts from `description`, `customerProfile`,
`marketingStrategy`, `salesStrategy`, `financialInformation`, `risks`,
`advantages`, and `exitPotential` to ground each section in specifics
rather than generic prose. `blueprintStructure.promptContext` is a direct
hint to that generator about tone or emphasis for this particular
business.

**Roadmap Generator** reads `ninetyDayPlan` directly for the first 90 days
(it's already week-by-week) and `scaling.milestones` for the months
beyond that, with `scaling.bottlenecks` informing what the roadmap should
proactively address rather than let a founder discover the hard way.

**Financial Generator** reads `financialInformation` in full
(`startupCosts`, `recurringCosts`, `revenueStreams`, target income range,
break-even timeline) as the assumptions a generated financial model should
start from, and `budget`/`revenueSpeed`/`profitMargin` for the higher-level
shape of the model.

**Branding Generator** reads `description`, `customerProfile.description`,
and `marketingStrategy.positioning` for tone and positioning — a genome
doesn't include visual brand direction itself, but everything a branding
generator needs to infer one lives in those fields.

**AI Co-Founder** reads a genome as background context once a user has a
`Business` tied to a `BusinessType` — `operations`, `kpis`, `risks`, and
`scaling.bottlenecks` in particular are what let it give grounded,
specific advice ("your biggest bottleneck at this stage is X") instead of
generic founder platitudes.

**Business Review** (the eventual "how is this business actually doing"
feature) compares a user's real numbers against `kpis` and
`financialInformation`'s target ranges — the genome defines what "on
track" means for this specific business type.

## How AI consumes a genome, concretely

No field in a genome is itself an AI prompt. Instead, every future
generator should assemble its own prompt from the relevant fields (per the
table above) and route it through `withLocaleInstruction()`
(`src/ai/prompts/business-match.ts`), so output locale always matches the
`{ en, ro }` pair the user is currently working in — a genome authored in
both languages is what makes that possible without a translation step at
generation time.

## How future BusinessTypes should be created

1. **Copy `examples/ai-automation-agency.ts`** as your starting point, not
   a blank object — every field's shape (and the level of specificity
   expected in prose fields) is easier to match by example than by reading
   the schema alone.
2. **Fill in every section in both `en` and `ro`.** A genome with only one
   locale complete is not production-ready, even though `schema.ts`
   can't enforce translation *quality*, only that both keys exist.
3. **Keep vocabulary aligned by convention**, not by import. `industry`,
   `businessModel`, skill keys, and personality traits are declared
   locally in `schema.ts` rather than imported from
   `src/features/business-engine` or `src/features/assessment` — but
   their string values should stay the same as those features' equivalents
   unless there's a specific reason to diverge (and if so, that divergence
   should be a deliberate, documented schema change, not an accident).
4. **Validate before committing.** Run `npm run validate:business-library`
   (structural) and `npm test` (the schema's own rules). Both must pass.
5. **Populate `matchingMetadata` thoughtfully, not automatically.** It's
   entirely optional field-by-field, but a genome that skips it gives the
   eventual matching engine nothing to compare a user against — treat it
   as a required part of a genome being genuinely "done," even though the
   schema won't force that.
6. **One genome, one file, one slug.** `identity.slug` should be unique
   across every file in `./json` and is the identifier a future ingestion
   script into the Business Engine catalog would use to look up (or
   create) the matching `BusinessType.slug` row.

This standard — not any single business currently in the library — is the
asset. A good measure of whether a future change to `schema.ts` is safe:
can every currently-published genome still validate after a
`schemaVersion` bump, or does the migration need to touch every document
by hand? The latter is sometimes necessary, but it should never be
accidental.
