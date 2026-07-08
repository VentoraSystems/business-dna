# Matching Engine — architecture

This is infrastructure, not intelligence. Nothing in this folder scores a
user against a business, calculates a compatibility percentage, or
generates a recommendation — every service is either a typed interface or
a placeholder implementation that throws `NotImplementedError` the moment
it's asked to do real work. What exists is the *shape* the future matching
engine will fill in: a nine-stage pipeline, seven dependency-injected
services, a scoring model with fourteen (unweighted) dimensions, a
declarative rule system with zero rules, five prompt templates with no
content, and a normalized result type everything eventually needs to
produce.

Think of this the way you'd think about the recommendation infrastructure
behind Spotify or Netflix *before* any model has been trained: the catalog
schema exists (see `features/business-engine`), the "listening history"
schema exists (see `features/assessment`), and there's a well-defined place
for a score to be computed and explained — but no algorithm has opinions
yet.

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

All seven requested services exist as an interface plus a placeholder
class, in `services/` (four of them) and alongside their most related
concern (`scoring/`, `rules/`) for the other three:

| Service | Stage(s) | Lives in |
|---|---|---|
| `AssessmentNormalizer` | Normalization, Feature Extraction | `services/assessment-normalizer.ts` |
| `BusinessCandidateProvider` | Business Candidate Retrieval | `services/business-candidate-provider.ts` |
| `ScoreCalculator` | Weighted Scoring | `scoring/score-calculator.ts` |
| `CompatibilityCalculator` | Compatibility Calculation | `scoring/compatibility-calculator.ts` |
| `RuleEngine` | Compatibility Calculation | `rules/rule-engine.ts` |
| `RankingEngine` | Ranking | `services/ranking-engine.ts` |
| `ExplanationGenerator` | AI Explanation | `services/explanation-generator.ts` |
| `MatchingEngine` | orchestrates all of the above | `services/matching-engine.ts` |

Every one is constructor-injected. `createMatchingEngine(overrides)` in
`services/matching-engine.ts` is the composition root — it defaults every
dependency to its placeholder implementation, so replacing one (once it's
real) is a one-line change at the call site, not a refactor.

One exception worth calling out: `BusinessCandidateProvider`'s default
implementation (`RepositoryBusinessCandidateProvider`) genuinely calls
`businessRepository.list()` from `features/business-engine` — fetching
rows is real infrastructure, not matching logic. It only throws once it
has an actual `BusinessType` to translate into a scorable
`BusinessCandidate`, because *that* mapping (how a catalog entry's budget,
risk, lifestyle, and skill rows become 0-1 dimension values) is a design
decision this scaffold deliberately leaves open. Since the catalog has no
seeded rows yet (see `prisma/seed-business-engine.ts`), this in practice
just returns `[]` today.

## Scoring model

Fourteen dimensions, as specified, in `scoring/dimensions.ts`:
`skills`, `budget`, `lifestyle`, `risk`, `timeline`, `industryPreference`,
`businessModelPreference`, `communicationStyle`, `leadership`,
`creativity`, `technicalAbility`, `salesOrientation`, `location`,
`workStyle`.

`scoring/weight-config.ts` defines `WeightConfig` — a versioned map from
dimension to weight — and exports exactly one instance,
`UNWEIGHTED_CONFIG`, where `weights: {}`. No dimension has a weight.
Versioning exists from day one so that, once weights are assigned, the
engine can support more than one configuration side by side (A/B testing a
new weighting, or letting a specific product decision override the
default) without a schema change.

`ScoreCalculator` turns one (assessment, candidate, weights) triple into a
`DimensionScore[]` — one entry per shared dimension, carrying both the raw
0-1 alignment and the weighted contribution. `CompatibilityCalculator` then
combines those (plus rule outcomes) into the single `overallScore` /
`confidenceScore` pair. These are deliberately two different services: how
individual dimensions compare, and how those comparisons combine into one
number, are different questions that may evolve on different timelines —
see "Where ML could replace parts of this" below.

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
empty on purpose. `RuleEngine.evaluate()` is what will eventually run a
candidate's data against that list; right now it only knows how to throw.

## The compatibility result

`types/compatibility-result.ts` defines the normalized output every
pipeline run should eventually produce, one per (user, Assessment,
BusinessType): `overallScore`, `dimensionScores`, `strengths`,
`weaknesses`, `matchedSkills`, `missingSkills`, `recommendedBusinessTypes`,
`confidenceScore`, and `reasoning` (itself split into a future AI
`summary` plus the deterministic `ruleResults`, so the "why this match" UI
can render a rule-based breakdown even before any AI text exists). This is
the shape that should eventually be persisted as a `BusinessMatchResult`
row via `businessMatchRepository.create()` (see
`features/business-engine/repositories/business-match-repository.ts`) —
that repository already knows how to store and retrieve it; nothing calls
it yet.

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

Every service has a test in `tests/`, asserting either that its
placeholder throws `NotImplementedError`, or — for the handful of things
that are genuinely implemented (`utils/normalization-math.ts`'s pure math
helpers, and `weight-config.ts`'s `getDimensionWeight` default-to-0
behavior) — that they behave correctly. Run with `npm test`
(`vitest run`). Note that `business-candidate-provider.test.ts` injects a
fake `BusinessRepository` rather than hitting a real database, so the test
suite doesn't require Prisma to be generated to run — but most of the rest
of the app does; run `npm install && npm run db:generate` first if you
haven't.

## Where this plugs into the rest of the app

- **Assessment data** comes from `features/assessment` — specifically the
  same `AssessmentSession`/`AssessmentAnswer` rows that back
  `getOrCreateActiveSession()`. This feature doesn't import that feature's
  internals directly (see `RawAssessmentAnswers` in
  `types/assessment-input.ts` — a deliberately independent shape); whoever
  wires up a real `fetchRawAnswers` for `createMatchingEngine()` is
  expected to adapt one to the other.
- **Business data** comes from `features/business-engine` — the
  `BusinessCandidateProvider` is already wired to `businessRepository`.
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
