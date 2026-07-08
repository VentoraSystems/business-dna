# The Business Genome Library

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
