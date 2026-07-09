# Explanation Engine — architecture

This is infrastructure, not intelligence — same spirit as
[`features/matching-engine`](../matching-engine/README.md). Nothing here
generates a sentence of explanation text, computes a score, calls OpenAI,
or invents business data. Every service is either a typed interface or a
placeholder implementation that throws `NotImplementedError` the moment
it's asked to do real work. What exists is the *shape* the future
explanation engine will fill in: a nine-stage pipeline, nine
dependency-injected services, and a fully-structured `ExplanationResult`
type — everything a "why this match" UI will eventually need, with none
of the actual reasoning written yet.

## Purpose

The Matching Engine ([`features/matching-engine`](../matching-engine/README.md))
produces a `CompatibilityResult`: a number, a list of dimension scores, and
some bare dimension/skill keys. That's enough to *rank* businesses, but not
enough to *explain* a match to a person in a way they'd trust. This
feature's job is to take one `CompatibilityResult` (plus the Assessment and
Business Genome data behind it) and turn it into a rich, structured
explanation — strengths, growth areas, warnings, recommended actions, and
context on risk/finances/timeline — without ever touching how the score
itself was computed.

Everything this engine produces is **structured data**: enums, numeric
contributions, and `translationKey` references — not prose. That's
deliberate, for the same reason `MatchReasoning.ruleResults` in
matching-engine is structured: a "why this match" UI can render a
deterministic breakdown today, and a future AI layer can turn that
breakdown into fluent, localized, on-brand prose later without this
engine's shape ever having to change.

## Reused types (nothing here is redefined)

| Type | Owned by | Used for |
|---|---|---|
| `AssessmentFeatureVector` | `matching-engine/types/assessment-input` | the Assessment Profile input |
| `CompatibilityResult` | `matching-engine/types/compatibility-result` | Dimension Scores, Compatibility Score, Strengths, Weaknesses, Matched/Missing Skills — all nested inside it |
| `DimensionScore` | `matching-engine/scoring/dimension-score` | per-dimension detail within `CompatibilityResult.dimensionScores` |
| `MatchingDimension` | `matching-engine/scoring/dimensions` | tagging which dimension a reason/growth area/warning/action relates to |
| `RuleEvaluationResult` | `matching-engine/rules/rule-types` | nested in `CompatibilityResult.reasoning.ruleResults`; what `SummaryBuilder` reads to build `matchReasons` |
| `BusinessGenome` | `business-library/schema.ts` | the Business Genome and Business Metadata inputs |

`dto/explanation-engine-input.dto.ts` wraps all of these into one
`ExplanationEngineInput` — every service in this feature takes that one
type (plus, for a few stages, another service's output) as input. Nothing
in `dto/`, `types/`, or `schemas/` re-declares a field that already exists
on one of the types above.

## The pipeline

```
Assessment
      │                         (ExplanationEngineInput.assessmentFeatures —
      ▼                          already computed by the Matching Engine)
Business Genome
      │                         (ExplanationEngineInput.businessGenome —
      ▼                          already validated by business-library)
Dimension Analysis
      │                         (ExplanationEngineInput.compatibilityResult
      ▼                          .dimensionScores — no dedicated service; see
                                  "Judgement calls" below)
Strength Detection
      │                         StrengthAnalyzer.analyze()
      ▼                         → StrengthReason[]
Weakness Detection
      │                         WeaknessAnalyzer.detect()
      ▼                         → DetectedWeakness[]
Growth Analysis
      │                         GrowthOpportunityAnalyzer.analyze()
      ▼                         → GrowthArea[]
Warning Analysis
      │                         WarningAnalyzer.analyze()          → Warning[]
      │                         ContextualExplainer.explainRisk()       → RiskExplanation
      │                         ContextualExplainer.explainFinancials() → FinancialExplanation
      ▼                         ContextualExplainer.explainTimeline()   → TimelineExplanation
Action Planning
      │                         ActionPlanner.plan()
      ▼                         → RecommendedAction[]
Explanation Result
                                 SummaryBuilder.build()         → overallSummary, matchReasons[]
                                 ConfidenceExplainer.explain()  → confidenceExplanation
                                 → ExplanationResult (see dto/explanation-result.dto.ts)
```

`services/explanation-engine.ts` (`DefaultExplanationEngine.run()`) is the
only place that knows this whole sequence, exactly like
`DefaultMatchingEngine.run()`. See `types/pipeline.ts` for the same diagram
alongside the `ExplanationPipelineStage` enum every `NotImplementedError`
is tagged with.

## Services

| Service | Stage(s) | Responsibility |
|---|---|---|
| `ExplanationEngine` | orchestrates all stages | The only service that knows the full pipeline order. `createExplanationEngine(overrides)` in `services/explanation-engine.ts` is the composition root — every dependency defaults to its placeholder, so swapping one in later is a one-line change. |
| `StrengthAnalyzer` | Strength Detection | Expands `CompatibilityResult.strengths` (bare dimension keys) into structured `StrengthReason`s. |
| `WeaknessAnalyzer` | Weakness Detection | Expands `CompatibilityResult.weaknesses`/`missingSkills` into structured `DetectedWeakness`es — the *input* to Growth Analysis, not the final `growthAreas[]` itself. |
| `GrowthOpportunityAnalyzer` | Growth Analysis | Turns `DetectedWeakness[]` into actionable `GrowthArea[]`. |
| `WarningAnalyzer` | Warning Analysis | Surfaces structured cautions (budget, skill, risk, data quality, legal, market) as `Warning[]`. |
| `ContextualExplainer` | Warning Analysis | Not one of the seven originally-named services — see "Judgement calls" below. Produces `RiskExplanation`, `FinancialExplanation`, and `TimelineExplanation` from `BusinessGenome` fields (`risks`, `budget`, `financialInformation`, `revenueSpeed`, `growthPotential`) compared against the user's own signals. |
| `ActionPlanner` | Action Planning | Turns `GrowthArea[]` + `Warning[]` into concrete `RecommendedAction[]`. |
| `SummaryBuilder` | Explanation Result | Produces `overallSummary` and `matchReasons[]` from `CompatibilityResult.dimensionScores` and `.reasoning.ruleResults`. |
| `ConfidenceExplainer` | Explanation Result | Explains (does not recompute) `CompatibilityResult.confidenceScore` as structured `ConfidenceFactor`s. |

Every service is one interface (in `interfaces/`) plus one `Placeholder*`
class (in `services/`) — split into separate folders this sprint, unlike
matching-engine where interface and implementation share a file. All nine
throw `NotImplementedError` unconditionally; none reads its input for
anything other than the type signature.

## Judgement calls

The spec for this sprint left a few things open. Here's what was decided
and why:

- **Who owns `riskExplanation`/`financialExplanation`/`timelineExplanation`?**
  These are `ExplanationResult` fields, but none of the seven named
  services was an obvious fit, and the fixed nine-stage pipeline had no
  room for three new stages. Rather than bolt them onto
  `WarningAnalyzer` (which would make one interface do two conceptually
  different jobs — "is something wrong" vs. "what should you know about
  risk/money/time") or produce them ad hoc inside `ExplanationEngine`
  itself (breaking the "every service is interface + placeholder" rule),
  this sprint adds one small `ContextualExplainer` interface with three
  methods, running alongside `WarningAnalyzer` in the Warning Analysis
  stage. It's the smallest addition that keeps the DI/placeholder pattern
  intact everywhere.
- **Dimension Analysis has no service.** `ScoreCalculator` in
  matching-engine already produced `CompatibilityResult.dimensionScores`;
  re-analyzing them here would be scoring logic bleeding into an
  explanation feature. `StrengthAnalyzer` and `WeaknessAnalyzer` read
  `dimensionScores` directly off `ExplanationEngineInput` instead.
- **`SummaryBuilder` produces both `overallSummary` and `matchReasons[]`.**
  The spec only mentions "produces overallSummary," but a top-line summary
  and its itemized justification are the same analytical concern (why is
  this a good match, at two levels of detail) — splitting them into two
  services seemed like an artificial boundary.
- **`WeaknessAnalyzer`'s output is a new type, `DetectedWeakness`, not
  `GrowthArea`.** The spec's parenthetical — "produces growthAreas[]
  input" — reads as "produces the input that becomes growthAreas[]," so
  `WeaknessAnalyzer.detect()` and `GrowthOpportunityAnalyzer.analyze()`
  are kept as two stages with a small new DTO between them, mirroring how
  matching-engine keeps `ScoreCalculator` and `CompatibilityCalculator`
  separate for the same reason (different questions, different timelines
  for getting real logic).
- **`dto/` vs. `types/`.** matching-engine keeps its main result type
  (`CompatibilityResult`) directly under `types/`. This sprint asked for
  a `dto/` folder as well, so the split here is: `types/` holds the
  pipeline stage enum (a genuinely pipeline-shaped type), and `dto/`
  holds every actual data shape — the input wrapper and every
  `ExplanationResult` part. `schemas/` then holds one Zod schema per
  `dto/` file, each annotated `z.ZodType<TheDtoType>` so the schema and
  the interface can't silently drift apart. The two reused types that
  don't have a Zod schema anywhere upstream (`AssessmentFeatureVector`,
  `CompatibilityResult` — matching-engine is plain TypeScript throughout)
  are validated with `z.custom<T>()` in
  `schemas/explanation-engine-input.schema.ts` rather than hand-mirrored,
  to avoid creating a second, driftable copy of their shape.

## Extension points

Five things this architecture is built to support, none of them
implemented yet:

1. **Future AI generation.** Every `ExplanationResult` part that could
   eventually carry prose has an optional field reserved and left
   `undefined` for it — e.g. `OverallSummary.aiNarrative` — mirroring
   `MatchReasoning.summary` in matching-engine. A future AI layer plugs in
   *after* `ExplanationEngine.run()`, the same way matching-engine's
   `ExplanationGenerator` (see `matching-engine/services/explanation-generator.ts`
   and `matching-engine/prompts/`) wraps an already-ranked
   `CompatibilityResult` rather than computing one. Nothing upstream of
   that point should ever need to become AI-aware.
2. **Multiple explanation styles.** Because every field is a
   `translationKey` plus structured values rather than a rendered string,
   a "style" (terse vs. encouraging vs. clinical, for example) is a
   choice made at render time — a different message bundle or a
   different AI prompt keyed to the same `translationKey`s — not a
   different `ExplanationResult` shape.
3. **Multiple languages.** Every `translationKey` on every DTO
   (`MatchReason`, `StrengthReason`, `GrowthArea`, `Warning`,
   `RecommendedAction`, the various `*Explanation` parts) is meant to
   resolve through `messages/en.json` / `messages/ro.json`, the same
   convention `src/features/assessment/components/results/config.ts`
   uses for its DNA Profile/Work Style copy, and the same convention
   `MatchingRule.translationKey` uses in matching-engine.
4. **Custom business rules.** `repositories/explanation-rule-repository.interface.ts`
   defines `ExplanationRule` (a translationKey + a list of
   `RuleCondition`s, reused directly from `matching-engine/rules/rule-types.ts`)
   and `ExplanationRuleRepository` — a pure contract, no implementation,
   mirroring how `matching-engine/rules/rule-engine.ts` +
   `rule-registry.ts` keep rules as data rather than code so they can be
   authored, A/B tested, or AI-generated without a deploy.
5. **Industry-specific explanations.** `ExplanationRule.appliesToIndustry`
   is typed as `BusinessGenome["industry"]["primary"]` — the same
   `industryTypeSchema` enum every Business Genome document declares (see
   `business-library/schema.ts`) — so a future rule set can scope itself
   to, say, only SaaS or only local-service businesses without a new
   type.

## Persistence

`repositories/explanation-result-repository.interface.ts` defines
`ExplanationResultRepository` — save/find a generated `ExplanationResult`
by (assessmentId, businessTypeId) or by assessmentId — as a pure contract,
no implementation, no placeholder class, nothing calling it. Mirrors
`BusinessMatchRepository` in
`features/business-engine/repositories/business-match-repository.ts`,
which already knows how to persist a `CompatibilityResult`-shaped score;
this is the equivalent seat for its explanation.

## Tests

Every service has a test in `tests/`, asserting its placeholder throws
`NotImplementedError` — same style as matching-engine's test suite. Run
with `npm test` (`vitest run`). `tests/fixtures.ts` builds one shared
`ExplanationEngineInput`, reusing the Business Genome Library's one real
reference example (`business-library/examples/ai-automation-agency.ts`)
for the `businessGenome` field instead of fabricating fake business data.

## See also

- [`features/matching-engine/README.md`](../matching-engine/README.md) —
  the pipeline this one consumes the output of.
- [`business-library/README.md`](../../../business-library/README.md) —
  the Business Genome standard `businessGenome` is validated against.
