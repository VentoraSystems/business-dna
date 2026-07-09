# Entrepreneur DNA Specification

**Companion documents:** [01 — Canon](./01-businessdna-canon.md) ·
[03 — Business DNA Profile Specification](./03-business-dna-profile-specification.md) ·
[04 — Knowledge Graph Specification](./04-knowledge-graph-specification.md).
**Source of truth in code:**
[`src/features/matching-engine/scoring/dimensions.ts`](../../src/features/matching-engine/scoring/dimensions.ts)
(the `MatchingDimension` enum), and
[`src/features/matching-engine/types/assessment-input.ts`](../../src/features/matching-engine/types/assessment-input.ts)
(`AssessmentFeatureVector`, `DimensionInput`). See
[`matching-engine/README.md`](../../src/features/matching-engine/README.md)
for the full pipeline this feeds into.

This document specifies the **Entrepreneur DNA**: the fourteen dimensions
`MatchingDimension` defines, which together are the normalized
representation of a person the rest of BusinessDNA compares against a
Business DNA (Document 3). This is a specification, not an
implementation — no algorithm, calculation, or weight is described here.
None of that exists yet in the codebase either: `ScoreCalculator` and
`CompatibilityCalculator` are still placeholders (see
`matching-engine/README.md`).

## How an Entrepreneur DNA is gathered, today

Every dimension below is ultimately sourced from the Assessment
(`src/features/assessment/config/sections.ts`), which asks its questions
grouped into eight sections (`aboutYou`, `financialSituation`,
`personality`, `skills`, `lifestyle`, `risk`, `interests`, `vision`) —
not one section per dimension. The mapping from assessment questions to
dimensions is many-to-one in places, and for one dimension
(`communicationStyle`) there is currently no dedicated question at all.
Each dimension's entry below states its actual source questions, honestly
including where that mapping is partial or absent, rather than implying a
clean 1:1 the codebase doesn't have yet.

## Scale conventions

Three different numeric conventions appear across the pipeline, and it
matters which one a given field uses:

| Convention | Range | Where it appears |
|---|---|---|
| **Rating** | integer 1-5 | Assessment `rating`-type questions (`RatingInput`, defaulting to `min:1, max:5` in `question-renderer.tsx`); the same convention as business-library's `ratingScaleSchema` (skill/personality `importance`, `technicalLevel`, etc. in `matchingMetadata`) |
| **Raw slider value** | question-specific (e.g. €0-50,000 budget, 0-100% risk tolerance, 1-60 hrs/week availability) | Assessment `slider`-type questions, before normalization |
| **Normalized dimension value** | float, 0-1 | `DimensionInput.value` (`AssessmentFeatureVector`) and `DimensionScore.rawValue` (per-candidate comparison) — what every rating and every slider is eventually mapped to, once `AssessmentNormalizer` is implemented |

`AssessmentFeatureVector.dimensionInputs` is `Partial<Record<MatchingDimension, DimensionInput>>`
— a dimension can be **absent** if the relevant questions weren't
answered; nothing forces all fourteen to be populated. Each `DimensionInput`
also carries `contributingQuestionKeys: string[]`, which is how the
"Gathered via" column below is meant to eventually become inspectable at
runtime, not just documented here.

---

## The 14 dimensions

### 1. Skills — `skills`

- **Description:** How capable the person rates themselves across the
  ten skill areas the platform tracks (marketing, sales, programming, AI,
  finance, management, design, content, negotiation, communication).
- **Purpose:** Lets a candidate business's `requiredSkills`
  (Document 3 §7) be compared against what the person actually brings.
- **Scale:** Ten separate 1-5 ratings at the Assessment layer
  (`skills.*`), reduced to a single normalized 0-1 `DimensionInput` at
  the Feature Extraction stage — how ten sub-ratings become one
  dimension value is unspecified (that reduction is scoring logic, not
  yet built).
- **Interpretation:** Higher does not mean "objectively skilled" — it
  means "self-reported confidence," which is itself useful signal (a
  business requiring high `sales` importance is a worse fit for someone
  who rates their own sales ability low, independent of whether that
  self-rating is well-calibrated).
- **Relationships:** Directly cross-referenced by Business DNA's
  `requiredSkills` (Document 3 §7) and `matchingMetadata.requiredSkills`/
  `preferredSkills` (Document 3 §38); conceptually overlaps
  `technicalAbility` and `salesOrientation` below, which isolate two of
  the ten skill areas (programming/AI, and sales) as their own
  dimensions.
- **Gathered via:** Assessment `skills` section — ten `rating` questions,
  one per skill key, each mapping 1:1 to `skillKeySchema` (business-library)
  / `RequiredSkill.key` (business-engine).

### 2. Budget — `budget`

- **Description:** How much capital the person can put toward starting a
  business, plus (implicitly, via the same slider) an income-urgency
  signal from `aboutYou.incomeUrgency`.
- **Purpose:** Compared against a Business DNA's `budget.minInvestment`/
  `maxInvestment` (Document 3 §10) to filter or score fit before any
  other dimension matters — an otherwise perfect match at an
  unaffordable budget isn't a real recommendation.
- **Scale:** Assessment slider, €0–€50,000 in €500 steps → normalized to
  0-1.
- **Interpretation:** A low value doesn't disqualify a match on its own;
  it interacts with `businessModelPreference` (some models have near-zero
  minimum investment) and `timeline`/`risk` (urgency and risk tolerance
  shape how much budget flexibility actually matters).
- **Relationships:** Business DNA `budget` (§10), `financialInformation`
  (§24, startup costs specifically). Interacts with `timeline` (a small
  budget with a short desired timeline is a harder combination to match
  than a small budget with a long one).
- **Gathered via:** Assessment `financialSituation.budget` (slider,
  €0-50,000).

### 3. Lifestyle — `lifestyle`

- **Description:** The person's preferred day-to-day working conditions —
  remote/hybrid/in-person, travel tolerance, team size preference, and
  desired weekly working hours.
- **Purpose:** Compared against Business DNA's `lifestyle` section
  (Document 3 §21), which describes the same axes from the business's
  side.
- **Scale:** Composite — several Assessment answers (see below) reduced
  to one normalized 0-1 dimension value; unlike `skills`, the inputs here
  aren't even all the same type (categorical choices plus a 1-5 rating
  plus a slider).
- **Interpretation:** This is the dimension most likely to produce a
  "technically compatible, personally miserable" mismatch if ignored —
  e.g. a high-compatibility business that requires in-person, high-travel
  work for someone who selected `remote`/`none`.
- **Relationships:** Business DNA `lifestyle` (§21) directly;
  `workStyle` and `location` below overlap conceptually (team-size and
  remote preference specifically) but are tracked as separate dimensions.
- **Gathered via:** Assessment `lifestyle` section in full — `remote`,
  `travel`, `employees`, `freedom` (rating), `workingHours` (slider),
  `b2bVsB2c`, `onlineVsOffline`.

### 4. Risk — `risk`

- **Description:** Comfort with uncertainty, tolerance for the
  possibility of failure, and confidence in one's own investment
  decisions.
- **Purpose:** Compared against a Business DNA's `difficulty` (§9) and
  `matchingMetadata.riskProfile` (§38) — a low-risk-tolerance person
  matched to a high-difficulty, high-uncertainty business is exactly the
  kind of mismatch this dimension exists to catch.
- **Scale:** A 0-100% slider (`riskTolerance`) plus two separate 1-5
  ratings (`failureTolerance`, `investmentConfidence`), combined into one
  normalized 0-1 value.
- **Interpretation:** Distinct from `budget` — a person can have ample
  capital and still score low on `risk` (risk-averse despite being able
  to afford the loss), or the reverse.
- **Relationships:** Business DNA `difficulty` (§9), `matchingMetadata.riskProfile`
  (§38), and indirectly `risks[]` (§30, specific risk items a genome
  documents) — a future `ContextualExplainer.explainRisk()`
  (explanation-engine) is exactly where this dimension and a genome's
  risk items are meant to be compared and explained together.
- **Gathered via:** Assessment `risk` section — `riskTolerance` (slider),
  `failureTolerance` (rating), `investmentConfidence` (rating).

### 5. Timeline — `timeline`

- **Description:** How quickly the person wants/needs to see results —
  from "three months" to "two years plus."
- **Purpose:** Compared against Business DNA's `revenueSpeed` (§11) and
  `financialInformation.breakEvenTimelineMonths` (§24).
- **Scale:** A single-choice question with four bands
  (`threeMonths`/`sixMonths`/`oneYear`/`twoYearsPlus`), normalized to 0-1
  (fastest-desired to most-patient, or vice versa — the direction isn't
  fixed by this specification).
- **Interpretation:** Interacts with `incomeUrgency`
  (`aboutYou.incomeUrgency`, not itself a `MatchingDimension`) — someone
  with high income urgency and a "two years plus" timeline preference is
  an internally inconsistent profile worth surfacing, not silently
  averaging away.
- **Relationships:** Business DNA `revenueSpeed` (§11),
  `financialInformation.breakEvenTimelineMonths` (§24),
  `growthPotential.timeHorizonMonths` (§23, for longer-term fit).
- **Gathered via:** Assessment `financialSituation.desiredTimeline`
  (single choice). `aboutYou.weeklyAvailability` is a related but
  separate signal (see `workStyle` below) — it is not currently folded
  into `timeline`.

### 6. Industry Preference — `industryPreference`

- **Description:** Which of the ten platform industries the person is
  interested in building in.
- **Purpose:** Compared 1:1 against a Business DNA's `industry.primary`/
  `industry.secondary` (§3).
- **Scale:** Multi-select over the same ten values as `IndustryType`
  (`business-engine/schemas/enums.ts`, `business-library`'s
  `industryTypeSchema`, and this platform's Knowledge Engine — see
  Document 4) — a categorical `categorySet`, not a scalar, at the
  Normalization stage; reduced to a 0-1 alignment value only once
  compared against a specific candidate's industry.
- **Interpretation:** This is the cleanest dimension in the set — the
  Assessment question, the Business Genome field, and the Knowledge
  Engine domain all share the exact same ten-value vocabulary, by design
  (see `business-library/README.md` → "Keep vocabulary aligned by
  convention").
- **Relationships:** Business DNA `industry` (§3); Knowledge Engine
  `KnowledgeDomain.Industries` (Document 4).
- **Gathered via:** Assessment `interests.industries` (multiple choice,
  all ten `IndustryType` values as options).

### 7. Business Model Preference — `businessModelPreference`

- **Description:** Which of the eight platform business models the
  person is drawn to (SaaS, e-commerce, service, marketplace, content,
  physical product, subscription, agency).
- **Purpose:** Compared 1:1 against a Business DNA's `businessModel.primary`/
  `.secondary` (§5).
- **Scale:** Multi-select (`cards`-type question) over the same eight
  values as `BusinessModelType`; categorical, same normalization caveat
  as `industryPreference`.
- **Interpretation:** Like `industryPreference`, this dimension's
  vocabulary is shared verbatim across Assessment, Business Genome, and
  (for future ingestion) the Knowledge Engine's `BusinessModels` domain.
- **Relationships:** Business DNA `businessModel` (§5); Knowledge Engine
  `KnowledgeDomain.BusinessModels` (Document 4).
- **Gathered via:** Assessment `interests.businessModels` (cards, all
  eight `BusinessModelType` values as options).

### 8. Communication Style — `communicationStyle`

- **Description:** How the person prefers to explain ideas and interact
  with others — intended to compare against a Business DNA's
  `matchingMetadata.communicationStyle` (§38, currently a freeform tag
  array, e.g. `["direct", "consultative"]`).
- **Purpose:** Distinguishing "can sell/lead" (captured by
  `salesOrientation`/`leadership`) from "prefers what kind of
  interaction" (this dimension) — a business requiring constant
  client-facing consultative communication is a different fit question
  than "how good are you at sales."
- **Scale:** Unspecified — see the honest gap below.
- **Interpretation:** N/A until a source question exists.
- **Relationships:** Business DNA `matchingMetadata.communicationStyle`
  (§38, itself explicitly marked "a future candidate for its own enum"
  in `schema.ts`).
- **Gathered via:** **No dedicated Assessment question currently
  exists for this dimension.** The closest proxy today is
  `personality.decisionMaking` (`intuitive` / `analytical` /
  `collaborative` / `decisive`), which conflates decision-making style
  with communication style — a real, if imperfect, signal, but not a
  clean source. This is an honest gap, not a resolved mapping: adding a
  dedicated Assessment question (and giving Business DNA's
  `communicationStyle` tag array a closed vocabulary to match) is future
  work this document is flagging, not deciding.

### 9. Leadership — `leadership`

- **Description:** How naturally the person takes charge and directs
  others.
- **Purpose:** Compared against `matchingMetadata.leadershipLevel` (§38)
  — relevant to businesses that require managing a team from the start.
- **Scale:** A single 1-5 rating, normalized to 0-1.
- **Interpretation:** Low leadership doesn't penalize solo-founder
  business fits; it should matter more for `teamSize.atLaunch: "large"`
  genomes (§22) than solo ones.
- **Relationships:** Business DNA `matchingMetadata.leadershipLevel`
  (§38), `teamSize` (§22).
- **Gathered via:** Assessment `personality.leadership` (rating, 1-5).

### 10. Creativity — `creativity`

- **Description:** How often the person defaults to a novel approach
  over a proven one.
- **Purpose:** Compared against `matchingMetadata.creativityLevel` (§38)
  and, loosely, a business's `aiUsage`/`recommendedTools` emphasis on
  novel workflows (§32-33).
- **Scale:** A single 1-5 rating, normalized to 0-1.
- **Interpretation:** This is also one of the seven "DNA Profile" card
  values on the results page (`dna-profile-cards.tsx`) — see "Existing
  archetype vocabularies" below for how that display concept relates to
  (and doesn't automatically equal) this scoring dimension.
- **Relationships:** Business DNA `matchingMetadata.creativityLevel`
  (§38).
- **Gathered via:** Assessment `personality.creativity` (rating, 1-5).

### 11. Technical Ability — `technicalAbility`

- **Description:** Comfort working directly with technical tools and
  systems — narrower than the general `skills` dimension, isolating two
  of its ten sub-ratings.
- **Purpose:** Compared against `matchingMetadata.technicalLevel` (§38)
  — relevant to SaaS/tech-industry genomes with high technical
  requirements.
- **Scale:** Derived from two 1-5 ratings (`skills.programming`,
  `skills.ai`), not a dedicated question of its own; reduced to 0-1.
- **Interpretation:** Overlaps `skills` by construction (it's a subset of
  the same ten ratings) — whether `technicalAbility` is meant to be a
  strict subset or an independently-weighted view of the same signals is
  a scoring decision, not specified here.
- **Relationships:** Business DNA `matchingMetadata.technicalLevel`
  (§38), `aiUsage.aiDependencyLevel` (§32).
- **Gathered via:** Assessment `skills.programming` and `skills.ai`
  (ratings, 1-5) — a combined signal, not a single question.

### 12. Sales Orientation — `salesOrientation`

- **Description:** Energy and aptitude for pitching, negotiating, and
  closing.
- **Purpose:** Compared against `matchingMetadata.salesAffinity` (§38).
- **Scale:** Derived from `skills.sales` (rating) and
  `personality.sellingPreference` (rating) — two questions, not one.
- **Interpretation:** This is also one of the seven "DNA Profile" values
  (`seller`) on the results page — again, see "Existing archetype
  vocabularies" for the distinction between a display archetype and this
  scoring dimension.
- **Relationships:** Business DNA `matchingMetadata.salesAffinity` (§38),
  `salesStrategy.approach` (§27).
- **Gathered via:** Assessment `skills.sales` and
  `personality.sellingPreference` (both ratings, 1-5).

### 13. Location — `location`

- **Description:** Where the person is, and how location-independent
  they need their business to be.
- **Purpose:** Compared against Business DNA's `locationDependency`
  (§20) and `lifestyle.remote`/`.travel` on the business side.
- **Scale:** Composite of a free-text country (`aboutYou.country`) and
  the categorical `lifestyle.remote`/`.travel` answers — the free-text
  part in particular has no defined normalization today.
- **Interpretation:** `aboutYou.country` is currently unstructured
  (`short_text`, max 3 chars — apparently intended as a country code,
  though nothing enforces that), which limits how precisely this
  dimension can be compared against `locationDependency`'s `local` /
  `regional` / `global` levels until that field is tightened or replaced.
- **Relationships:** Business DNA `locationDependency` (§20),
  `lifestyle.workMode`/`.travelRequirement` (§21).
- **Gathered via:** Assessment `aboutYou.country` (short text) plus
  `lifestyle.remote`/`.travel` (single choice) — a composite, honestly
  including a currently-unstructured free-text field.

### 14. Work Style — `workStyle`

- **Description:** Structure-vs-flexibility preference in how the person
  likes to operate day to day.
- **Purpose:** The closest single-question dimension to a general
  "operating style" fit signal, distinct from the specific lifestyle
  logistics (`lifestyle` dimension) and skill/trait dimensions above.
- **Scale:** A single 0-100% slider (`structureVsFlexibility`), normalized
  to 0-1.
- **Interpretation:** Also the name of one of the eight "Work Style"
  cards on the results page (`work-style-cards.tsx`) alongside
  `automationAffinity`/`businessExperience`/`timeAvailability` — those
  three are results-page-local display concepts (see
  `assessment/components/results/config.ts`), not additional
  `MatchingDimension` values; do not confuse the eight-card results
  display with the fourteen-value `MatchingDimension` enum this document
  specifies.
- **Relationships:** Business DNA `teamSize` (§22, team-size preference is
  a related but separate signal, currently under `lifestyle.employees`
  at the Assessment layer), `operations.dailyWorkflow` (§28).
- **Gathered via:** Assessment `personality.structureVsFlexibility`
  (slider, 0-100%). `lifestyle.employees` is a related but distinct
  signal (team-size preference) not folded into this dimension today.

---

## Existing archetype vocabularies (partially reconciled)

Three separate "archetype" vocabularies exist in this codebase today,
from three different sprints, for three different purposes. **A later
"Architecture Reconciliation" sprint resolved the relationship between
two of the three:** the Primary/Overarching Archetype (5-key) is now
documented as a **derived** classification computed from the DNA
Profile (7-key) dimension scores below, via a not-yet-implemented
`deriveOverarchingArchetype()` (`assessment/components/results/derive-overarching-archetype.ts`)
— see `features/business-dna/README.md`'s "Existing archetype
vocabularies" section for the current, authoritative state. It is
**still true** that no vocabulary here is consumed by the Matching
Engine yet, and the Founder Archetype (6-key, business-library, legacy)
remains genuinely separate — superseded by the 7-key DNA Profile model
for new work, retained only for migrating the one existing legacy
business. This section is not rewritten below to describe the sprint
where the derivation relationship was decided (that sprint postdates
this document) — treat `features/business-dna/README.md` as the
up-to-date source for the resolved parts, and the table below as
historical context for why three vocabularies exist at all.

| Vocabulary | Values | Defined in | Used for |
|---|---|---|---|
| **DNA Profile** (7-key) | `builder`, `visionary`, `operator`, `creator`, `seller`, `leader`, `analyst` | `assessment/components/results/config.ts` → `DnaArchetypeKey` | The 7 results-page cards (`dna-profile-cards.tsx`) showing a *spread* across founder traits, each 0-100. Purely a results-display concept — placeholder-scored, not fed by real Assessment data yet. |
| **Primary / Overarching Archetype** (5-key) | `systemsBuilder`, `visionaryOperator`, `creativeStrategist`, `growthArchitect`, `executionSpecialist` | `assessment/components/results/config.ts` → `OverarchingArchetypeKey` | The single headline label on the results page (`primary-archetype-card.tsx`) — one overarching persona, deliberately distinct from the 7-key list above (see that file's own docstring). Also a results-display concept, also placeholder-scored. |
| **Founder Archetype** (6-key) | `theBuilder`, `theConnector`, `theOperator`, `theVisionary`, `theSpecialist`, `theHustler` | `business-library/schema.ts` → `founderArchetypeSchema` | Which founder archetype(s) a **Business Genome** (not a person) ideally fits — `founderProfile.idealArchetypes` (Document 3 §6) and `matchingMetadata.idealFounderArchetypes` (§38). This is the only one of the three actually wired to the Business DNA side of a future match. |

Three overlapping-but-distinct naming schemes for "founder type" is
exactly the kind of drift this canon exists to catch early. Resolving it
— e.g. deciding whether the Matching Engine will eventually score a
person into one of these vocabularies, a new unified one, or none at all
(scoring only on the fourteen dimensions and leaving "archetype" purely a
presentation-layer summary) — is a deliberate future decision, not
something this document, or any single sprint, should resolve
unilaterally.
