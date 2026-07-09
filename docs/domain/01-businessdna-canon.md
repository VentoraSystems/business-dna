# BusinessDNA Canon

**Status:** living document. **Scope:** vision, philosophy, and the
non-negotiable rules that should constrain every future feature —
including the ones already partially built. **Companion documents:**
[02 — Entrepreneur DNA Specification](./02-entrepreneur-dna-specification.md),
[03 — Business DNA Profile Specification](./03-business-dna-profile-specification.md),
[04 — Knowledge Graph Specification](./04-knowledge-graph-specification.md).

This document is grounded in what BusinessDNA actually is today: an
Assessment that gathers a structured profile of a person
([Entrepreneur DNA](./02-entrepreneur-dna-specification.md)), a library of
structured business concepts
([Business DNA / the Business Genome Library](./03-business-dna-profile-specification.md)),
a still-unimplemented Matching Engine framework meant to compare the two,
an Explanation Engine framework meant to turn a comparison into structured
reasons, a Knowledge Engine framework meant to hold the reference
vocabulary all of the above draw on
([04](./04-knowledge-graph-specification.md)), and a results experience
(the "Entrepreneur DNA Results" screen) that is the one place all of this
is currently user-facing. Nothing here is aspirational boilerplate; every
principle below traces to a decision already made in the codebase.

## Vision

A person should be able to discover which businesses genuinely fit *them*
— not a generic "best businesses to start" list, but a match grounded in
their actual skills, risk tolerance, budget, lifestyle constraints, and
temperament, explained clearly enough that they trust the reasoning, not
just the score.

## Mission

Turn "I don't know what business to start" into a structured, explainable,
bilingual answer — by modeling both sides of that question with the same
rigor: a person's Entrepreneur DNA (Document 2) and a business concept's
Business DNA (Document 3), connected through an explicit, inspectable
Knowledge Graph (Document 4) rather than an opaque model call.

## Product Philosophy

BusinessDNA is built the way a scientific instrument is built before it's
switched on: the measurement apparatus (Assessment), the reference
material (the Business Genome Library), and the comparison framework
(Matching Engine, Explanation Engine) are designed and validated as
*shapes* before any scoring logic is allowed to touch them. This is not
incidental process — it's a deliberate response to the risk every
matching product faces: a plausible-looking number with no real reasoning
behind it. Every engine in this codebase (`matching-engine`,
`explanation-engine`, `knowledge-engine`) currently throws
`NotImplementedError` at its scoring/generation boundary specifically so
that "the shape is right" and "the logic is real" stay two separately
verifiable claims.

Visually, the product philosophy is **premium, minimal, and calm** — the
Entrepreneur DNA Results experience (`src/features/assessment/components/results/`)
is explicitly built in the register of Apple, Linear, Headspace, Notion,
and Calm: generous spacing, one accent color used sparingly, serif
display headings (DM Serif Display) over a sans body, soft shadows
instead of borders-as-decoration, and Framer Motion used for meaning
(progressive reveal, stagger) rather than as ornament. See
`src/styles/globals.css` for the token set (Deep Forest Green / Warm Cream
/ Muted Peach) this applies to every screen, not just results.

## Core Principles

1. **The shape comes before the logic.** A framework of interfaces and
   placeholder implementations is a legitimate, shippable deliverable —
   see `matching-engine/README.md`'s "this is infrastructure, not
   intelligence." Scoring, ranking, and generation logic are implemented
   later, deliberately, once the shape has been reviewed.
2. **Bilingual by design, not by afterthought.** Every user-facing string
   in the app is either a `translationKey` into `messages/en.json` /
   `messages/ro.json`, or — for the Business Genome Library specifically
   — an inline `{ en, ro }` pair authored with the document itself (see
   "A nuance worth stating precisely" below). There is no code path in
   this product where English-only text ships to a Romanian-locale user.
3. **Reuse the vocabulary, don't fork it.** `IndustryType`,
   `BusinessModelType`, and skill keys are each declared once per system
   boundary (business-engine, business-library) and referenced — never
   silently re-invented — by every consumer, including the Knowledge
   Engine (see `knowledge-engine/README.md` → "Reuse, not duplication").
   When a genuinely new vocabulary is needed (e.g. Knowledge Engine's
   Sales Methods, deliberately distinct from business-engine's
   `SalesChannel`), it gets a new, clearly-distinguished name — not a
   value that collides with an existing one under a different meaning.
4. **Structured data now, prose later.** Every explanation, reason, or
   warning this product will ever surface is modeled as a
   `translationKey` plus structured fields (category, severity, numeric
   contribution) *before* any AI-generated sentence exists — see
   `explanation-engine/README.md` → "Future AI generation." This is what
   lets the same underlying result render in multiple languages, multiple
   tones, or multiple UI surfaces without recomputing anything.
5. **Everything the product could eventually mean by "this business" or
   "this dimension" is one document, not many.** A Business Genome is
   ~38 sections in one document (Document 3), not a name plus scattered
   metadata; a person's Entrepreneur DNA is one `AssessmentFeatureVector`
   across 14 dimensions (Document 2), not per-feature snapshots that can
   drift out of sync.

## Product Rules

- A feature that reads Assessment data reads it through
  `AssessmentFeatureVector`/`NormalizedAssessmentProfile` (see
  `matching-engine/types/assessment-input.ts`), not by re-parsing raw
  `AssessmentAnswer` rows itself.
- A feature that reads business data reads a Business Genome section (see
  Document 3) or the Business Engine's narrower `BusinessCandidate`/
  `FullBusinessType` projections of it — never a hand-rolled subset.
- A feature that needs a definition, a category list, or reference
  guidance queries the Knowledge Engine (`KnowledgeEngine.getEntry()` /
  `.searchEntries()`, once implemented) rather than hard-coding its own
  copy of that vocabulary inline.
- Placeholder/mock data used to demonstrate a UI before real logic exists
  must say so, visibly, in the UI itself — not only in a code comment.
  (See "Things BusinessDNA Will Never Do" below.)

## Ethical Rules

- A user's Assessment answers are the basis for a *recommendation*, never
  a *judgment*. Low scores on a dimension (e.g. low risk tolerance) are
  framed as fit information, not as a verdict on the person.
- Nothing in this product should present a probabilistic match as
  certainty. `confidenceScore` exists on `CompatibilityResult`
  specifically so "how sure is this" is always a first-class, visible
  number alongside "what is this," once real scoring exists.
- A user's identity (Clerk `useUser()`) is used for display and
  personalization (e.g. the DNA Certificate's name field) — never
  silently repurposed for anything the user didn't ask for on that
  screen.

## Things BusinessDNA Will Never Do

1. **Never present placeholder or illustrative data as if it were a real
   recommendation.** This is not aspirational — it's already enforced:
   `results/recommended-opportunities.tsx` labels every sample business
   with an explicit disclaimer ("Illustrative example — your real matches
   are calculated once your assessment is fully processed"), and its
   "Explore Business" button is rendered `disabled` specifically so a
   placeholder card can never be mistaken for something clickable/real.
   Any future feature showing sample data must meet or exceed this bar —
   visible disclaimer text plus a disabled or otherwise clearly-inert
   call to action.
2. **Never generate or imply business advice without a clear
   placeholder/real distinction until the underlying engine is actually
   implemented.** The Matching Engine, Explanation Engine, and Knowledge
   Engine are all, today, frameworks of interfaces and
   `NotImplementedError`-throwing placeholders — see each feature's
   README. No UI may present their eventual output as if it already
   exists; no service may quietly fabricate a plausible-looking number or
   sentence to fill the gap while a real implementation is pending.
3. **Never store user- or business-facing narrative content as anything
   other than a translation reference.** See the nuance below for exactly
   what "translation reference" means in this codebase.
4. **Never fork a vocabulary that already exists elsewhere in the
   codebase.** (Core Principle 3, restated as a hard rule — see
   `knowledge-engine/README.md`'s "CRITICAL — reuse, don't duplicate" for
   the concrete precedent this is meant to generalize.)
5. **Never let a UI section claim to be one of the eleven results
   sections' semantics if it isn't backed by the corresponding data
   shape.** E.g. the Primary Archetype card and the DNA Profile cards are
   deliberately different vocabularies (see Document 2's "Existing
   archetype vocabularies") — a future feature must not conflate them
   into one without an explicit, reviewed decision to reconcile.

### A nuance worth stating precisely

The epic that requested this canon phrased principle 3 as "never store
narrative content as anything other than `translationKey`s." That is
*almost* true and worth stating precisely rather than rounding off: the
app's UI strings (`src/features/*/components/`) are indeed always
`translationKey`s into `messages/*.json`. But the Business Genome Library
is a deliberate, documented exception — its narrative fields
(`description`, `marketingStrategy.positioning`, `risks[].description`,
etc.) are inline `{ en, ro }` pairs (`localizedTextSchema`), not
`translationKey`s, because a genome is "a large, self-contained package
of long-form content [that] belongs with the document, not scattered
across the app's UI translation files" (`business-library/README.md`).
The real, underlying principle both patterns serve is **bilingual by
design, no locale left as an afterthought** — the mechanism (key
reference vs. inline pair) is chosen per system based on whether the
content is short UI copy or a long-form authored document, and that
choice should stay deliberate, not accidental, the next time a new
content type is added.

## Decision Principles

When a future decision isn't obviously covered by the rules above:

1. **Prefer the shape that already exists.** If `MatchingDimension`,
   `KnowledgeDomain`, or a Business Genome section already models the
   concept in question, extend it — don't create a parallel one, even a
   "better" one, without a documented migration.
2. **Prefer an honest gap over a papered-over one.** If two parts of the
   system don't yet reconcile (see the three archetype vocabularies in
   Document 2), document the inconsistency and its resolution as future
   work rather than silently picking a winner in one PR.
3. **Prefer explainability over accuracy-by-opacity.** A slightly simpler
   scoring model whose reasoning is fully inspectable
   (`CompatibilityResult.reasoning`, `ExplanationResult`) is preferred
   over a black-box model that scores marginally better but can't produce
   a structured "why."
4. **Prefer a placeholder that fails loudly over one that fails
   silently.** `NotImplementedError` (matching-engine, explanation-engine)
   is the house style for "not built yet" — a stubbed function that
   quietly returns a plausible-looking fake result is not acceptable
   anywhere in this codebase.

## UX Philosophy

- **Progressive reveal, not information dump.** The results experience
  discloses eleven sections in sequence (Reveal → DNA Score → Primary
  Archetype → DNA Profile → Strengths → Growth Opportunities → Work Style
  → Best Opportunities → Why These Fit → Certificate → Mission Control
  CTA), each animating in via the same Framer Motion stagger pattern,
  rather than rendering everything at once.
- **One accent, used sparingly.** Muted Peach (`--accent`) marks the
  single "this is the important number/action" signal per view; it is not
  a general-purpose highlight color.
- **Calm density.** Generous spacing and soft shadows (`shadow-soft`,
  20px radius) over dense grids or hard borders — the product should feel
  closer to a wellness app reflecting on you than a dashboard reporting
  on you.
- **No decorative motion.** Every animation in this codebase ties to a
  real state change (data revealed, a section entering the viewport) —
  see the canon rule against spinners-as-decoration already enforced in
  the results-page design brief. Motion communicates sequence and
  causality, not just liveliness.
