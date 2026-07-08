# BusinessDNA

A production-ready foundation for BusinessDNA — an AI-powered platform that
helps people discover, validate, build and launch a business that fits who
they are.

This repository is a **scaffold**: project structure, routing, design
system, reusable components and integration points are all in place. Actual
business logic (matching algorithm, blueprint generation, financial
modelling) is intentionally left as clearly marked integration points, so it
can be implemented against real data rather than hard-coded assumptions.

## Stack

- **Next.js 16** (App Router) + **TypeScript** (strict mode)
- **Tailwind CSS** + a small `shadcn/ui`-style component set
- **Prisma** + **PostgreSQL**
- **Clerk** for authentication (Google, Apple, email, forgot password)
- **Stripe** for billing
- **OpenAI** for the matching engine and AI Co-Founder
- **React Hook Form** + **Zod** for forms and validation
- **Framer Motion** for the landing page
- **next-intl** for internationalization (English + Romanian)

## Project structure

```
src/
  app/
    [locale]/
      (marketing)/      → public landing page
      (auth)/            → sign-in, sign-up, forgot-password (Clerk)
      (onboarding)/      → first screen after login (two-path selector)
      (dashboard)/       → Mission Control + all authenticated feature pages
      (admin)/           → separate, role-gated admin area
    api/
      webhooks/          → Clerk + Stripe webhook handlers
      ai/                → AI Co-Founder chat endpoint
  components/
    ui/                  → design-system primitives (Button, Card, Badge…)
    layout/              → sidebar, topbar, mobile nav, language switcher…
    marketing/           → landing page sections
  features/              → one folder per product feature, own components
  lib/                   → db client, auth helpers, stripe, fonts, utils
  ai/                    → OpenAI client + locale-aware prompt builders
  hooks/, types/, styles/
prisma/
  schema.prisma          → core data model
messages/
  en.json, ro.json       → every user-facing string, see i18n below
```

## Internationalization

Every visible string is looked up through `next-intl` (`useTranslations` on
the client, `getTranslations` on the server) from `messages/en.json` and
`messages/ro.json` — nothing is hard-coded in a component. Adding a third
language later means: add its code to `src/i18n/config.ts`, add a matching
`messages/<locale>.json`, and nothing else in the app needs to change.

AI-generated documents (blueprints, roadmaps, marketing plans, financial
forecasts, contracts, templates, and AI Co-Founder replies) must be produced
in the user's current app locale. `src/ai/prompts/business-match.ts` centralizes
this: every prompt sent to OpenAI is built through `withLocaleInstruction()`,
which explicitly pins the response language rather than asking the model to
guess it from the input.

The language switcher lives in Settings (`/settings`) and in the public site
header, both backed by the same `<LanguageSwitcher />` component.

## Design system

Tokens are defined once as CSS variables in `src/styles/globals.css` (light
and dark) and consumed through Tailwind's `tailwind.config.ts`. Palette:
background `#F7F8F5`, surface `#FFFFFF`, primary Deep Forest Green, secondary
Warm Cream, accent Muted Peach, plus success/warning/error. Headings use DM
Serif Display, body text uses Inter, corners are 20px, shadows are soft, and
there are no gradients or glassmorphism anywhere in the UI.

## Getting started

```bash
cp .env.example .env
npm install
npm run db:push       # sync Prisma schema to your Postgres instance
npm run dev
```

You'll need real keys for Clerk, Stripe and OpenAI in `.env` for those
integrations to function — routes that depend on them fail loudly rather
than silently if a key is missing.

## Assessment feature

The full onboarding assessment lives in `src/features/assessment`:

- `config/sections.ts` — the question bank (8 sections, ~40 questions across
  single choice, multiple choice, slider, rating, cards, short text and long
  text). This is the single source of truth for structure; question and
  option copy lives in `messages/*.json` under `assessment.questions.*`,
  keyed the same way.
- `prisma/seed.ts` seeds `AssessmentQuestion` from that same config — run
  `npm run db:seed` after changing the question bank.
- Progress autosaves via server actions in `actions/assessment-actions.ts`
  (debounced client-side, flushed on every "Next"), so a session can always
  be resumed later — `getOrCreateActiveSession()` is what makes that work.
- The flow itself (`components/assessment-flow.tsx`) covers intro → one
  question per screen → review → an animated "thinking" screen → a results
  placeholder. Business matching is intentionally not implemented — see
  "What's intentionally not implemented" below.

## Business Engine (catalog domain layer)

The foundation for recommendations lives in `src/features/business-engine`
— see `src/features/business-engine/README.md` for the full architecture.
In short: a normalized catalog (`BusinessType` and everything hanging off
it), four repositories abstracting access to it, Zod validation for every
entity, and two tables (`BusinessQuestionWeight`, `BusinessMatchResult`)
that exist specifically for the not-yet-built matching engine to read from
and write to. No catalog content is seeded and no matching algorithm is
implemented — this is schema and architecture only.

## Business Genome Library

`/business-library` (project root, not under `src/`) is the standard every
`BusinessType` document must follow — see `business-library/README.md` for
the full explanation. `schema.ts` is a strict, ~40-section Zod schema
covering everything from identity and founder fit to financials, risk, a
90-day plan, and a `matchingMetadata` section that's the bridge to
`features/matching-engine` (every field there is optional; no weights or
values are implied by the schema itself). One reference genome — **AI
Automation Agency** — is fully authored in `examples/` (typed TS, validated
at import time) and `json/` (the plain-data form other systems should
read). Validate every document with `npm run validate:business-library`.

## Matching Engine (framework only)

`src/features/matching-engine` is the nine-stage pipeline that will
eventually compare a completed Assessment against the Business Engine
catalog — see `src/features/matching-engine/README.md` for the full
architecture. Every service (`AssessmentNormalizer`,
`BusinessCandidateProvider`, `ScoreCalculator`, `CompatibilityCalculator`,
`RuleEngine`, `RankingEngine`, `ExplanationGenerator`, and the top-level
`MatchingEngine` orchestrator) is a dependency-injected interface with a
placeholder implementation that throws `NotImplementedError` — no scoring
happens, no weights are assigned, no rules exist, and no business is
recommended. Run its test suite with `npm test`.

## What's intentionally not implemented

- The business-matching algorithm itself — `features/matching-engine` is
  now a complete, tested *framework* for it (nine pipeline stages, seven
  DI'd services, a 14-dimension scoring model, a rule system, five prompt
  templates), but every implementation in it is a placeholder that throws
  `NotImplementedError`
- The catalog content itself — `prisma/seed-business-engine.ts` is
  structurally complete but intentionally empty. (The Business Genome
  Library at `/business-library` has exactly one authored example so far —
  AI Automation Agency — as the reference template, not a populated
  catalog; there is intentionally no ingestion script yet moving genomes
  into the Business Engine's database.)
- Blueprint/marketing/financial/launch *generation* logic (the templates
  that define their shape exist; the AI calls that fill them in don't)
- Stripe checkout session creation (webhook handling exists; the "create a
  checkout session" server action does not)

These are the natural next slice of work once the product's actual matching
rules and document formats are defined.
