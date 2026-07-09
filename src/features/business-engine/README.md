# Business Engine — architecture

This is the foundation for BusinessDNA's recommendation system: the catalog
of business concepts it can recommend, and the structures the future
matching engine and document generators will read from and write to.

**Nothing in this folder recommends anything.** There is no scoring
algorithm, no seeded catalog content, and no AI call. What's here is the
database schema, the typed data-access layer on top of it, and placeholder
read endpoints — the same foundation Netflix's or Spotify's recommendation
systems sit on, before any actual recommendation logic exists: a
well-modeled catalog, a well-modeled record of what the "listener" (here,
the user's Assessment) looks like, and a place for a score to live once
something computes one.

## The mental model

```
BusinessIndustry ──< BusinessCategory ──< BusinessType >── (everything else)
   (enum-backed,        (a browsable          │
    fixed taxonomy)      grouping)            │
                                              ├── BusinessLifestyle   (1:1)
                                              ├── BusinessRisk        (1:1)
                                              ├── BusinessBudget      (1:1)
                                              ├── BusinessRevenue     (1:1)
                                              ├── BusinessTimeline    (1:1)
                                              ├── BusinessRequirement (many)
                                              ├── BusinessAdvantage   (many)
                                              ├── BusinessDisadvantage(many)
                                              ├── BusinessSkill ──> RequiredSkill      (M:N)
                                              ├── BusinessTypeTag ──> BusinessTag      (M:N)
                                              ├── BusinessTypeTool ──> BusinessTool    (M:N)
                                              ├── BusinessTypeResource ──> BusinessResource (M:N)
                                              ├── BusinessBlueprintTemplate  (1:1, structure only)
                                              ├── BusinessMarketingTemplate  (1:1, structure only)
                                              ├── BusinessFinancialTemplate  (1:1, structure only)
                                              ├── BusinessLaunchTemplate     (1:1, structure only)
                                              ├── BusinessQuestionWeight (many) ──> AssessmentQuestion
                                              └── BusinessMatchResult (many)    ──> User, Assessment
```

`BusinessType` is the one entity everything else hangs off. Everything to
its left is taxonomy (how the catalog is organized); everything below it is
either a normalized attribute, a shared master list, or a matching-engine
plug-in point.

## Where the matching engine plugs in

Two tables exist specifically for the algorithm that doesn't exist yet:

- **`BusinessQuestionWeight` (input).** One row says "this
  `AssessmentQuestion` (optionally, this specific answer option) should
  contribute `weight` to this `BusinessType`'s score." Whatever the actual
  matching algorithm turns out to be — a weighted sum, a learned model, a
  rules engine — it can read its coefficients from this table instead of
  having them hard-coded, which means changing how matching works is a data
  change, not a redeploy.
- **`BusinessMatchResult` (output).** One row per (user, Assessment,
  BusinessType): a `compatibilityScore` and an optional `scoreBreakdown`
  (shaped by `matchScoreBreakdownEntrySchema` in `schemas/matching.ts`) for
  the "why this match" explanation UI. `BusinessMatchRepository` already
  knows how to write and read these — it just has nothing calling
  `.create()` yet.

When the matching engine is built, it should live in its own
`src/features/business-engine/matching/` module, read assessment answers
via the existing Assessment feature, read weights via
`businessRepository`/a new weight-specific repository method, and write
results via `businessMatchRepository.create()`. Nothing in this domain
layer should need to change for that to happen.

## How AI will consume this data

Three of the four generation templates (`BusinessMarketingTemplate`,
`BusinessFinancialTemplate`, `BusinessLaunchTemplate`) plus
`BusinessBlueprintTemplate` are deliberately *shape, not prose*:

- `BusinessBlueprintTemplate.sections` is an ordered list of section keys
  (matching `blueprint.sections.*` in `messages/*.json`), not the sections'
  content.
- `BusinessFinancialTemplate.assumptionsSchema` defines what inputs a
  financial model needs (`{ [key]: "number" | "percent" | "currency" }`),
  not the numbers.
- `BusinessLaunchTemplate.milestones` defines which months have a theme and
  a translation key for that theme, not the tasks under it.

The future document generators (one per template type) will each: fetch a
`BusinessMatchResult` (or a specific `BusinessType` directly), fetch its
template bundle via `templateRepository.getBundle()`, and call the OpenAI
client (`src/ai/openai.ts`) with a prompt assembled from the template's
structure plus the user's own answers and locale — the same
`withLocaleInstruction()` pattern already used by
`src/ai/prompts/business-match.ts` for the AI Co-Founder should be extended
with a matching `buildBlueprintPrompt()`/`buildMarketingPrompt()`/etc. once
that work starts. The generated content itself gets stored on the existing
`Blueprint` model (or sibling models for marketing/financial/launch, not
yet created) — never on the template rows, which stay reusable across
every user who gets matched to that `BusinessType`.

## Resources taxonomy: `ResourceType` stays independent (Architecture Reconciliation, decision 4)

`schemas/enums.ts`'s `resourceTypeSchema` (article/guide/video/playbook/
checklist) mirrors `prisma/schema.prisma`'s `ResourceType` enum, which
backs `BusinessResource.resourceType` — a real database column. A
later-built feature, `features/resources`, is now the canonical,
broader (16-category) taxonomy for "resources" across the app (see that
feature's README) — `features/business-dna`'s own Resources section was
unified onto it. `ResourceType` here was **not** unified the same way:
changing its enum values would require a Prisma migration
(`schema.prisma` change plus a data migration for existing
`BusinessResource` rows), which is out of scope for a
TypeScript-vocabulary reconciliation sprint. `schemas/enums.ts`'s
`resourceTypeSchema` docstring documents the mapping onto
`features/resources`' `ResourceCategoryKey` instead, so the relationship
is explicit even though the values stay independent and unchanged.

## Repositories

All four are in `repositories/`, each as an interface plus a
`Prisma*Repository` implementation, so a future test suite (or a caching
layer) can satisfy the same interface without touching calling code:

| Repository | Backs | Responsibility |
|---|---|---|
| `businessRepository` | `BusinessType`, `BusinessCategory`, `BusinessIndustry` | Catalog reads: full detail, filtered lists, taxonomy browsing |
| `businessMatchRepository` | `BusinessMatchResult` | Persist/retrieve computed matches — no scoring |
| `blueprintRepository` | `BusinessBlueprintTemplate` | The Business Plan skeleton specifically |
| `templateRepository` | `BusinessMarketingTemplate`, `BusinessFinancialTemplate`, `BusinessLaunchTemplate` | The other three skeletons, plus `.getBundle()` combining all four |

## Validation

Every entity has a Zod schema in `schemas/`, built from shared primitives
(`slugSchema`, `translationKeySchema`, `ratingScaleSchema`) so the same
constraints (e.g. "a rating is 1-5, matching the Assessment's scale") are
defined once. These validate any future write path (an admin CMS, a seed
script, an API `POST` route) before it reaches Prisma.

## API routes (read-only placeholders)

| Route | Returns |
|---|---|
| `GET /api/business-types` | Filtered, paginated list of published `BusinessType`s |
| `GET /api/categories` | `BusinessCategory` list, optionally scoped to `?industryId=` |
| `GET /api/industries` | `BusinessIndustry` list |
| `GET /api/templates?businessTypeId=` | The four template skeletons for one `BusinessType` |
| `GET /api/business/:id` | One fully-populated `BusinessType` |

None of these compute a match or personalize anything — they're catalog
browsing. There is intentionally no `POST /match` or similar endpoint yet.

## Populating the catalog

`prisma/seed-business-engine.ts` is deliberately empty — see the ordered
list of placeholder functions inside it. Populating it for real should be a
content task (with translation review, since every `translationKey` needs
an entry in both `messages/en.json` and `messages/ro.json`), not a code
task — the schema and repositories already support it.
