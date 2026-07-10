# Matching Engine — architecture

**Phase 2 status: the scoring pipeline is real.** As of Phase 2, this
feature genuinely scores a user's Assessment against the 21 published
`BusinessType`s seeded in Phase 1 and produces real, ranked
`CompatibilityResult`s — `createMatchingEngine()`'s defaults changed from
placeholders to working implementations for 6 of the 9 pipeline stages
(Normalization, Feature Extraction, Business Candidate Retrieval, Weighted
Scoring, Compatibility Calculation, Ranking). Two stages remain
deliberately out of scope and still throw `NotImplementedError` by
default: **AI Explanation** (`ExplanationGenerator` — no prompt copy has
been written; pass an override to exercise the rest of the pipeline
without it) and rule-based exclusion (`RuleEngine` defaults to a *safe
no-op* — see "Rule system" below — not a placeholder, but also not real
rules). `fetchRawAnswers` also stays caller-supplied by design (see "Where
this plugs into the rest of the app"). See
`scripts/matching-engine-integration-check.ts` for a runnable, end-to-end
demonstration against the real seeded catalog.

The rest of this document describes the architecture as designed; where
Phase 2 made a stage real, that's called out explicitly rather than
silently rewritten, so the reasoning behind the original design is still
visible alongside what actually got built.

Think of this the way you'd think about the recommendation infrastructure
behind Spotify or Netflix *early on*: the catalog schema exists (see
`features/business-engine`), the "listening history" schema exists (see
`features/assessment`), and now a first, deliberately simple scoring
algorithm exists too — not yet a trained model, but no longer a stub
either.

## The pipeline

```
Assessment Answers
      │                         RawAssessmentAnswers
      ▼                         (fetched by the caller — see "Where this
Normalization                    plugs into the rest of the app" below)
      │                         AssessmentNormalizer.normalize()
      ▼                         → NormalizedAssessmentProfile
Feature Extraction
      │                         AssessmentNormalizer.extractFeatures()
      ▼                         → AssessmentFeatureVector
Business Candidate Retrieval
      │                         BusinessCandidateProvider.getCandidates()
      ▼                         → BusinessCandidate[]
Weighted Scoring
      │                         ScoreCalculator.calculateDimensionScores()
      ▼                         → DimensionScore[] (per candidate)
Compatibility Calculation
      │                         RuleEngine.evaluate() + CompatibilityCalculator.calculate()
      ▼                         → { overallScore, confidenceScore } (per candidate)
Ranking
      │                         RankingEngine.rank()
      ▼                         → RankedCandidate[]
AI Explanation
      │                         ExplanationGenerator.*
      ▼                         → explanation strings (per candidate)
Business Match Results
                                 → CompatibilityResult[]
```

`services/matching-engine.ts` (`DefaultMatchingEngine.run()`) is the only
place that knows this whole sequence. Every other service only knows its
own stage — which is what makes each one independently replaceable later.

## Services

All seven requested services exist as an interface, in `services/` (four
of them) and alongside their most related concern (`scoring/`, `rules/`)
for the other three. Each interface now has **two** implementations: the
original `Placeholder*` class (still throws `NotImplementedError`, still
covered by its original test, kept unchanged so it stays available as a
reference/fallback) and a new `Default*` class with real v1 logic —
`createMatchingEngine()`'s defaults point at the real one wherever one
exists:

| Service | Stage(s) | Lives in | v1 status |
|---|---|---|---|
| `AssessmentNormalizer` | Normalization, Feature Extraction | `services/assessment-normalizer.ts` | Real (`DefaultAssessmentNormalizer`) |
| `BusinessCandidateProvider` | Business Candidate Retrieval | `services/business-candidate-provider.ts` | Real (`RepositoryBusinessCandidateProvider`, real `toCandidate()`) |
| `ScoreCalculator` | Weighted Scoring | `scoring/score-calculator.ts` | Real (`DefaultScoreCalculator`) |
| `CompatibilityCalculator` | Compatibility Calculation | `scoring/compatibility-calculator.ts` | Real (`DefaultCompatibilityCalculator`) |
| `RuleEngine` | Compatibility Calculation | `rules/rule-engine.ts` | Safe no-op (`NoOpRuleEngine`) — not real rules, see "Rule system" |
| `RankingEngine` | Ranking | `services/ranking-engine.ts` | Real (`DefaultRankingEngine`) |
| `ExplanationGenerator` | AI Explanation | `services/explanation-generator.ts` | Still a throwing placeholder — out of scope |
| `MatchingEngine` | orchestrates all of the above | `services/matching-engine.ts` | Orchestration real; see stage table above for what it calls |

Every one is still constructor-injected — replacing an implementation
(e.g. a future learned `ScoreCalculator`) is still a one-line change at
`createMatchingEngine()`'s call site, not a refactor. That design paid off
directly in Phase 2: nothing about `DefaultMatchingEngine.run()`'s
orchestration needed to change shape to go from 0 real stages to 6.

`BusinessCandidateProvider`'s real implementation calls
`businessRepository.listFull()` (added in Phase 2 — the original `.list()`
only included `category`/`industry`, not the `lifestyle`/`risk`/`budget`/
`skills` relations `toCandidate()` needs; see
`features/business-engine/repositories/business-repository.ts`) and maps
each `BusinessType` into a `BusinessCandidate` per the dimension mapping
below.

## Scoring model

Fourteen dimensions, as specified, in `scoring/dimensions.ts`:
`skills`, `budget`, `lifestyle`, `risk`, `timeline`, `industryPreference`,
`businessModelPreference`, `communicationStyle`, `leadership`,
`creativity`, `technicalAbility`, `salesOrientation`, `location`,
`workStyle`.

`scoring/weight-config.ts` defines `WeightConfig` — a versioned map from
dimension to weight — and exports one instance, `UNIFORM_CONFIG`
(formerly `UNWEIGHTED_CONFIG`, `weights: {}`, renamed in Phase 2 alongside
its value): every dimension now weighs exactly 1, a deliberate v1 product
decision (no dimension is judged more important than another yet), not an
engineering default. Versioning still exists so the engine can support
more than one configuration side by side later (A/B testing a new
weighting, or letting a specific product decision override the default)
without a schema change.

`ScoreCalculator` turns one (assessment, candidate, weights) triple into a
`DimensionScore[]` — one entry per shared dimension, carrying both the raw
0-1 alignment and the weighted contribution. `CompatibilityCalculator` then
combines those (plus rule outcomes) into the single `overallScore` /
`confidenceScore` pair. These are deliberately two different services: how
individual dimensions compare, and how those comparisons combine into one
number, are different questions that may evolve on different timelines —
see "Where ML could replace parts of this" below.

### The Phase 2 dimension mapping

Both `AssessmentNormalizer.extractFeatures()` and
`BusinessCandidateProvider.toCandidate()` reduce their side to a 0-1 value
per dimension (or, for the two set-membership dimensions, a raw
code/selection) using shared constants in `scoring/dimension-mapping.ts`,
so a 0-1 value means the same thing on both sides of every
`ScoreCalculator` comparison (`rawValue = 1 - abs(userValue -
candidateValue)`, except where noted):

| Dimension | Assessment side | Business side | Notes / assumptions flagged |
|---|---|---|---|
| `skills` | avg of all 10 `skills` section ratings | avg importance across every `BusinessSkill` row | Aggregate — overlaps the 5 skill-derived dimensions below by construction (see below) |
| `budget` | `financialSituation.budget` slider (0-50k) | midpoint of `BusinessBudget.minInvestment`/`.maxInvestment` | Coarse: a range collapsed to its midpoint, not a containment check |
| `lifestyle` | avg of `lifestyle.freedom` + `lifestyle.workingHours` | avg of `BusinessLifestyle.freedomLevel` + weekly-hours midpoint | — |
| `risk` | `risk.riskTolerance` slider (0-100) | `BusinessRisk.riskLevel` (low/moderate/high → 0/0.5/1) | Three-point ordinal, coarse by necessity — no finer risk data exists |
| `timeline` | `financialSituation.desiredTimeline` (choice → representative months) | `BusinessTimeline.timeToBreakEvenMonths` | `twoYearsPlus` capped at 24 months — a judgment call, the option is open-ended |
| `industryPreference` | `interests.industries` (multi-select) | `BusinessType.category.industry.code` | **Set membership, not a numeric diff** — see `BusinessCandidate.industryCode` |
| `businessModelPreference` | `interests.businessModels` (multi-select) | `BusinessType.businessModel` | Same as above — see `BusinessCandidate.businessModelCode` |
| `communicationStyle` | `skills.communication` rating | `BusinessSkill` importance for key `"communication"` | **Flagged:** uses the skills-section rating, not `matchingHints.communicationStyle`'s freeform tags — those aren't seeded into Prisma at all (Phase 1), so they're unusable as a candidate-side signal in v1 |
| `leadership` | `personality.leadership` rating | `BusinessSkill` importance for key `"management"` | — |
| `creativity` | `personality.creativity` rating | avg `BusinessSkill` importance for keys `"design"`/`"content"` | Approximation — no single "creativity" skill key exists |
| `technicalAbility` | avg of `skills.programming` + `skills.ai` | avg `BusinessSkill` importance for keys `"programming"`/`"ai"` | Overlaps `skills` (the aggregate) by construction |
| `salesOrientation` | `personality.sellingPreference` rating | `BusinessSkill` importance for key `"sales"` | — |
| `location` | `lifestyle.remote` (remote/hybrid/inPerson) | `BusinessLifestyle.workMode` | Ordinal, not arbitrary — hybrid is a genuine midpoint (see dimension-mapping.ts) |
| `workStyle` | `lifestyle.onlineVsOffline` (online/hybrid/offline) | `BusinessLifestyle.onlineOffline` | Same ordinal reasoning as `location` |

**Assumptions explicitly flagged, not buried:**
- **`industryPreference`/`businessModelPreference` are set-membership, not numeric-diff, comparisons.** There's no meaningful ordering over "tech"/"health"/"finance"/etc. that a 0-1 scalar diff could express honestly (unlike `location`/`workStyle`, which really are spectrums). `BusinessCandidate` carries `industryCode`/`businessModelCode` (raw strings) and `AssessmentFeatureVector` carries `rawCategorySelections` alongside the usual `dimensionInputs` scalar specifically so `ScoreCalculator` can check real set membership for these two dimensions instead of diffing two arbitrary encoded numbers — see `types/business-candidate.ts` and `types/assessment-input.ts`.
- **"noPreference" answers are encoded as the dimension midpoint (0.5)**, not given true "always matches" semantics — see `dimension-mapping.ts`'s `NO_PREFERENCE_VALUE`. A simple, defensible approximation, not a correct one for every case.
- **The 12-trait personality vocabulary (`requiredPersonality`/`preferredPersonality` in `matchingHints`) is out of scope for v1 scoring** — it isn't folded into any dimension. Neither is `idealFounderArchetypes`. Both would need a real design decision (which trait maps to which dimension, if any) that this phase deliberately didn't make unilaterally.
- **The 1-5 (Assessment/`matchingHints`) vs. 1-10 (Skill DNA) scale question flagged in the Architecture Reconciliation sprint is moot for v1** — Skill DNA (`business-dna.json`'s `skillDna.ratings`) was never seeded into Prisma in Phase 1 (there's no Prisma table for it), so it isn't a candidate-side input at all today. Every skill-derived dimension above (`skills`, `communicationStyle`, `leadership`, `creativity`, `technicalAbility`, `salesOrientation`) uses `BusinessSkill.importance`, which is already 1-5 end to end — no conversion needed, and none exists.
- **Five dimensions decompose the same 10 skill keys from different angles** (the aggregate `skills` dimension vs. the 5 specific extractions above) — those keys get more total influence on a candidate's blended score than, say, `budget` or `risk`, since they contribute to multiple dimensions. An accepted v1 simplification given uniform weighting, worth revisiting once real per-dimension weights exist.
- **Per-candidate dimension coverage varies.** A candidate only gets a `leadership`/`creativity`/`technicalAbility`/`salesOrientation`/`communicationStyle` score if its seeded `BusinessSkill` rows happen to include the relevant key(s) — most of the 21 businesses only have 3-5 skill rows total (required + preferred combined), so several of these 5 dimensions are legitimately absent for many candidates. This degrades gracefully (`ScoreCalculator` only scores dimensions present on both sides) but does mean coverage — and therefore `confidenceScore`, see below — differs candidate to candidate.

**Confidence score (v1 stub):** `CompatibilityCalculator` computes
`confidenceScore` as `answeredQuestionCount / totalQuestionCount` when
`DefaultMatchingEngine` supplies both (it always does, from
`RawAssessmentAnswers`/`features/assessment/config/sections.ts`'s 41
questions); falls back to `dimensionScores.length / 14` (dimension
coverage) if a caller invokes `CompatibilityCalculator` directly without
supplying question counts. A real confidence model (e.g. weighting
required vs. optional questions, or per-dimension data quality) is future
work.

**Skill 1-5 vs. 1-10 scale (Architecture Reconciliation, decision 3):**
`features/business-dna`'s Skill DNA section still describes a business's
skill requirements on a 1-10 scale, in `business-dna.json` — but as noted
above, that section was never wired into Prisma seeding, so this scale
difference has no effect on v1 scoring. It remains a real, documented gap
if a future phase seeds Skill DNA into some new table and wants to compare
it against Assessment's 1-5 self-ratings.

## Rule system

`rules/rule-types.ts` defines `MatchingRule` as **data, not code**: a
`type` (`required` / `preferred` / `bonus` / `penalty` / `exclusion` /
`aiGenerated`), a list of `RuleCondition`s (dimension + operator + value),
and an optional `scoreImpact`. This mirrors how `BusinessQuestionWeight`
works in the Business Engine — a rule that's a data row rather than a
function can be authored through an admin UI, generated by an AI process,
A/B tested, or audited by provenance (`aiGenerated` rules are the same
shape as human-authored ones, just tagged differently), all without a
deploy.

`rules/rule-registry.ts` exports `matchingRules: MatchingRule[] = []` —
empty on purpose, still true in Phase 2 (no rule has been authored — that's
a content/product task, not something this phase invents). `RuleEngine`
now has two implementations: `PlaceholderRuleEngine` (unchanged, still
throws, still tested as throwing) and `NoOpRuleEngine` (Phase 2's default)
— `evaluate()` always returns `[]` and `isExcluded()` always returns
`false`. This was a deliberate v1 product decision, not a stand-in for
missing logic: **no hard exclusion rules exist for v1** — a budget or
timeline mismatch only ever reduces a candidate's `ScoreCalculator`-driven
score, never removes it from the results outright. When real rules are
authored, they plug in by implementing `RuleEngine` for real (or
populating `matchingRules` and giving `NoOpRuleEngine` real logic) — the
`DefaultMatchingEngine.run()` orchestration already calls
`ruleEngine.isExcluded()` per candidate and drops any candidate it flags,
so exclusion support requires no orchestration change, only a real
`RuleEngine`.

## The compatibility result

`types/compatibility-result.ts` defines the normalized output every
pipeline run produces, one per (user, Assessment, BusinessType):
`overallScore`, `dimensionScores`, `strengths`, `weaknesses`,
`matchedSkills`, `missingSkills`, `recommendedBusinessTypes`,
`confidenceScore`, and `reasoning` (`summary` plus the deterministic
`ruleResults`). As of Phase 2, `DefaultMatchingEngine.assembleResults()`
actually builds this shape for real:
- `strengths`/`weaknesses` — dimension keys whose `DimensionScore.rawValue`
  is `>= 0.7` / `<= 0.3` respectively (a simple v1 threshold, not a
  statistically-derived one — flagged, not hidden).
- `matchedSkills`/`missingSkills` — for each of the candidate's
  `skillKeys`, whether the user's own self-rating for that same skill key
  (from the Assessment's `skills` section — same 10-key vocabulary, direct
  lookup) is `>= 0.5` (i.e. a 3-out-of-5 self-rating or higher).
- `recommendedBusinessTypes` — still empty. Ranking has no notion of
  "related" yet; unchanged from the original design.
- `reasoning.summary` — comes straight from `ExplanationGenerator`, which
  is still a throwing placeholder by default (see "Services" above) — so
  `summary` is only populated when a caller supplies a real or stub
  override.

This is the shape that should eventually be persisted as a
`BusinessMatchResult` row via `businessMatchRepository.create()` (see
`features/business-engine/repositories/business-match-repository.ts`) —
that repository already knows how to store and retrieve it; **wiring that
call up is Phase 3's job** (along with replacing the Assessment results
page's `MOCK_DNA_RESULTS`), not this phase's — Phase 2 stops at a working
`DefaultMatchingEngine.run()` returning real `CompatibilityResult[]`.

## Prompts

`prompts/prompt-template.ts` defines a generic `PromptTemplate<TVariables>`
shape: an id, a description, a list of required variables, and a `build()`
function. The five requested templates (`explain-match`,
`explain-strengths`, `explain-weaknesses`, `improve-compatibility`,
`business-summary`) each declare their real, typed variable list — but
every `build()` throws `NotImplementedError`, because no prompt copy has
been written. Once it is, `build()` should route its output through
`withLocaleInstruction()` (`src/ai/prompts/business-match.ts`) so matching
explanations stay consistent with how the rest of the app pins AI output
to the user's locale.

## Tests

Every service has a test in `tests/` — the original `Placeholder*`
assertions are untouched, and each file now also covers its `Default*`
(or `NoOpRuleEngine`) real implementation with fixture-based unit tests
(no live database — `business-candidate-provider.test.ts` and
`matching-engine.test.ts`'s fakes/stubs stand in for `BusinessRepository`/
`BusinessCandidateProvider`/`ExplanationGenerator`). Run with `npm test`
(`vitest run`).

**Known pre-existing collection failure, unrelated to Phase 2:**
`business-candidate-provider.test.ts` and `matching-engine.test.ts` both
fail at the *file-collection* stage (before any test in them runs) with
`Error: This module cannot be imported from a Client Component module` —
both files transitively import `features/business-engine/repositories`,
which has `import "server-only"` at module scope. `server-only` resolves
to a no-op only under Node's `"react-server"` export condition (which
Next.js's build sets, but vitest's default config does not) — this
predates Phase 2 entirely (verified: it fails identically before and
after this phase's changes) and wasn't introduced or fixed here. Working
around it for `vitest` config, or for plain-Node scripts, is:
`NODE_OPTIONS="--conditions=react-server"` (see
`scripts/matching-engine-integration-check.ts`, which needs this to run
outside Next.js).

For most of the rest of the app (including these two suites' actual
production code, and any script hitting a real database): run
`npm install && npm run db:generate` first if you haven't, and see
`prisma/seed-business-engine.ts` to populate the catalog these tests and
scripts assume exists.

## Where this plugs into the rest of the app

- **Assessment data** comes from `features/assessment` — specifically the
  same `AssessmentSession`/`AssessmentAnswer` rows that back
  `getOrCreateActiveSession()`. This feature still doesn't import that
  feature's Prisma models or server actions directly (see
  `RawAssessmentAnswers` in `types/assessment-input.ts` — a deliberately
  independent shape). Phase 2 added two narrow, one-directional exceptions
  to that decoupling, both read-only and both worth calling out precisely
  since they're new:
  - **`fetchRawAnswersForMatching()`** (in
    `features/assessment/actions/assessment-actions.ts`) is the real
    `fetchRawAnswers` adapter the README always said "whoever wires up...
    is expected to" write — it lives on the assessment side
    (assessment → matching-engine, not the reverse) and does mechanical
    field renaming, no scoring logic. `createMatchingEngine()`'s
    `fetchRawAnswers` default still throws (see the top of this README) —
    defaulting it to `fetchRawAnswersForMatching()` here would give this
    feature exactly the hard dependency direction it's designed to avoid;
    a caller (a server action, a script) is expected to pass it explicitly.
  - **`AssessmentNormalizer`** imports `flattenedQuestions`/`QuestionConfig`
    from `features/assessment/config/sections` (config/types only, never
    Prisma models or actions) — normalizing a raw answer correctly
    requires knowing the source question's type and numeric bounds, and
    importing the single source of truth for that is safer than
    hand-duplicating a shadow copy inside this feature that could drift.
- **Business data** comes from `features/business-engine` — the
  `BusinessCandidateProvider` is wired to `businessRepository.listFull()`
  (see "Services" above for why `.listFull()`, not `.list()`).
- **AI** plugs in at exactly one stage: AI Explanation, via
  `ExplanationGenerator` and the five prompt templates. Nothing upstream of
  that stage should require an AI call — scoring, rules, and ranking are
  meant to be deterministic (or later, ML-driven — see below), with AI
  reserved for turning an already-computed result into human language.
- **Scoring** plugs in at `ScoreCalculator`, `CompatibilityCalculator`, and
  `WeightConfig` — three separate extension points so a real
  implementation can, for instance, ship a real `ScoreCalculator` while
  `CompatibilityCalculator` is still a simple weighted sum.

## Where future ML models could replace parts of this pipeline

The pipeline is deliberately staged so a learned model could take over any
one stage without the others needing to change shape:

- **Feature Extraction** (`AssessmentNormalizer.extractFeatures`) could be
  replaced by an embedding model instead of hand-written per-dimension
  rules — as long as it still produces an `AssessmentFeatureVector`.
- **Weighted Scoring** (`ScoreCalculator`) is the most likely first
  candidate for a learned model: today it's specified as "compare a
  feature vector to a candidate's dimension profile," which is exactly the
  shape of input a similarity model or a learned-to-rank model expects.
- **Compatibility Calculation** (`CompatibilityCalculator`) — the
  combination of per-dimension scores into one number — could become a
  trained model instead of a weighted sum, learned from which matches
  users actually pursued (`Business.matchResultId` on a real `Business`
  row is exactly the label such a model would train on).
- **Ranking** (`RankingEngine`) could incorporate a learned re-ranking step
  (e.g. for diversity or novelty) without anything upstream changing.

None of this is implemented. It's structured so that it *can* be, one
stage at a time, without a rewrite.
