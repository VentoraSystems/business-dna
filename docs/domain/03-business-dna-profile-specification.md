# Business DNA Profile Specification

**Companion documents:** [01 — Canon](./01-businessdna-canon.md) ·
[02 — Entrepreneur DNA Specification](./02-entrepreneur-dna-specification.md) ·
[04 — Knowledge Graph Specification](./04-knowledge-graph-specification.md).
**Source of truth in code:**
[`business-library/schema.ts`](../../business-library/schema.ts) (the
`businessGenomeSchema` Zod schema — this document follows its own
section numbering exactly). See
[`business-library/README.md`](../../business-library/README.md) for the
full explanation of what a Business Genome is, how it's authored, and how
every other feature in the platform consumes it — this document does not
repeat that; it specifies each of the schema's 38 sections individually.

A **Business DNA** (a "Business Genome," in the code's own terminology)
is one structured document describing one business concept —
`ai-automation-agency` today, more in the future. This document is a
specification of the *shape* every section takes, not a description of
that one example. All illustrative fragments below are **invented and
schematic**, clearly marked `(Illustrative)` — none is lifted from
`business-library/examples/ai-automation-agency.ts`.

Every `LocalizedText` field mentioned below is `{ en: string, ro: string }`
(`localizedTextSchema`) — inline bilingual content, not a
`translationKey` (see Document 1's "A nuance worth stating precisely" for
why the Genome Library uses this pattern specifically). A "three-level"
field below means the shared `{ level: "low"|"moderate"|"high", notes?: LocalizedText }`
shape (`levelDimensionSchema`) unless another level set is noted.

---

### 1. Identity — `identity`

- **Purpose:** Uniquely and stably identifies this genome document,
  independent of any database it's later ingested into.
- **Type:** Object — `{ id: uuid, slug, version: semver string, name: LocalizedText, tagline: LocalizedText, createdAt/updatedAt: ISO datetime, status: "draft"|"in_review"|"published"|"archived" }`.
- **Description:** `id` is this document's own stable identifier
  (distinct from any future `BusinessType.id` row); `slug` is what a
  future Business Engine ingestion step should match against
  `BusinessType.slug`; `version` tracks edits to *this specific* genome,
  separately from `schemaVersion` on the document as a whole (which
  tracks the standard itself).
- **Relationships:** `slug` is the join key every other future consumer
  (Business Engine catalog, Knowledge Graph — Document 4) would use to
  reference this genome.
- **Example (Illustrative):** `{ slug: "example-co", version: "1.0.0", name: { en: "Example Co.", ro: "Example Co." }, status: "draft" }`.

### 2. Description — `description`

- **Purpose:** The human-readable summary used in catalog/list views,
  detail pages, and as grounding context for future generators.
- **Type:** Object — `{ short: LocalizedText, long: LocalizedText, idealFor: LocalizedText }`.
- **Description:** `short` is one to two sentences for list views; `long`
  is the full narrative for a detail page; `idealFor` names who this
  business fits, feeding both the detail page and — per
  `business-library/README.md` — future Matching Engine explanations.
- **Relationships:** `idealFor` conceptually overlaps `founderProfile.summary`
  (§6) and `matchingMetadata` (§38) — three different places a genome
  currently expresses "who this is for," at different levels of
  structure (free prose here, a closed archetype list in §6, and
  comparable structured fields in §38).
- **Example (Illustrative):** `short: { en: "A subscription box curating regional artisan goods.", ro: "..." }`.

### 3. Industry — `industry`

- **Purpose:** Categorizes the business by industry for filtering,
  matching, and Knowledge Graph traversal.
- **Type:** Object — `{ primary: industryTypeSchema, secondary: industryTypeSchema[] (default []) }`.
- **Description:** `primary` is one of the ten platform industries
  (`health`, `tech`, `food`, `education`, `fashion`, `finance`, `travel`,
  `sustainability`, `entertainment`, `homeServices`); `secondary` allows
  cross-listing.
- **Relationships:** Compared directly against Entrepreneur DNA's
  `industryPreference` dimension (Document 2 §6); the same ten-value
  vocabulary as the Knowledge Engine's `Industries` domain (Document 4).
- **Example (Illustrative):** `{ primary: "food", secondary: ["sustainability"] }`.

### 4. Category — `category`

- **Purpose:** A finer-grained grouping than `industry`, for catalog
  browsing (e.g. "subscription boxes" within `food`).
- **Type:** Object — `{ slug, name: LocalizedText }`.
- **Description:** Freeform relative to `industry` — not drawn from a
  closed enum today, unlike `industry`/`businessModel`.
- **Relationships:** Scoped under `industry` conceptually, though the
  schema doesn't enforce that nesting structurally.
- **Example (Illustrative):** `{ slug: "artisan-subscription-boxes", name: { en: "Artisan Subscription Boxes", ro: "..." } }`.

### 5. Business Model — `businessModel`

- **Purpose:** Categorizes the revenue/operating model for filtering,
  matching, and Knowledge Graph traversal.
- **Type:** Object — `{ primary: businessModelTypeSchema, secondary: businessModelTypeSchema[] (default []), revenueModelSummary?: LocalizedText }`.
- **Description:** `primary` is one of the eight platform business models
  (`ecommerce`, `saas`, `service`, `marketplace`, `content`,
  `physicalProduct`, `subscription`, `agency`); `revenueModelSummary` is
  a short prose gloss, e.g. "monthly retainer plus onboarding fee."
- **Relationships:** Compared directly against Entrepreneur DNA's
  `businessModelPreference` (Document 2 §7); shares vocabulary with the
  Knowledge Engine's `BusinessModels` domain (Document 4).
- **Example (Illustrative):** `{ primary: "subscription", revenueModelSummary: { en: "Monthly box, annual plan discounted 15%.", ro: "..." } }`.

### 6. Founder Profile — `founderProfile`

- **Purpose:** Describes which kind(s) of founder this business is
  intended to fit, in prose and via the closed `founderArchetypeSchema`.
- **Type:** Object — `{ idealArchetypes: founderArchetypeSchema[] (min 1), summary: LocalizedText, minimumExperienceYears?: non-negative int }`.
- **Description:** `idealArchetypes` draws from the six-value
  `founderArchetypeSchema` (`theBuilder`, `theConnector`, `theOperator`,
  `theVisionary`, `theSpecialist`, `theHustler`) — see Document 2's
  "Existing archetype vocabularies" for how this relates (and doesn't
  automatically map) to the results page's two other archetype
  vocabularies.
- **Relationships:** The only one of the three archetype vocabularies
  actually attached to Business DNA; also echoed (optionally) in
  `matchingMetadata.idealFounderArchetypes` (§38).
- **Example (Illustrative):** `{ idealArchetypes: ["theOperator", "theSpecialist"], summary: { en: "Fits someone who enjoys logistics and curation more than building a brand from scratch.", ro: "..." } }`.

### 7. Required Skills — `requiredSkills`

- **Purpose:** Names which skills matter for this business and how much.
- **Type:** Array (min 1) of `{ key: skillKeySchema, importance: 1-5 rating }`.
- **Description:** `key` is one of the ten skill keys shared with the
  Assessment's `skills` section and the Knowledge Engine's `Skills`
  domain; `importance` is a 1-5 rating, the same scale the Assessment
  uses for its own rating questions.
- **Relationships:** Compared directly against Entrepreneur DNA's
  `skills` dimension (Document 2 §1); duplicated (for required *and*
  preferred) inside `matchingMetadata.requiredSkills`/`.preferredSkills`
  (§38) — see that section for why the same concept appears twice in one
  genome.
- **Example (Illustrative):** `[{ key: "management", importance: 4 }, { key: "negotiation", importance: 3 }]`.

### 8. Required Personality — `requiredPersonality`

- **Purpose:** Names which personality traits matter for this business
  and how much, parallel to §7 for skills.
- **Type:** Array (min 1) of `{ trait: personalityTraitSchema, importance: 1-5 rating }`.
- **Description:** `trait` draws from a twelve-value closed vocabulary
  (`strategic`, `persistent`, `systemOriented`, `growthMindset`,
  `creative`, `analytical`, `collaborative`, `decisive`, `resilient`,
  `detailOriented`, `patient`, `riskTolerant`) — a vocabulary with no
  direct Entrepreneur DNA dimension equivalent (Document 2's fourteen
  dimensions are coarser than these twelve traits).
- **Relationships:** Loosely comparable to several Entrepreneur DNA
  dimensions at once (e.g. `riskTolerant` ~ `risk`, `creative` ~
  `creativity`) but not a 1:1 mapping — another honest gap worth noting
  alongside Document 2's dimension list.
- **Example (Illustrative):** `[{ trait: "detailOriented", importance: 5 }, { trait: "patient", importance: 4 }]`.

### 9. Difficulty — `difficulty`

- **Purpose:** How hard this business is to start and run, at a glance.
- **Type:** Three-level (`low`/`moderate`/`high`) + optional notes.
- **Description:** A single top-line difficulty rating, distinct from the
  more granular complexity fields (§16-18) and `learningCurve` (§19),
  which break "difficulty" down by concern.
- **Relationships:** Compared against Entrepreneur DNA's `risk` dimension
  (Document 2 §4) at match time.
- **Example (Illustrative):** `{ level: "moderate", notes: { en: "Mostly logistics complexity, not technical.", ro: "..." } }`.

### 10. Budget — `budget`

- **Purpose:** The capital required to start, and the ongoing monthly
  cost floor/ceiling.
- **Type:** Object — `{ minInvestment, maxInvestment: non-negative int, currency: 3-letter code (default "EUR"), ongoingMonthlyCostMin/Max?: non-negative int, notes?: LocalizedText }`, with a schema-level refinement that `maxInvestment >= minInvestment`.
- **Description:** The one section with an explicit cross-field
  validation rule in `schema.ts` — a genome cannot declare an inverted
  budget range and still validate.
- **Relationships:** Compared directly against Entrepreneur DNA's
  `budget` dimension (Document 2 §2); overlaps `financialInformation.startupCosts`
  (§24), which itemizes what this range is actually made of.
- **Example (Illustrative):** `{ minInvestment: 2000, maxInvestment: 8000, currency: "EUR" }`.

### 11. Revenue Speed — `revenueSpeed`

- **Purpose:** How quickly the business typically starts generating
  revenue after launch.
- **Type:** Three-level, but over `slow`/`moderate`/`fast` (not
  `low`/`moderate`/`high`).
- **Description:** Distinct from `financialInformation.breakEvenTimelineMonths`
  (§24, a specific month count) — this is a coarser, top-line signal.
- **Relationships:** Compared against Entrepreneur DNA's `timeline`
  dimension (Document 2 §5).
- **Example (Illustrative):** `{ level: "moderate" }`.

### 12. Profit Margin — `profitMargin`

- **Purpose:** How much of revenue typically remains as profit for this
  business type.
- **Type:** Three-level (`low`/`moderate`/`high`).
- **Description:** A qualitative signal, not a computed percentage —
  `financialInformation` (§24) is where actual cost/revenue figures live.
- **Relationships:** Informs (but doesn't replace) a future Financial
  Forecast generator's assumptions — see `business-library/README.md`'s
  "Financial Generator" row.
- **Example (Illustrative):** `{ level: "high", notes: { en: "Low COGS once initial curation relationships are established.", ro: "..." } }`.

### 13. Scalability — `scalability`

- **Purpose:** How much this business can grow without proportionally
  scaling effort/cost.
- **Type:** Three-level (`low`/`moderate`/`high`).
- **Description:** Distinct from `growthPotential` (§23), which is about
  ceiling and timeline, not the mechanism of scaling itself
  (`scaling`, §29, describes that mechanism in prose).
- **Relationships:** `scaling.path`/`.bottlenecks`/`.milestones` (§29)
  is where this rating is explained in detail.
- **Example (Illustrative):** `{ level: "moderate", notes: { en: "Scales with supplier relationships, not headcount, up to a point.", ro: "..." } }`.

### 14. Automation — `automation`

- **Purpose:** How much of the business's operations can run without
  manual, ongoing human effort.
- **Type:** Three-level (`low`/`moderate`/`high`).
- **Description:** Distinct from `aiUsage` (§32), which is specifically
  about *AI-driven* automation — this field is broader (includes
  non-AI automation, e.g. scheduled fulfillment).
- **Relationships:** `operations.coreProcesses`/`.fulfillmentModel`
  (§28) is where the specific processes behind this rating live.
- **Example (Illustrative):** `{ level: "moderate" }`.

### 15. AI Resistance — `aiResistance`

- **Purpose:** How resistant this business's core value is to being
  displaced by general-purpose AI tools.
- **Type:** Three-level (`low`/`moderate`/`high`).
- **Description:** A forward-looking durability signal — a high value
  means the business's moat doesn't erode as AI tools become more
  capable/accessible; a low value flags real disruption risk.
- **Relationships:** Directly informs a `risks[]` entry (§30) when the
  risk is specifically AI-driven displacement — the two fields are
  meant to be read together, not duplicated.
- **Example (Illustrative):** `{ level: "moderate", notes: { en: "Curation and relationships are harder to automate than the logistics layer.", ro: "..." } }`.

### 16. Legal Complexity — `legalComplexity`

- **Purpose:** How much legal/regulatory overhead this business type
  typically involves (licensing, compliance, contracts).
- **Type:** Three-level (`low`/`moderate`/`high`).
- **Relationships:** A future Knowledge Engine `LegalStructures` entry
  (Document 4) would give the specific structures this complexity
  implies; this field stays qualitative.
- **Example (Illustrative):** `{ level: "low" }`.

### 17. Marketing Complexity — `marketingComplexity`

- **Purpose:** How much marketing sophistication this business type
  typically requires to reach customers.
- **Type:** Three-level (`low`/`moderate`/`high`).
- **Relationships:** `marketingStrategy` (§26) is where the specific
  channels and positioning behind this rating live.
- **Example (Illustrative):** `{ level: "moderate" }`.

### 18. Sales Complexity — `salesComplexity`

- **Purpose:** How much of a sales motion (vs. self-serve) this business
  type typically requires.
- **Type:** Three-level (`low`/`moderate`/`high`).
- **Relationships:** `salesStrategy` (§27) is where the specific approach
  behind this rating lives; compared against Entrepreneur DNA's
  `salesOrientation` (Document 2 §12).
- **Example (Illustrative):** `{ level: "low", notes: { en: "Mostly self-serve subscription checkout.", ro: "..." } }`.

### 19. Learning Curve — `learningCurve`

- **Purpose:** How long it typically takes a new founder to become
  competent at running this specific business type.
- **Type:** Three-level (`low`/`moderate`/`high`).
- **Description:** Distinct from `difficulty` (§9) — a business can be
  operationally simple day-to-day (low difficulty) but still have a
  steep initial learning curve, or the reverse.
- **Example (Illustrative):** `{ level: "moderate" }`.

### 20. Location Dependency — `locationDependency`

- **Purpose:** How tied to a physical location this business is.
- **Type:** Four-level — `none`/`local`/`regional`/`global` (a different
  level set from the `low`/`moderate`/`high` fields above).
- **Relationships:** Compared against Entrepreneur DNA's `location`
  dimension (Document 2 §13); overlaps `lifestyle.workMode` (§21).
- **Example (Illustrative):** `{ level: "global", notes: { en: "Fulfillment requires a domestic warehouse; everything else is location-independent.", ro: "..." } }`.

### 21. Lifestyle — `lifestyle`

- **Purpose:** Describes the day-to-day working conditions this business
  implies, mirroring the Assessment's own `lifestyle` questions from the
  business's side.
- **Type:** Object — `{ workMode: "remote"|"hybrid"|"inPerson", travelRequirement: "none"|"occasional"|"frequent", onlineOffline: "online"|"offline"|"hybrid", salesChannel: "b2b"|"b2c"|"both", minWeeklyHours?/maxWeeklyHours?: non-negative int, freedomLevel?: 1-5 rating, notes?: LocalizedText }`.
- **Description:** `salesChannel` here is business-engine's `b2b`/`b2c`/`both`
  concept — do not confuse with the Knowledge Engine's `SalesMethods`
  domain (Document 4), which is about *how* a sale happens, not *who* to.
- **Relationships:** Compared directly against Entrepreneur DNA's
  `lifestyle` dimension (Document 2 §3).
- **Example (Illustrative):** `{ workMode: "remote", travelRequirement: "none", onlineOffline: "online", salesChannel: "b2c" }`.

### 22. Team Size — `teamSize`

- **Purpose:** How many people this business typically involves, at
  launch and at scale.
- **Type:** Object — `{ atLaunch: "solo"|"small"|"large", atScale?: same, notes?: LocalizedText }`.
- **Relationships:** Compared against Entrepreneur DNA's `workStyle`
  dimension (Document 2 §14, loosely) and `leadership` (§9, more
  strongly for `"large"` values).
- **Example (Illustrative):** `{ atLaunch: "solo", atScale: "small" }`.

### 23. Growth Potential — `growthPotential`

- **Purpose:** The ceiling on how big this business could realistically
  become, and over what time horizon.
- **Type:** Object — `{ level: "low"|"moderate"|"high", ceilingNotes?: LocalizedText, timeHorizonMonths?: non-negative int }`.
- **Description:** Distinct from `scalability` (§13), which is about the
  *mechanism* of growth, not the eventual ceiling.
- **Relationships:** Compared against Entrepreneur DNA's `timeline`
  dimension (Document 2 §5) for `timeHorizonMonths` specifically.
- **Example (Illustrative):** `{ level: "moderate", timeHorizonMonths: 36 }`.

### 24. Financial Information — `financialInformation`

- **Purpose:** The concrete cost/revenue assumptions a financial model
  should start from.
- **Type:** Object — `{ startupCosts: {key, label, typicalMin?, typicalMax?}[] (default []), recurringCosts: {key, label, typicalMonthlyMin?, typicalMonthlyMax?}[] (default []), revenueStreams: {key, label}[] (default []), targetMonthlyIncomeMin?/Max?: non-negative int, breakEvenTimelineMonths?: non-negative int, currency: 3-letter (default "EUR") }`.
- **Description:** The most itemized section in a genome — three
  separate line-item arrays plus target-income and break-even figures.
- **Relationships:** `startupCosts` should be consistent with `budget`
  (§10); `breakEvenTimelineMonths` should be consistent with
  `revenueSpeed` (§11) — the schema does not cross-validate this
  consistency today, so it is an authoring discipline, not an enforced
  rule.
- **Example (Illustrative):** `startupCosts: [{ key: "packaging", label: { en: "Initial packaging run", ro: "..." }, typicalMin: 500, typicalMax: 1500 }]`.

### 25. Customer Profile — `customerProfile`

- **Purpose:** Who this business actually sells to, and why they buy.
- **Type:** Object — `{ description: LocalizedText, segments/painPoints/buyingTriggers: LocalizedText[] (each default []) }`.
- **Relationships:** Feeds `marketingStrategy.positioning` (§26, per
  `business-library/README.md`'s "Branding Generator" row) and
  `salesStrategy.approach` (§27).
- **Example (Illustrative):** `{ description: { en: "Households who already buy from farmers' markets but want convenience.", ro: "..." }, painPoints: [{ en: "Market hours don't fit a work schedule.", ro: "..." }] }`.

### 26. Marketing Strategy — `marketingStrategy`

- **Purpose:** How this business typically gets found and chosen.
- **Type:** Object — `{ positioning: LocalizedText, channels: {channelType: freeform string, description: LocalizedText, priority: "primary"|"secondary"|"experimental"}[] (min 1) }`.
- **Description:** `channelType` is intentionally freeform today (see
  the inline comment in `schema.ts`: "a future candidate for its own
  enum") — a future Knowledge Engine `MarketingChannels` entry
  (Document 4) is exactly the closed vocabulary this field is expected
  to eventually be validated against.
- **Relationships:** Informed by `customerProfile` (§25); compared
  loosely against Entrepreneur DNA's `communicationStyle` dimension
  (Document 2 §8) for channel-fit reasoning, once that dimension has a
  real source question.
- **Example (Illustrative):** `channels: [{ channelType: "farmersMarketPartnerships", description: { en: "Co-marketing with partner markets.", ro: "..." }, priority: "primary" }]`.

### 27. Sales Strategy — `salesStrategy`

- **Purpose:** How this business typically converts interest into a
  paying customer.
- **Type:** Object — `{ approach: LocalizedText, salesCycleLengthDays?: non-negative int, pricingModel?: LocalizedText }`.
- **Relationships:** Compared against Entrepreneur DNA's `salesOrientation`
  dimension (Document 2 §12); `pricingModel` (freeform prose today) is a
  candidate for a future Knowledge Engine `PricingModels` cross-reference
  (Document 4).
- **Example (Illustrative):** `{ approach: { en: "Self-serve checkout; no sales calls.", ro: "..." }, salesCycleLengthDays: 0 }`.

### 28. Operations — `operations`

- **Purpose:** The day-to-day mechanics of actually running the
  business.
- **Type:** Object — `{ coreProcesses: LocalizedText[] (default []), dailyWorkflow?: LocalizedText, fulfillmentModel?: LocalizedText }`.
- **Relationships:** Grounds `automation` (§14) and `scalability` (§13)
  in specifics; a future AI Co-Founder feature reads this directly for
  "what does running this look like" grounding
  (`business-library/README.md`'s "AI Co-Founder" row).
- **Example (Illustrative):** `{ coreProcesses: [{ en: "Weekly sourcing calls with 3-4 rotating artisan partners.", ro: "..." }] }`.

### 29. Scaling — `scaling`

- **Purpose:** The path this business follows as it grows, and what
  typically blocks that growth.
- **Type:** Object — `{ path: LocalizedText, bottlenecks: LocalizedText[] (default []), milestones: {monthsFromLaunch: non-negative int, description: LocalizedText}[] (default []) }`.
- **Relationships:** Explains `scalability`'s (§13) rating in prose;
  `bottlenecks` is what a future Roadmap Generator should "proactively
  address rather than let a founder discover the hard way"
  (`business-library/README.md`).
- **Example (Illustrative):** `{ path: { en: "Add SKUs before adding regions.", ro: "..." }, bottlenecks: [{ en: "Sourcing relationships don't scale linearly with order volume.", ro: "..." }] }`.

### 30. Risks — `risks`

- **Purpose:** Specific, named risks a founder should know about before
  starting.
- **Type:** Array (default []) of `{ description: LocalizedText, severity: "low"|"moderate"|"high", mitigation?: LocalizedText }`.
- **Relationships:** Individually more specific than the top-line
  `difficulty` (§9) or `aiResistance` (§15) ratings — those are the
  summary; this is the itemized detail. A future Explanation Engine
  `ContextualExplainer.explainRisk()` (see `explanation-engine/README.md`)
  is the eventual consumer that compares these items against a person's
  `risk` dimension (Document 2 §4).
- **Example (Illustrative):** `[{ description: { en: "Dependent on 3-4 supplier relationships with no long-term contracts.", ro: "..." }, severity: "moderate", mitigation: { en: "Formalize 12-month supply agreements once volume justifies it.", ro: "..." } }]`.

### 31. Advantages — `advantages`

- **Purpose:** Specific, named strengths of this business type — the
  positive counterpart to §30.
- **Type:** Array (default []) of `{ description: LocalizedText }`.
- **Description:** Deliberately simpler than `risks[]` — no severity or
  mitigation field, since an advantage doesn't need to be "managed" the
  way a risk does.
- **Example (Illustrative):** `[{ description: { en: "Recurring revenue from day one via subscription billing.", ro: "..." } }]`.

### 32. AI Usage — `aiUsage`

- **Purpose:** How (if at all) AI is actually used in running this
  business — distinct from `aiResistance` (§15), which is about the
  business's durability *against* AI disruption, not its own use of AI.
- **Type:** Object — `{ useCases: {area: freeform string, description: LocalizedText, maturity: "emerging"|"established"|"coreToModel"}[] (default []), aiDependencyLevel: "low"|"moderate"|"high" }`.
- **Relationships:** Compared against Entrepreneur DNA's
  `technicalAbility` dimension (Document 2 §11) for AI-heavy genomes; a
  future Knowledge Engine `AITools` entry (Document 4) would be what a
  specific tool named in `recommendedTools` (§33) resolves to.
- **Example (Illustrative):** `{ useCases: [{ area: "customerSupport", description: { en: "AI drafts responses to shipping inquiries for human review.", ro: "..." }, maturity: "established" }], aiDependencyLevel: "low" }`.

### 33. Recommended Tools — `recommendedTools`

- **Purpose:** Named software/tools a founder running this business
  would typically use.
- **Type:** Array (default []) of `{ name: string, category: freeform string, isRequired: boolean (default true), websiteUrl?: url }`.
- **Description:** `category` is freeform prose today, not a closed
  enum — a future Knowledge Engine `BusinessTools`/`AITools` domain
  (Document 4) is the eventual home for each named tool as its own
  entry, with this field's `category` becoming a cross-reference rather
  than a free string.
- **Example (Illustrative):** `[{ name: "Shopify", category: "ecommercePlatform", isRequired: true, websiteUrl: "https://www.shopify.com" }]`.

### 34. KPIs — `kpis`

- **Purpose:** The specific metrics that define "on track" for this
  business type.
- **Type:** Array (min 1) of `{ key: string, label: LocalizedText, targetDescription?: LocalizedText }`.
- **Relationships:** A future Knowledge Engine `KPIs` domain (Document 4)
  is where a standardized `key` vocabulary (e.g. `mrr`, `churnRate`)
  would eventually live, resolving each genome's `kpis[].key` into a
  shared definition instead of a genome-local string; a future "Business
  Review" feature compares a user's real numbers against these targets
  (`business-library/README.md`).
- **Example (Illustrative):** `[{ key: "activeSubscribers", label: { en: "Active subscribers", ro: "..." }, targetDescription: { en: "150-300 active subscribers by month 12.", ro: "..." } }]`.

### 35. 90-Day Plan — `ninetyDayPlan`

- **Purpose:** A week-by-week launch plan for the first 90 days.
- **Type:** Object — `{ theme?: LocalizedText, tasks: {week: 1-13, title: LocalizedText, description?: LocalizedText}[] (min 1) }`.
- **Relationships:** The primary source a future Roadmap Generator reads
  for the first 90 days, handing off to `scaling.milestones` (§29) for
  the months beyond (`business-library/README.md`).
- **Example (Illustrative):** `{ tasks: [{ week: 1, title: { en: "Finalize 3 artisan supplier agreements.", ro: "..." } }] }`.

### 36. Exit Potential — `exitPotential`

- **Purpose:** Whether/how this business could realistically be sold or
  wound down.
- **Type:** Object — `{ viable: boolean, typicalPaths: enum[] (values: "acquisition"|"acquihire"|"managementBuyout"|"privateEquity"|"ipo"|"shutdown", default []), notes?: LocalizedText }`.
- **Description:** The only section whose top-level field is a plain
  boolean (`viable`) rather than an object with a `level`.
- **Example (Illustrative):** `{ viable: true, typicalPaths: ["acquisition"] }`.

### 37. Blueprint Structure — `blueprintStructure`

- **Purpose:** Which sections a generated Business Blueprint document
  should contain, and in what order, for this specific business.
- **Type:** Object — `{ sections: string[] (min 1, ordered keys, e.g. "executiveSummary"), promptContext?: LocalizedText }`.
- **Description:** Mirrors `BusinessBlueprintTemplate` in the Business
  Engine (`src/features/business-engine/schemas/templates.ts`) — this
  is the section this genome should populate once ingested into that
  table.
- **Relationships:** `promptContext` is "a direct hint to that generator
  about tone or emphasis for this particular business"
  (`business-library/README.md`).
- **Example (Illustrative):** `{ sections: ["executiveSummary", "marketAnalysis", "operationsPlan"], promptContext: { en: "Emphasize the curation/relationships angle over the logistics angle.", ro: "..." } }`.

### 38. Matching Metadata — `matchingMetadata`

- **Purpose:** The bridge to the Matching Engine — what this business
  looks for in a founder, expressed in exactly the vocabulary
  Entrepreneur DNA uses, so a future `ScoreCalculator` can compare the
  two directly. Every field here relates to a Document 2 dimension.
- **Type:** A fully `.partial()` object — every field optional, since "a
  genome that skips it gives the eventual matching engine nothing to
  compare a user against" but the schema doesn't force population
  (`business-library/README.md`). Fields: `requiredSkills`/`preferredSkills`
  (arrays of `{key: skillKeySchema, importance}`, same shape as §7),
  `requiredPersonality`/`preferredPersonality` (same shape as §8),
  `requiredBudget`/`preferredBudget` (`{min, max, currency}`),
  `riskProfile` (three-level), `timeAvailability` (`{minWeeklyHours, maxWeeklyHours?}`),
  `communicationStyle` (freeform `string[]` tags), `technicalLevel`/
  `leadershipLevel`/`creativityLevel`/`salesAffinity`/`automationAffinity`
  (each a 1-5 rating), `remotePreference`/`travelPreference` (four-value
  enums including `"noPreference"`), `idealFounderArchetypes` (array,
  same vocabulary as §6).
- **Description:** This section duplicates the *concept* of §7
  (`requiredSkills`) and §8 (`requiredPersonality`) — the difference is
  that §7/§8 describe the business in isolation (documentation-facing),
  while this section's copies are specifically the ones a future
  `ScoreCalculator` reads (matching-facing), split into required vs.
  preferred tiers §7/§8 don't have. Whether these should eventually be
  unified into one section is an open question this document flags, not
  resolves.
- **Relationships:** This is the one section where every Document 2
  dimension has (or is clearly meant to have) a direct counterpart:
  `requiredSkills`/`preferredSkills` ↔ `skills`; `requiredBudget`/`preferredBudget`
  ↔ `budget`; `riskProfile` ↔ `risk`; `timeAvailability` ↔ (loosely)
  `timeline`/`workStyle`; `communicationStyle` ↔ `communicationStyle`
  (the one dimension with no source Assessment question yet — see
  Document 2 §8); `technicalLevel` ↔ `technicalAbility`; `leadershipLevel`
  ↔ `leadership`; `creativityLevel` ↔ `creativity`; `salesAffinity` ↔
  `salesOrientation`; `automationAffinity` ↔ (results-page-only, not a
  `MatchingDimension` — see Document 2 §14's note); `remotePreference`/
  `travelPreference` ↔ `lifestyle`/`location`; `idealFounderArchetypes`
  ↔ Document 2's "Existing archetype vocabularies" section. None of
  this comparison is implemented — `matching-engine/README.md` is
  explicit that "no matching logic reads this yet."
- **Example (Illustrative):** `{ requiredBudget: { min: 2000, max: 8000, currency: "EUR" }, riskProfile: "low", timeAvailability: { minWeeklyHours: 15 } }`.
