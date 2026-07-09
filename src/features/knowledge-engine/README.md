# Knowledge Engine — architecture

This is the structured entrepreneurial knowledge layer: a reference
taxonomy/encyclopedia other features will eventually query for
definitions and guidance. Like
[`features/matching-engine`](../matching-engine/README.md) and
[`features/explanation-engine`](../explanation-engine/README.md), this
sprint is architecture only — contracts and types, nothing that runs. It
is stricter than either of those: there is no `services/` folder, no
placeholder implementation, and — unlike the Business Genome Library,
which shipped exactly one authored example — **zero** knowledge entries
of any kind.

## This vs. that

It's easy to conflate this with two other systems that already exist, so
to be explicit:

- **vs. the Business Genome Library** ([`business-library/`](../../../business-library/README.md)):
  the Genome Library describes *specific business concepts* — one
  document per `BusinessType` (e.g. "AI Automation Agency"), covering its
  economics, founder fit, and 90-day plan. The Knowledge Engine describes
  *general entrepreneurial concepts* that apply across many business
  types — what a "SaaS" business model even is, what "runway" means, what
  a "sole proprietorship" is. A Business Genome might reference a
  Knowledge Engine entry (e.g. "this BusinessType uses the SaaS revenue
  model") but the Genome Library is content about one business; this is a
  glossary/taxonomy about concepts.
- **vs. the Matching Engine** ([`features/matching-engine/`](../matching-engine/README.md)):
  the Matching Engine scores a user against a `BusinessCandidate` — it's
  a *pipeline that produces a number*. The Knowledge Engine doesn't score
  anything; it's a *lookup/reference service* other pipelines (including
  the Matching Engine, eventually) can query mid-computation for
  definitions, related concepts, or guidance text — closer in spirit to a
  dictionary than a calculator.
- **vs. this feature's own AI ambitions**: none, yet. Nothing here calls
  an LLM, generates text, or infers anything. It's the vocabulary a
  future AI layer (or a human editor) would use to write real entries
  into, later.

## Domains

18 domains, defined once in `types/domain.ts` (`KnowledgeDomain`, the
single source of truth for domain names — nothing else in this feature
should hard-code a domain string). Three reuse an existing vocabulary
elsewhere in the codebase; the rest are net-new to this feature.

| Domain | Reused from | Or: net-new |
|---|---|---|
| Industries | `IndustryType` — `business-engine/schemas/enums.ts` | |
| Business Models | `BusinessModelType` — `business-engine/schemas/enums.ts` | |
| Skills | `SkillKey` (derived from `skillKeySchema`) — `business-library/schema.ts` | |
| Revenue Models | | `RevenueModelKey` — `types/vocabularies.ts` |
| Customer Types | | `CustomerTypeKey` — `types/vocabularies.ts` |
| Pricing Models | | `PricingModelKey` — `types/vocabularies.ts` |
| Marketing Channels | | `MarketingChannelKey` — `types/vocabularies.ts` |
| Sales Channels (methods) | | `SalesMethodKey` — `types/vocabularies.ts` (see naming note below) |
| Distribution Channels | | `DistributionChannelKey` — `types/vocabularies.ts` |
| Legal Structures | | `LegalStructureKey` — `types/vocabularies.ts` |
| Funding Options | | `FundingOptionKey` — `types/vocabularies.ts` |
| Business Tools | | no closed vocabulary — see below |
| AI Tools | | no closed vocabulary — see below |
| Business Risks | | no closed vocabulary — see below |
| KPIs | | no closed vocabulary — see below |
| Growth Strategies | | no closed vocabulary — see below |
| Hiring Strategies | | no closed vocabulary — see below |
| Business Terminology | | no closed vocabulary — see below |

### The "Sales Channels" naming note

The epic's domain list names this "Sales Channels," but business-engine
already has a `SalesChannel` enum (`b2b` / `b2c` / `both` — see
`schemas/enums.ts` → `salesChannelSchema`) meaning *who a business sells
to*. This domain is about something different — *how* a sale happens
(direct, channel-partner, inside sales, ...). To avoid two same-named,
differently-shaped types colliding across features, this feature calls
its local type `SalesMethodKey` and the `KnowledgeDomain` member
`SalesMethods`, with a docstring on both pointing at the distinction.

### Domains without a closed vocabulary

`RevenueModels` through `FundingOptions` above get a closed, `as const`
vocabulary in `types/vocabularies.ts` because they're small, well-
established taxonomies — the same *kind* of thing `IndustryType`/
`BusinessModelType` already are (compare `businessModelTypeSchema`'s
`"saas"`/`"ecommerce"`/`"marketplace"`). That's architecture, not content.

`BusinessTools`, `AITools`, `BusinessRisks`, `KPIs`, `GrowthStrategies`,
`HiringStrategies`, and `BusinessTerminology` do NOT get one. Unlike "the
finite list of revenue models," there is no small, non-arbitrary list of
"the business tools" or "the business terms" — naming specific ones
(Notion, ChatGPT, "MRR", ...) would be authoring real knowledge content,
which this sprint is explicitly forbidden from doing (zero examples,
stricter than the Genome Library's one). Their entries are identified by
`KnowledgeEntry.key` alone — a free-form slug, validated as a non-empty
string by `schemas/knowledge-entry.schema.ts` — same as every other
domain, just without a `relatedEnumValue`.

**`KPIs`, specifically — layered by design, not a conflict (Architecture
Reconciliation, decision 5):** this domain's open-endedness is
deliberate, not a gap to fill with a closed vocabulary later. It's meant
to sit *on top of* `features/business-dna`'s fixed, closed Core KPI set
(§19 — MRR/ARR/CAC/LTV/Churn/GrossMargin/NetMargin/LeadConversion/
CloseRate/CustomerRetention), the same relationship
`business-library/taxonomy/kpis.json` already documents in its own
`description` field. The Core KPI set is for cross-business
comparability; this domain (and `kpis.json`) is the extensible,
business-specific catalog authored content draws from. Do not unify
them.

## The generic entry architecture

Every domain's entries share one shape, `KnowledgeEntry`
(`types/knowledge-entry.ts`):

```
id, domain, key, translationKey, relatedEntryKeys,
relatedEnumValue?, tags, createdAt, updatedAt, isActive
```

### Why one generic shape (not 17+ bespoke ones)

With 18 domains, a bespoke interface per domain would mean 18 near-
identical shapes differing only in which enum backs `relatedEnumValue` —
that's not a meaningful type-safety win, and it multiplies every future
change (add a field, everyone touches 18 files) for no benefit, since no
domain actually needs a *structurally different* shape: they all need an
identifying key, a place to point at translated copy, cross-references,
tags, and lifecycle fields. The one place domains genuinely differ —
what `relatedEnumValue` can be — is captured by a single discriminated
union (`KnowledgeRelatedEnumValue`) keyed off `domain`, not by 18
separate types. A generic shape also directly enables `searchEntries()`
and `getRelatedEntries()` on `KnowledgeEngine` to work across domains
uniformly — a bespoke-per-domain design would need those methods to
either take a domain-specific generic parameter or exist 18 times.

### Why one generic `KnowledgeEngine` interface (not one per domain)

Same reasoning, one level up: `getEntry(domain, key)`,
`searchEntries(query)`, `getRelatedEntries(entryId)`, and `listDomains()`
all operate identically regardless of domain — the domain is data (an
enum value passed in), not a different code path. A
`KnowledgeEngine` consumer that wants "all Legal Structures entries"
calls `searchEntries({ domain: KnowledgeDomain.LegalStructures })`, the
same method a caller wanting "all KPIs entries" uses. Splitting this into
18 interfaces would mean every future consumer imports up to 18 types to
touch multiple domains, for a distinction (which domain) that's already
expressed as a parameter.

### dto/ vs. types/

`types/` holds the pipeline-agnostic vocabulary: `KnowledgeDomain`, the
reused-enum re-exports, this feature's own closed vocabularies, and the
canonical `KnowledgeEntry` interface those all compose into. `dto/` holds
the shapes `schemas/` validates and `interfaces/`/`repositories/` pass
around at the edges: `KnowledgeEntryDto` (a direct alias of
`KnowledgeEntry` — the two are the same shape, just named for where
they're used), `KnowledgeEntryCreateDto` (a genuinely different,
narrower shape — no `id`/`createdAt`/`updatedAt`, since those are
assigned by a future repository), `KnowledgeSearchQueryDto`, and
`KnowledgeSearchResultDto`. `schemas/` mirrors every one of those with a
Zod schema, each annotated `z.ZodType<TheDtoType>` so schema and type
can't silently drift.

## Reuse, not duplication

`types/reused-vocabularies.ts` is the only file that imports
`IndustryType`/`BusinessModelType` (from
`business-engine/schemas/enums.ts`) and `skillKeySchema` (from
`business-library/schema.ts`, deriving `SkillKey` via `z.infer` since
business-library doesn't export a named type for it). Every other file
in this feature imports those three from here, not from the original
locations — keeping the "long relative path into business-library"
confined to one place, same pattern `explanation-engine` used.

Both `business-engine` and `business-library` independently declare
their own copies of the industry/business-model enums (pre-existing,
out of scope to fix here). This feature picks `business-engine`'s copy
for Industries/Business Models (it already exports ready-made
`IndustryType`/`BusinessModelType` type aliases) and `business-library`'s
copy for Skills, since that's the one this sprint's spec names
explicitly.

`business-engine` also has a `RequiredSkill` concept
(`schemas/lookups.ts` → `requiredSkillCreateSchema`), but its `key` field
there is a free-form, regex-validated camelCase string, not a closed
enum — there's nothing typed to import from it beyond `skillKeySchema`
itself, which already is the closed vocabulary.

## Judgement calls

- **No `services/` folder.** This sprint's own folder list omits it and
  repeats "no implementation" four times; there's also no throwing
  placeholder to write, since nothing here executes (repositories/ are
  interfaces only, not even a `Placeholder*` class). Adding one would
  have meant inventing something to implement that the spec didn't ask
  for.
- **`listDomains()` is async** (`Promise<KnowledgeDomain[]>`), even
  though `KnowledgeDomain` is a static compile-time enum today and could
  be returned synchronously. Kept consistent with the rest of
  `KnowledgeEngine`'s async methods, and leaves room for a future world
  where domains themselves are configurable data rather than a fixed
  enum.
- **`KnowledgeEntryDto` is a type alias of `KnowledgeEntry`**, not a
  redeclared interface — see "dto/ vs. types/" above.

## Tests

`tests/` contains architecture tests only — no algorithm/business-logic
tests, no fabricated knowledge content:

- `domain.test.ts` — `KnowledgeDomain` has the expected 18 members, no
  duplicates.
- `knowledge-entry-schema.test.ts` — every Zod schema in `schemas/`
  accepts a well-formed DTO and rejects a malformed one (missing field,
  invalid domain, unrecognized `relatedEnumValue`).
- `cross-reference.test.ts` — a compile-time-checked runtime assertion:
  a real `IndustryType`/`BusinessModelType`/`SkillKey` value is assigned
  to `KnowledgeEntryCreateDto.relatedEnumValue` (which only typechecks
  because `KnowledgeRelatedEnumValue` includes them) and then validated
  against `knowledgeEntryCreateSchema` at runtime. If a future edit
  dropped one of the three from the union, this file fails
  `npm run typecheck`, not just `npm test`.

Run with `npm test` (`vitest run`).

## Future consumers

None of these are implemented — this is where each would eventually call
in:

- **Assessment** — could resolve a question's answer options against a
  domain (e.g. show the real `BusinessModels` list as choices) instead of
  hard-coding option copy per question.
- **Matching Engine** — `ScoreCalculator`/`RuleEngine` could look up a
  `BusinessRisks` or `LegalStructures` entry to explain *why* a dimension
  or rule fired, instead of a bare dimension key.
- **Blueprint** — a generated business blueprint could cite
  `FundingOptions`/`LegalStructures` entries for its "how to set this up"
  sections rather than writing that guidance inline per BusinessType.
- **Marketing** — could pull `MarketingChannelKey` entries to populate a
  channel picker or explain a recommended channel.
- **Financial Forecast** — could reference `RevenueModels`/`PricingModels`
  entries when labeling forecast line items.
- **AI Co-Founder** — could ground an AI response by first calling
  `getEntry()`/`searchEntries()` for the concepts a user asks about,
  reducing reliance on the model's own (unverified) knowledge.
- **Roadmaps** — could attach `GrowthStrategies`/`HiringStrategies`
  entries to roadmap milestones as "what this stage typically involves."
- **Resources** — could back its resource library's category filters
  with `KnowledgeDomain` instead of its own ad hoc category list.
